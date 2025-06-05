import React from "react";
import { WidgetBox } from "@/components/ui/WidgetBox";
import { Heading, Text, Flex, Badge, Status as ChakraStatus } from "@chakra-ui/react";
import type { ColorPalette } from "@chakra-ui/react"

type StatusValue = "success" | "error" | "warning" | "info"

interface StatusWidgetProps {
    title?: string;
    status?: StatusValue;
    hashtags?: string[];
}

export interface StatusProps extends ChakraStatus.RootProps {
    value?: StatusValue
}

const statusMap: Record<StatusValue, ColorPalette> = {
    success: "green",
    error: "red",
    warning: "orange",
    info: "blue",
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
    function Status(props, ref) {
        const { children, value = "info", ...rest } = props
        const colorPalette = rest.colorPalette ?? statusMap[value]
        return (
            <ChakraStatus.Root ref={ref} {...rest} colorPalette={colorPalette}>
                <ChakraStatus.Indicator />
                {children}
            </ChakraStatus.Root>
        )
    },
)

export const StatusWidget: React.FC<StatusWidgetProps> = ({ title, status }) => (
    <WidgetBox>
        <Flex gap={1} alignItems="center" justifyContent="space-between">
            <Flex gap={1}><Badge height={6} px={3}>Project</Badge><Badge height={6} px={3}>UX</Badge></Flex>
            <Status value={status} />
        </Flex>
        <Heading size="md" mb={2}>{title}</Heading>
        <Text mb={4}>Status: {status}</Text>

    </WidgetBox>
);
