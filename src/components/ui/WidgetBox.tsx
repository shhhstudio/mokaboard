import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export const WidgetBox = ({ children, ...props }: FlexProps) => (
    <Flex
        p={4}
        borderRadius="2xl"
        bg="widgetBg"
        width="200px"
        height="200px"
        flexDirection={"column"}
        {...props}
    >
        {children}
    </Flex>
);

