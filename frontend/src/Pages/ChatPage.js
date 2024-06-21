import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

    const {user} = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return(
        <div style={{width:'100%'}}>
            {user && <SideDrawer/>}
            <Box
            display='flex'
            justifyContent='space-between'
            w='100%'
            h='95vh'
            p='12px'
            >
                {user && <MyChats fetchAgain = {fetchAgain}/>}
                {user && (
                    <ChatBox fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>
                    )}
            </Box>
        </div>
    )
};

export default ChatPage