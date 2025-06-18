import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export interface ContainerProps extends FlexProps {
    // You can add custom props here if needed in the future
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ children, ...props }, ref) => (
        <Flex
            ref={ref}
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
    )
);
Container.displayName = "Container";

