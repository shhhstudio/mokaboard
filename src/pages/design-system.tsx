import * as React from "react";
import { Center, SimpleGrid, Box, Heading } from "@chakra-ui/react";
import { StatusWidget, TitleWidget } from "@/components/widgets";

const DesignSystemPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="gray.50" p={10}>
      <Heading mb={8} textAlign="center">MOKABOARD Design System</Heading>
      <SimpleGrid columns={[1, 2, 3]} gap={8} width="max-content" marginX="auto">
        <StatusWidget title="Weekly Update" status="success" />
        <StatusWidget title="Weekly Update" status="warning" />
        <StatusWidget title="Weekly Update" status="error" />

      </SimpleGrid>
    </Box>
  );
};

export default DesignSystemPage;
