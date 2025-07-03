import React, { useCallback } from "react";
import { useParams, navigate } from "@reach/router";
import { Button, Spinner, Text, Flex, IconButton, Box } from "@chakra-ui/react";
import { useBoard } from "@/hooks/useBoard";
import { BoardContent } from "./BoardContent";
import { Layout } from "@/components/layout/Layout";
import { FaArrowLeft } from "react-icons/fa6";
import { EditableLine } from "@/components/EditableLine";
import { updateBoard } from "@/hooks/apiBoards";

export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, refetch } = useBoard(uuid || null);

    const updateBoardField = useCallback(
        (field: string) => async (value: string) => {
            if (board?.id) {
                await updateBoard(board?.id, { [field]: value });
                await refetch();
            }
        },
        [board?.id, refetch]
    );

    return (
        <Layout type="editor">
            <Layout.Header>
                <Flex
                    gap={2}
                    top={3}
                    paddingX={3}
                    position={{ base: "relative", md: "absolute" }}
                    align={"center"}
                    maxWidth="100%"
                >
                    <IconButton
                        aria-label="Back"
                        variant="subtle"
                        size="sm"
                        borderRadius="full"
                        onClick={() => navigate("/app")}
                        width="min-content"
                    >
                        <FaArrowLeft />
                    </IconButton>

                    <Flex fontSize="sm">
                        <EditableLine
                            defaultValue={board?.title ?? undefined}
                            fontWeight={600}
                            onChange={updateBoardField("title")}
                            placeholder="Board Name"
                        />
                        ,
                        <EditableLine
                            marginLeft={1}
                            defaultValue={board?.description ?? undefined}
                            onChange={updateBoardField("description")}
                            placeholder="Description"
                        />
                    </Flex>
                </Flex>
            </Layout.Header>
            <Layout.Content>
                {initialLoading ? (
                    <Flex minH="100%" align="center" justify="center">
                        <Spinner size="xl" />
                    </Flex>
                ) : error || !board ? (
                    <Flex minH="100vh" align="center" justify="center" direction="column">
                        <Text fontSize="xl" color="red.500">
                            Board not found
                        </Text>
                        <Button mt={4} onClick={() => navigate("/app")}>
                            Back to Home
                        </Button>
                    </Flex>
                ) : (
                    <BoardContent board={board} refetch={refetch} />
                )}
            </Layout.Content>
        </Layout>
    );
};
