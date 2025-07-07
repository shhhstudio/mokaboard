import React, { useCallback } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Container, Status, Tag, Action, Heading } from "./base";
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
            <Container position="relative" {...containerProps} bgColor={widget.status === "fail" ? "red.100" : (widget.status === "at_risk" ? "orange.100" : (widget.status === "on_track" ? "green.100" : undefined))}>
                {(widget?.status !== null || selected === true) && (
                    <Box position="absolute" right={4.5} top={2.5}>
                        <Status value={widget?.status || "none"} onChange={onChangeField("status")} />
                    </Box>
                )}
                <Flex gap={1}>
                    <Tag tag={widget?.tag || undefined} onChange={onChangeField("tag")} />
                </Flex>
                <Flex alignItems="flex-start" gap={2} ml={1} mt={2} grow={1} maxHeight="100%">
                    <Heading
                        value={widget?.title || ""}
                        onChange={onChangeField("title")}
                    />
                </Flex>
                {selected === true && (
                    <Flex gap={2} position="absolute" bottom={3} right={3}>
                        <Action type="delete" aria-label="Delete Widget" onClick={onDelete} />
                        <Action type="open" aria-label="Open Widget" onClick={() => { }} />
                    </Flex>
                )}
            </Container>
        );
    },
    (prevProps, nextProps) => {
        return isEqual(prevProps, nextProps);
    }
);
