import React, { useCallback } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Container, Status, Scope, Action, Heading } from "./base/index";
import { Widget as WidgetType } from "@/types";
import isEqual from "lodash/isEqual";

interface WidgetProps extends React.ComponentProps<typeof Container> {
    widget: WidgetType;
    selected?: boolean;
    onChange?: (v: Partial<WidgetType>) => void;
    onDelete?: (widget: any) => Promise<void>;
}

export const Widget: React.FC<WidgetProps> = React.memo(
    ({ widget, selected = false, onChange, onDelete, ...containerProps }) => {
        const onChangeField = useCallback(
            (field: string) => {
                return (newValue: string) => {
                    if (onChange) {
                        const changes: Partial<WidgetType> = {
                            [field]: newValue,
                        };
                        onChange(changes);
                    }
                };
            },
            [onChange]
        );
        return (
            <Container position="relative" {...containerProps}>
                {(widget?.status !== null || selected === true) && (
                    <Box position="absolute" right={4.5} top={2.5}>
                        <Status value={widget?.status || "none"} onChange={onChangeField("status")} />
                    </Box>
                )}
                {widget?.scopes && widget?.scopes.length > 0 && (
                    <Flex gap={1} position="absolute">
                        {widget.scopes.map((scope, index) => (
                            <Scope key={index} scope={scope} />
                        ))}
                    </Flex>
                )}
                <Flex alignItems="center" gap={2} ml={1} grow={1} maxHeight="100%">
                    <Heading
                        value={widget?.title || ""}
                        onChange={onChangeField("title")}
                    />
                </Flex>
                {selected === true && (
                    <Flex gap={1} position="absolute" bottom={3} bgColor="red.100" right={3}>
                        <Action type="delete" aria-label="Delete Widget" onClick={onDelete} />
                    </Flex>
                )}
            </Container>
        );
    },
    (prevProps, nextProps) => {
        return isEqual(prevProps, nextProps);
    }
);
