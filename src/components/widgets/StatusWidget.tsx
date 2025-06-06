import React from "react";
import { WidgetBox } from "@/components/ui/WidgetBox";
import {
    Heading,
    Text,
    Flex,
    Badge,
    Status as ChakraStatus,
    IconButton,
} from "@chakra-ui/react";
import type { Color } from "@chakra-ui/react";
import { LuHand, LuMaximize2 } from "react-icons/lu";

type StatusValue = "success" | "error" | "warning" | "info";

interface StatusWidgetProps {
    title?: string;
    status?: StatusValue;
}

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue;
}

const statusMap: Record<StatusValue, Color> = {
    success: "statusSuccess",
    error: "statusError",
    warning: "statusWarning",
    info: "statusInfo",
};

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { children, value = "info", ...rest } = props;
        const colorPalette = rest.colorPalette ?? statusMap[value];
        return (
            <ChakraStatus.Root ref={ref} {...rest}>
                <ChakraStatus.Indicator bgColor={colorPalette} />
                {children}
            </ChakraStatus.Root>
        );
    }
);

export const StatusWidget: React.FC<StatusWidgetProps> = ({
    title,
    status,
}) => (
    <WidgetBox>
        <Flex gap={1} alignItems="center" justifyContent="space-between">
            <Flex gap={1}>
                <Badge height={6} px={2} bgColor={"white"} color="blackAlpha.800" fontSize={"2xs"}>
                    Project
                </Badge>
                <Badge height={6} px={2} bgColor={"white"} color="blackAlpha.800" fontSize={"2xs"}>
                    UX
                </Badge>
            </Flex>
            <Status value={status} />
        </Flex>
        <Flex alignItems="center" gap={2} ml={1} grow={1}>
            <Heading size="md" fontWeight={450}>{title}</Heading>
        </Flex>
        <Flex gap={1}>
            <IconButton
                size={"2xs"}
                rounded="full"
                aria-label="Participate in discussion"
                variant="solid"
                bgColor="accent"
            >
                <LuHand />
            </IconButton>
            <IconButton
                size={"2xs"}
                rounded="full"
                aria-label="Open"
                variant="solid"
                bgColor="accent"
            >
                <LuMaximize2 />
            </IconButton>
        </Flex>
    </WidgetBox>
);
