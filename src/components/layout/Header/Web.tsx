import React from "react";
import { Heading, Flex } from "@chakra-ui/react";

export const Web: React.FC = () => {
    return (
        <Flex
            as="header"
            w="100%"
            bgColor="blackAlpha.800"
            color="white"
            px={8}
            py={3}
            align="center"
            justify="space-between"
            minH={"60px"}
        >
            <Heading size="md">Mokaboard</Heading>
        </Flex>
    );
};
