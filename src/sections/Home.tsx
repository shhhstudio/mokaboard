import React from "react";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { navigate } from "gatsby";
import { useSession } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

interface RouteProps {
    path?: string;
    default?: boolean;
}

export const Home: React.FC<RouteProps> = () => {
    const session = useSession();

    return (
        <Center minH="100vh" bg="gray.50">
            <Box p={8} borderRadius="lg" boxShadow="md" bg="white" textAlign="center">
                Home
            </Box>
        </Center>
    );
};
