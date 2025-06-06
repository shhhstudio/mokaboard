import React from "react";
import { WidgetBox } from "@/components/ui/WidgetBox";
import {
    Text,
    Flex,
    Badge,
    Status as ChakraStatus,
    IconButton,
} from "@chakra-ui/react";
import type { Color } from "@chakra-ui/react";
import { LuHand, LuMaximize2 } from "react-icons/lu";
import { Status, StatusValue, Scope, Action, Heading } from "./base/index";

interface StatusWidgetProps {
    title?: string;
    status?: StatusValue;
}

export const StatusWidget: React.FC<StatusWidgetProps> = ({
    title,
    status,
}) => (
    <WidgetBox>
        <Flex gap={1} alignItems="center" justifyContent="space-between">
            <Flex gap={1}>
                <Scope scope="Project" />
                <Scope scope="UX" />
            </Flex>
            <Status value={status} />
        </Flex>
        <Flex alignItems="center" gap={2} ml={1} grow={1}>
            <Heading size="md" fontWeight={450}>{title}</Heading>
        </Flex>
        <Flex gap={1}>
            <Action type="participate" aria-label="Participate in discussion" />
        </Flex>
    </WidgetBox>
);
