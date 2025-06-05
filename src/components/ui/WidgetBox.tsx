import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export const WidgetBox = ({ children, ...props }: FlexProps) => (
    <Flex
        p={4}
        borderRadius="xl"
        boxShadow="xs"
        bg="white"
        width="200px"
        height="200px"
        display="flex"
        flexDirection={"column"}
        {...props}
    >
        {children}
    </Flex>
);
