import React from "react";
import { Box } from "@chakra-ui/react";
import { EditableText } from "./EditableText";

interface HeadingProps {
    value?: string;
    onChange?: (v: string) => void;
}

export const Heading: React.FC<HeadingProps> = ({ value, onChange }) => {
    return (
        <Box maxHeight="100%" overflow="hidden" position="relative">
            <EditableText
                value={value}
                onChange={onChange}
                fontSize="lg"
                fontWeight={500}
                lineHeight="1.25"
            />
        </Box>
    );
};
