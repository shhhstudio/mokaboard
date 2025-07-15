import React from "react";
import { Flex, IconButton, Icon } from "@chakra-ui/react";
import { Container } from "./base/Container";
import { LuPlus } from "react-icons/lu";

export interface BlankWidgetProps {
    onAdd?: () => void;
    idx: number;
}

const InternalBlankWidget: React.FC<BlankWidgetProps> = ({ onAdd }) => (
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
                <LuPlus />
            </IconButton>
        </Flex>
    </Container>
);

export const BlankWidget = React.memo(InternalBlankWidget);
