import React from "react";
import { Badge } from "@chakra-ui/react";

interface ScopeProps {
    scope?: string;
}

export const Scope: React.FC<ScopeProps> = ({ scope }) => (
    <Badge height={6} px={2} bgColor="whiteAlpha.700" color="blackAlpha.700" fontSize={"xs"} rounded="full">
        {scope || "No Scope"}
    </Badge >
);
