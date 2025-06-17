import React, { useCallback } from "react";
import { Flex, Box } from "@chakra-ui/react";
import {
    Container,
    Status,
    StatusValue,
    Scope,
    Action,
    Heading,
} from "./base/index";
import { Widget } from "@/types";

interface StatusWidgetProps {
    widget: Widget;
    onChange?: (v: Partial<Widget>) => void;

}

const InternalStatusWidget: React.FC<StatusWidgetProps> = ({
    widget,
    onChange,
}) => {

    const onChangeField = useCallback(
        (field: string) => {
            return (newValue: string) => {
                if (onChange) {
                    const changes: Partial<Widget> = {
                        [field]: newValue,
                    };
                    onChange(changes);
                }
            };
        },
        [onChange]
    );

    console.log("StatusWidget render", widget.id, widget.title, widget.status, widget.value, widget.scopes);

    return (
        <Container position="relative">
            {widget?.status !== null && (
                <Box position="absolute" right={4.5} top={2.5}>
                    <Status value={widget?.status} />
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
                <Heading value={widget?.title || ""} onChange={onChangeField("title")} />
            </Flex>
            {false && (
                <Flex gap={1} position="absolute" bottom={3}>
                    <Action type="participate" aria-label="Participate in discussion" />
                </Flex>
            )}
        </Container>
    );
};

const areEqual = (prevProps: StatusWidgetProps, nextProps: StatusWidgetProps) => {
    // Only re-render if widget id or value/status/title/scopes change
    const prev = prevProps.widget;
    const next = nextProps.widget;
    console.log(prev, next, (
        prev.id === next.id &&
        prev.title === next.title &&
        prev.status === next.status &&
        JSON.stringify(prev.value) === JSON.stringify(next.value) &&
        JSON.stringify(prev.scopes) === JSON.stringify(next.scopes)
    ))
    return (
        prev.id === next.id &&
        prev.title === next.title &&
        prev.status === next.status &&
        JSON.stringify(prev.value) === JSON.stringify(next.value) &&
        JSON.stringify(prev.scopes) === JSON.stringify(next.scopes)
    );
};

export const StatusWidget = React.memo(InternalStatusWidget, areEqual);
