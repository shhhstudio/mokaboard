import React from "react";
import { SimpleGrid, Flex } from "@chakra-ui/react";
import { StatusWidget } from "@/components/widgets";

const DesignSystemPage: React.FC = () => {
  return (
    <Flex minH="100vh" bg="white" p={0} alignItems={"center"} justifyContent="center">
      <SimpleGrid columns={[2, 2, 3, 4]} gap={[2, 6, 6, 8]} width="max-content" marginX="auto">
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
        <StatusWidget title="Weekly Update" status="error" />
        <StatusWidget title="Prod Malaisie lancée. Prod Chine en finalisation." status="success" />
        <StatusWidget title="Pas de Master Plan. Ventes en RUN." status="warning" />
      </SimpleGrid>
    </Flex>
  );
};

export default DesignSystemPage;
