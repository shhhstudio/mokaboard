import React from "react";
import { Button, Heading, Flex } from "@chakra-ui/react";

export interface HeaderAppPros {
    hasLogout?: boolean;
}

export const App: React.FC<HeaderAppPros> = ({ hasLogout = true }) => {
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
