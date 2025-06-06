import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export const WidgetBox = ({ children, ...props }: FlexProps) => (
    <Flex
        p={4}
        borderRadius="2xl"
        bg="white"
        width="200px"
        height="200px"
        display="flex"
        flexDirection={"column"}
        bgColor="#F3EFEC"
        {...props}
    >
        {children}
    </Flex>
);
