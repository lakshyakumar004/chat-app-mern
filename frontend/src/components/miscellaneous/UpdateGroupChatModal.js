import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListitem from '../UserAvatar/UserListitem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const {user,selectedChat,setSelectedChat} = ChatState();
    const [renameloading, setRenameloading] = useState(false);
    const toast = useToast();

    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
            toast({
                title:'Only Admin has Permission to Remove Users',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                },
            };
            const {data} = await axios.put('/api/chat/groupremove',{
                chatId:selectedChat._id,
                userId:user1._id,
            },config);
            user1._id===user._id?setSelectedChat():setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title:'Error Occured',
                description:error.response.data.message,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
        }
    };

    const handleRename = async()=>{
        if(!groupChatName){
            return;
        }
        try {
            setRenameloading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data} = await axios.put('/api/chat/rename',{
                chatId:selectedChat._id,
                chatName:groupChatName,
            },config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
            toast({
                title:'Error Occured',
                description:error.response.data.messsage,
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setRenameloading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async(query)=>{
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleToAddUser = async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:'User Already in the Group',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            return;
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                title:'Only Admin has Permission to Add Users',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                },
            };
            const {data} = await axios.put('/api/chat/groupadd',{
                chatId:selectedChat._id,
                userId:user1._id,
            },config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title:'Error Occured',
                status:'error',
                duration:5000,
                isClosable:true,
                position:'bottom',
            });
            setLoading(false);
        }
    };
    return (
        <>
            <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader
                     fontSize='35px'
                     fontFamily='Work sans'
                     display='flex'
                     justifyContent='center'
                     >
                        {selectedChat.chatName}
                </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map((u)=>(
                                <UserBadgeItem
                                key={user._id}
                                user={u}
                                handleFunction={()=>handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input
                            placeholder='Chat Name'
                            mb={3}
                            value={groupChatName}
                            onChange={(e)=>setGroupChatName(e.target.value)}
                            />
                            <Button
                            variant='solid'
                            colorScheme='teal'
                            ml={1}
                            isLoading={renameloading}
                            onClick={handleRename}
                            >Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input
                            placeholder='Add User to the Group'
                            mb={1}
                            onChange={(e)=>handleSearch(e.target.value)}
                            /> 
                            {loading?(
                                <Spinner size='lg'/>
                            ):(
                                searchResult?.map((user)=>(
                                    <UserListitem
                                    key={user._id}
                                    user={user}
                                    handleFunction={()=>handleToAddUser(user)}
                                    />
                                ))
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={()=>handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal