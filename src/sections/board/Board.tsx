import React, { useMemo, useState } from "react";
import { useParams, navigate } from "@reach/router";
import { Button, Spinner, Text, Flex, IconButton } from "@chakra-ui/react";
import { useBoard } from "@/hooks/useBoard";
import { BoardContent } from "./BoardContent";
import { Layout } from "@/components/layout/Layout";
import { FaArrowLeft } from "react-icons/fa6";

export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, refetch } = useBoard(uuid || null);

    return (
        <Layout headerType="editor">
            <Layout.Header>
                <IconButton position={"absolute"}
                    aria-label="Back"
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    onClick={() => navigate("/app")}
                    top={3}
                    left={3}
                >
                    <FaArrowLeft />
                </IconButton>
            </Layout.Header>
            <Layout.Content>
                {initialLoading ? (<Flex minH="100%" align="center" justify="center">
                    <Spinner size="xl" />
                </Flex>) : ((error || !board) ? (<Flex minH="100vh" align="center" justify="center" direction="column">
                    <Text fontSize="xl" color="red.500">
                        Board not found
                    </Text>
                    <Button mt={4} onClick={() => navigate("/app")}>
                        Back to Home
                    </Button>
                </Flex>) : (<BoardContent board={board} refetch={refetch} />))}

            </Layout.Content>
        </Layout>
    );
};
