import React from "react";
import { Status as ChakraStatus } from "@chakra-ui/react";
import { Widget } from "@/types";

export type StatusValue = Widget["status"];

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue;
}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { value, ...rest } = props;
        if (value === undefined || value === null) {
            return null;
        }
        return (
            <ChakraStatus.Root ref={ref} {...rest}>
                <ChakraStatus.Indicator bgColor={`moka.${value}`} />
            </ChakraStatus.Root>
        );
    }
);
