import React from "react";
import { useParams, navigate } from "@reach/router";
import { Button, Spinner, Text, Flex } from "@chakra-ui/react";
import { BoardContent } from "./BoardContent";
import { useBoard } from "@/hooks/useBoard";


export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, refetch } = useBoard(uuid || null);

    if (initialLoading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
    if (error || !board) return (
        <Flex minH="100vh" align="center" justify="center" direction="column">
            <Text fontSize="xl" color="red.500">Board not found</Text>
            <Button mt={4} onClick={() => navigate("/app")}>Back to Home</Button>
        </Flex>
    );

    return (
        <BoardContent
            board={board}
            refetch={refetch}
        />
    );
};