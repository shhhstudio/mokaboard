import * as React from "react";
import { Center, SimpleGrid, Box, Heading } from "@chakra-ui/react";
import { StatusWidget, TitleWidget } from "@/components/widgets";

const DesignSystemPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="white" p={0}>
      <Heading mb={8} textAlign="center">MOKABOARD Design System</Heading>
      <SimpleGrid columns={[2, 2, 3, 4]} gap={[2, 6, 6, 8]} width="max-content" marginX="auto">
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
      </SimpleGrid>
    </Box>
  );
};

export default DesignSystemPage;
