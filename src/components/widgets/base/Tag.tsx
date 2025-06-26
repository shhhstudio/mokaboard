import React, { useState } from "react";
import { Badge, Box } from "@chakra-ui/react";
import { EditableLine } from "@/components/EditableLine";

interface TagProps {
    tag?: string;
    onChange?: (v: string) => void;
}

export const Tag: React.FC<TagProps> = ({ tag, onChange }) => {

    return (
        <Badge
            as={Box}
            display="inline-block"
            height={6}
            px={2}
            bgColor="whiteAlpha.700"
            color="blackAlpha.700"
            fontSize="sm"
            fontWeight={500}
            rounded="full"
        >
            <EditableLine
                defaultValue={tag}
                onChange={onChange}
                placeholder="Tag..."
            />
        </Badge>
    );
};
