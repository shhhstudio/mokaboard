import React from "react";
import {
  Box, Heading, Center,
  Button,
  Container,
  Field,
  HStack,
  Stack,
  Text,
  VStack,
  Badge, Flex, Icon, SimpleGrid,

} from "@chakra-ui/react";
import { Layout } from "@/components/layout/Layout";
import { LuRocket } from 'react-icons/lu'
import { Heroe } from "@/sections/website/heroe/heroe";



/*const IndexPage: React.FC = () => {
  return (
    <Center minH="100vh" bg="gray.50">
      <Box p={8} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
        <Heading>MOKABOARD</Heading>
      </Box>
    </Center>
  );
};*/


const IndexPage: React.FC = () => {
  return (
    <Layout type="web">
      <Layout.Content>
        <Heroe />
      </Layout.Content>
    </Layout>
  );
};

export default IndexPage;
