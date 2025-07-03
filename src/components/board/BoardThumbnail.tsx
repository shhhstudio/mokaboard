import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

export interface BoardThumbnailProps extends FlexProps {
}

export const BoardThumbnail = React.forwardRef<HTMLDivElement, BoardThumbnailProps>(
    ({ children, ...props }, ref) => (
        <Flex
            ref={ref}
            p={3}
            borderRadius="2xl"
            bg="moka.background.solid"
            width="176px"
            direction="column"
            {...props}
        >
            {children}
        </Flex>
    )
);

