import React from "react";
import { IconButton } from "@chakra-ui/react";
import { LuHand, LuMaximize2, LuTrash2 } from "react-icons/lu";
import { IconType } from "react-icons";

export type ActionValue = "open" | "participate" | "delete";

interface ScopeProps {
    ariaLabel?: string;
    type?: ActionValue;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ActionMap: Record<ActionValue, IconType> = {
    open: LuMaximize2,
    participate: LuHand,
    delete: LuTrash2,
};

export const Action: React.FC<ScopeProps> = ({ type, onClick, ariaLabel }) => {
    const Icon = type ? ActionMap[type] : LuHand;
    return (
        <IconButton
            size={"2xs"}
            rounded="full"
            aria-label={ariaLabel || "Action"}
            variant="solid"
            bgColor="moka.300"
            color="black"
            onClick={(e) => {
                e.stopPropagation();
                if (onClick) {
                    onClick(e);
                }
            }}
        >
            <Icon />
        </IconButton>
    );
};
