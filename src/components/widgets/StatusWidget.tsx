import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Container, Status, StatusValue, Scope, Action, Heading } from "./base/index";

interface StatusWidgetProps {
    title?: string;
    status?: StatusValue;
    scopes?: string[];
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({
    title,
    status,
    scopes = [],
}) => (
    <Container position="relative">
        {status !== "none" && (<Box position="absolute" right={4.5} top={2.5}><Status value={status} /></Box>)}
        {scopes.length > 0 && (
            <Flex gap={1} position="absolute">
                {scopes.map((scope, index) => (
                    <Scope key={index} scope={scope} />
                ))}
            </Flex>)}
        <Flex alignItems="center" gap={2} ml={1} grow={1}>
            <Heading size="md" fontWeight={450}>{title}</Heading>
        </Flex>
        {false && <Flex gap={1} position="absolute" bottom={3}>
            <Action type="participate" aria-label="Participate in discussion" />
        </Flex>}
    </Container>
);
