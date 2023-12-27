import React from 'react';
import { Box, Spinner, Flex, keyframes, Text } from "@chakra-ui/react";

const bounceAndColor = keyframes`
  0%, 100% { 
    transform: scale(.5); 
    background-color: white;
  }
  50% { 
    transform: scale(1.0); 
    background-color: #1DB954;
  }
`;

export const LoadingScreen = () => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" backgroundColor="#191414">
            <Flex alignItems="flex-end" marginBottom="8">
                <Text fontSize="4xl" color="white" marginRight="2" lineHeight="1">
                    Loading Profile
                </Text>
                <Box sx={{animation: `${bounceAndColor} 1.4s infinite ease-in-out both`, animationDelay: "-0.32s"}} backgroundColor="white" height="0.5em" width="0.5em" borderRadius="50%" margin="3px"></Box>
                <Box sx={{animation: `${bounceAndColor} 1.4s infinite ease-in-out both`, animationDelay: "-0.16s"}} backgroundColor="white" height="0.5em" width="0.5em" borderRadius="50%" margin="3px"></Box>
                <Box sx={{animation: `${bounceAndColor} 1.4s infinite ease-in-out both`}} backgroundColor="white" height="0.5em" width="0.5em" borderRadius="50%" margin="3px"></Box> 
            </Flex>
            <Spinner 
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#1DB954"
                size="xl"
            />
        </Box>
    );
}

export default LoadingScreen;