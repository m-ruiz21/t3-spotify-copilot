"use client"

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/_components/navbar'
import { VStack, Box, Text, Button, Input, Flex, InputGroup, InputRightElement } from '@chakra-ui/react';
import LoadingScreen from './_components/loading';
import { ArrowUpIcon } from '@chakra-ui/icons';



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
  const [profileLoaded, setProfileLoaded] = useState(true);

  if (!profileLoaded) {
    return <LoadingScreen />;
  }

return (
  <main className="bg-[#191414] h-screen">
    <Navbar/>
    <Flex direction="column" justifyContent="space-between" width="75%" marginRight="auto" marginLeft="auto" h="calc(100vh - 10vh)" p={4}>
      <VStack spacing={4} align="stretch">
        {messages.map((message, index) => (
          <Box key={index} alignSelf="flex-start">
            <Text color={message.sender === "user" ? "blue.500" : "green.500"}>{message.text}</Text>
          </Box>
        ))}
      </VStack>
      <Box display="flex" alignItems="center" mt={4}>
        <InputGroup size="md" alignItems="center">
          <Input pr="4.5rem" type="text" placeholder="Type a message" value={input} onChange={e=> setInput(e.target.value)} height="2.5rem" p="1.5rem"/>
          <InputRightElement p="1.5rem">
            <Button size="sm" colorScheme="teal">
              <ArrowUpIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Flex>
  </main>
);
}