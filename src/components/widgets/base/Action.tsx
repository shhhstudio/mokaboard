import React from "react";
import { IconButton } from "@chakra-ui/react";
import { LuHand, LuMaximize2 } from "react-icons/lu";
import { IconType } from "react-icons";

export type ActionValue = "open" | "participate";

interface ScopeProps {
    ariaLabel?: string;
    type?: ActionValue
}

const ActionMap: Record<ActionValue, IconType> = {
    open: LuMaximize2,
    participate: LuHand,
};

export const Action: React.FC<ScopeProps> = ({ type, ariaLabel }) => {
    const Icon = type ? ActionMap[type] : LuHand;
    return (
        <IconButton
            size={"2xs"}
            rounded="full"
            aria-label={ariaLabel || "Action"}
            variant="solid"
            bgColor="moka.300"
            color="black"
        >
            <Icon />
        </IconButton>
    )
};
