import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export const Container = ({ children, ...props }: FlexProps) => (
    <Flex
        p={3}
        borderRadius="2xl"
        bg="widgetBg"
        width="176px"
        height="176px"
        flexDirection={"column"}
        {...props}
    >
        {children}
    </Flex>
);

