import * as React from "react";
import { Box, Heading, Center } from "@chakra-ui/react";

const IndexPage: React.FC = () => {
  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
        <Heading>MOKABOARD</Heading>
      </Box>
    </Center>
  );
};

export default IndexPage;
