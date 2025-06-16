import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { Container } from "./base/Container";
import { LuPlus } from "react-icons/lu";

export interface BlankWidgetProps {
    onAdd: () => void;
    idx: number;
}

export const BlankWidget: React.FC<BlankWidgetProps> = ({ onAdd }) => (
    <Container bg="widgetBgBlank">
        <Flex alignItems="center" justify="center" grow={1}>
            <IconButton
                aria-label="Add Widget"
                variant="subtle"
                size="lg"
                borderRadius="full"
                fontSize="2xl"
                fontWeight={700}
                onClick={onAdd}
            >
                <LuPlus size={28} />
            </IconButton>
        </Flex>

    </Container >
);
