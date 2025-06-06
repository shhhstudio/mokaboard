import React from "react";
import { Status as ChakraStatus } from "@chakra-ui/react";

export type StatusValue = "success" | "error" | "warning" | "info";

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue;
}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { value = "info", ...rest } = props;
        return (
            <ChakraStatus.Root ref={ref} {...rest} mr={2}>
                <ChakraStatus.Indicator bgColor={`moka.${value}`} />
            </ChakraStatus.Root>
        );
    }
);
