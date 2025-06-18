import React, { useCallback } from "react";
import { Status as ChakraStatus, Menu, Portal } from "@chakra-ui/react";
import { Widget } from "@/types";

export type StatusValue = Widget["status"] | "none";

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue;
    onChange?: (v: string) => void;
}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { value, onChange, ...rest } = props;
        if (value === undefined || value === null) {
            return null;
        }
        const handleSelect = useCallback((selectedValue: any) => {
            if (onChange) {
                onChange(selectedValue.value === "none" ? null : selectedValue.value);
            }
        }, [onChange]);
        return (
            <Menu.Root onSelect={handleSelect}>
                <Menu.Trigger asChild>
                    <ChakraStatus.Root ref={ref} {...rest} cursor={"pointer"}>
                        <ChakraStatus.Indicator bgColor={`moka.${value}`} />
                    </ChakraStatus.Root>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item value="on_track">
                                <ChakraStatus.Root ref={ref} {...rest}>
                                    <ChakraStatus.Indicator bgColor={`moka.on_track`} />
                                </ChakraStatus.Root>
                                Done / On Track
                            </Menu.Item>
                            <Menu.Item value="at_risk">
                                <ChakraStatus.Root ref={ref} {...rest}>
                                    <ChakraStatus.Indicator bgColor={`moka.at_risk`} />
                                </ChakraStatus.Root>
                                In Progress / At Risk
                            </Menu.Item>
                            <Menu.Item value="fail">
                                <ChakraStatus.Root ref={ref} {...rest}>
                                    <ChakraStatus.Indicator bgColor={`moka.fail`} />
                                </ChakraStatus.Root>
                                Urgent / Fail
                            </Menu.Item>
                            <Menu.Item value="none">
                                <ChakraStatus.Root ref={ref} {...rest}>
                                    <ChakraStatus.Indicator bgColor={`moka.none`} />
                                </ChakraStatus.Root>
                                None
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }
);
