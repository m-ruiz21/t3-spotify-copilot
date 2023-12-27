"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/_components/navbar'
import { VStack, Box, Text, Button, Input, Flex } from '@chakra-ui/react';
import LoadingScreen from './_components/loading';

export default function Home() {
  const [message, setMessage] = useState('');
  const [input, setInput] = useState('');
  const messages = [
    {
      sender: "user",
      text: "Hello Chat GPT!"
    },
    {
      sender: "bot",
      text: "Hello!"
    }
  ]
  const [profileLoaded, setProfileLoaded] = useState(false);

  if (!profileLoaded) {
    return <LoadingScreen />;
  }

return (
  <main className="bg-[#191414] h-screen">
    <Navbar/>
    <Flex direction="column" justifyContent="space-between" h="calc(100vh - 10vh)" p={4}>
      <VStack spacing={4} align="stretch">
        {messages.map((message, index) => (
          <Box key={index} alignSelf={message.sender === "user" ? "flex-end" : "flex-start"}>
            <Text color={message.sender === "user" ? "blue.500" : "green.500"}>{message.text}</Text>
          </Box>
        ))}
      </VStack>
      <Box display="flex" alignItems="center" mt={4} width="75%" marginLeft="auto" marginRight="auto">
        <Input value={input} color="white" onChange={e=> setInput(e.target.value)} placeholder="Type a message" />
        <Button ml={2} colorScheme="teal">Send</Button>
      </Box>
    </Flex>
  </main>
);
}