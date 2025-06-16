import React from "react";
import { Button, Box, IconButton } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

export interface BlankWidgetProps {
    onAdd: () => void;
    idx: number;
}

export const BlankWidget: React.FC<BlankWidgetProps> = ({ onAdd }) => (
    <Box
        minH="120px"
        bg="gray.100"
        borderRadius="md"
        opacity={0.5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
    >
        <IconButton
            aria-label="Add Widget"
            colorScheme="blue"
            variant="outline"
            size="lg"
            borderRadius="full"
            fontSize="2xl"
            fontWeight={700}
            onClick={onAdd}
        >
            <LuPlus size={28} />
        </IconButton>
    </Box>
);
