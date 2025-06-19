import React, { useState, useEffect } from "react";
import { Button, Heading, IconButton, Flex } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa6";
import { navigate } from "gatsby";


export interface HeaderProps {
    hasLogout?: boolean;
    headerType?: "default" | "editor";
}

export const Header: React.FC<HeaderProps> = ({ hasLogout = true, headerType = "default" }) => {

    if (headerType === "editor") {
        return (
            <Flex
                as="header"
                w="100%"
                bg="moka.800"
                px={4}
                py={2}
                align="center"
                justify="space-between"
                boxShadow="xs"
                minH={"30px"}
            >
                <IconButton
                    aria-label="Back"
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    onClick={() => navigate("/app")}
                >
                    <FaArrowLeft />
                </IconButton>
            </Flex>
        );
    }

    return (
        <Flex
            as="header"
            w="100%"
            bgColor="white"
            px={8}
            py={3}
            align="center"
            justify="space-between"
            boxShadow="sm"
            minH={"60px"}
        >
            <Heading size="md">Mokaboard</Heading>
            {hasLogout && (
                <Button
                    colorScheme="red"
                    size="sm"
                    onClick={async () => {
                        await import("@/lib/supabaseClient").then(({ supabase }) =>
                            supabase.auth.signOut()
                        );
                        window.location.href = "/app/login";
                    }}
                >
                    Logout
                </Button>
            )}
        </Flex>
    );
};
