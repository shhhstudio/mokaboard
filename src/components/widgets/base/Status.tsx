import React from "react";
import { Status as ChakraStatus } from "@chakra-ui/react";

export type StatusValue = "success" | "error" | "warning" | "info" | "none";

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue;
}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { value, ...rest } = props;
        if (value === undefined || value === "none") {
            return null;
        }
        return (
            <ChakraStatus.Root ref={ref} {...rest}>
                <ChakraStatus.Indicator bgColor={`moka.${value}`} />
            </ChakraStatus.Root>
        );
    }
);
