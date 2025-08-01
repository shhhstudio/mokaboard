import React, { ReactNode, Children, isValidElement } from "react";
import { Flex, Box, Container, Stack } from "@chakra-ui/react";
import { Header, HeaderProps } from "./Header";

interface LayoutProps {
    children: ReactNode;
    sidebarWidth?: string | number;
    sidebarPosition?: "left" | "right";
    type?: HeaderProps["type"];
    loading?: boolean;
}

function getChild(type: any, children: ReactNode) {
    return Children.toArray(children).find(
        (child: any) => isValidElement(child) && child.type === type
    );
}

function getChildOrDefault(
    type: any,
    children: ReactNode,
    defaultValue?: ReactNode
) {
    const child = getChild(type, children);
    return child || defaultValue;
}

export const Layout: React.FC<LayoutProps> & {
    Header: React.FC<{ children: ReactNode }>;
    Sidebar: React.FC<{ children: ReactNode }>;
    Content: React.FC<{ children: ReactNode }>;
} = ({ loading, children, sidebarWidth = 300, type = "default", sidebarPosition = "left" }) => {
    const header = getChildOrDefault(Layout.Header, children, <Header type={type} />);
    const sidebar = getChildOrDefault(Layout.Sidebar, children);
    const content = getChildOrDefault(Layout.Content, children);

    return (
        <Flex direction="column" flex="1" minHeight={"100vh"}>
            {header}
            <Flex flex={1} align={"stretch"} direction={{ base: "column", md: "row" }} /*"cols", md: (sidebarPosition === "left" ? "row" : "row-reverse") }}*/>
                {sidebar && (
                    <Flex flexDirection="column"
                        w={{ base: "full", md: sidebarWidth }}
                        bg="moka.background.subtle"
                        p={4}
                        borderRight="1px solid #e2e8f0"
                        alignSelf="stretch"
                    >
                        {sidebar}
                    </Flex>
                )}
                <Box flex={1} p={0}>
                    {content}
                </Box>
            </Flex>
        </Flex>
    );
};

Layout.Header = ({ children }) => <>{children}</>;
Layout.Sidebar = ({ children }) => <>{children}</>;
Layout.Content = ({ children }) => <>{children}</>;
