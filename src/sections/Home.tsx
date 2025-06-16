import React, { useState, useEffect } from "react";
import { Box, Button, Heading, Spinner, Text, Flex } from "@chakra-ui/react";
import { useSession } from "@/providers/AuthProvider";
import { useWorkspace } from "@/hooks/useWorkspace";
import { createBoard, deleteBoard } from "@/hooks/apiBoards";

interface RouteProps {
    path?: string;
    default?: boolean;
}

export const Home: React.FC<RouteProps> = () => {
    const session = useSession();
    const { workspace, loading, refreshWorkspace } = useWorkspace();
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    // Find selected track object
    const selectedTrack = React.useMemo(() => {
        for (const space of workspace.spaces || []) {
            const track = space.track?.find(t => t.id === selectedTrackId);
            if (track) return track;
        }
        return null;
    }, [workspace.spaces, selectedTrackId]);

    // Select first track of first space by default
    useEffect(() => {
        if (!selectedTrackId && workspace.spaces && workspace.spaces.length > 0) {
            const firstTrack = workspace.spaces[0].track?.[0];
            if (firstTrack) setSelectedTrackId(firstTrack.id);
        }
    }, [workspace.spaces, selectedTrackId]);

    return (
        <Flex minH="100vh" bg="gray.50" direction="column">
            {/* Header */}
            <Flex as="header" w="100%" bg="white" px={8} py={4} align="center" justify="space-between" boxShadow="sm">
                <Heading size="md">Mokaboard</Heading>
                <Button colorScheme="red" size="sm" onClick={async () => {
                    await import("@/lib/supabaseClient").then(({ supabase }) => supabase.auth.signOut());
                    window.location.href = "/app/login";
                }}>
                    Logout
                </Button>
            </Flex>
            <Flex flex={1}>
                {/* Sidebar */}
                <Box w="300px" bg="gray.100" p={4} borderRight="1px solid #e2e8f0">
                    <Heading size="md" mb={4}>Spaces</Heading>
                    <Box>
                        {workspace.spaces?.map(space => (
                            <Box key={space.id} mb={2}>
                                <Text fontWeight="bold">{space.name || "Untitled Space"}</Text>
                                <Box pl={6} mt={1}>
                                    {space.track?.map(track => (
                                        <Box key={track.id} mb={1} display="flex" alignItems="center">
                                            <Text
                                                fontWeight={selectedTrackId === track.id ? "bold" : "normal"}
                                                cursor="pointer"
                                                onClick={() => setSelectedTrackId(track.id)}
                                            >
                                                {track.name || "Untitled Track"}
                                            </Text>
                                        </Box>
                                    ))}
                                    <Button
                                        colorScheme="green"
                                        size="xs"
                                        mt={2}
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            const name = window.prompt("Track name?");
                                            if (!name) return;
                                            try {
                                                await import("@/hooks/apiTracks").then(({ createTrack }) =>
                                                    createTrack({
                                                        name,
                                                        space_id: space.id,
                                                        description: ""
                                                    })
                                                );
                                                refreshWorkspace();
                                            } catch {
                                                alert("Failed to create track");
                                            }
                                        }}
                                    >
                                        + Add Track
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
                {/* Main Content - only show boards from selected track */}
                <Box flex={1} p={8}>
                    {loading && <Spinner size="sm" color="blue.400" mb={2} />}
                    {!selectedTrackId && <Text color="gray.500">Select a track to view its boards.</Text>}
                    {selectedTrack && (
                        <Box mb={4}>
                            <Text fontWeight="semibold" mb={2}>{selectedTrack.name || "Untitled Track"}</Text>
                            {selectedTrack.board && selectedTrack.board.length > 0 ? (
                                [...selectedTrack.board]
                                    .sort((a, b) => {
                                        // Sort by date ascending (oldest first)
                                        if (!a.date && !b.date) return 0;
                                        if (!a.date) return 1;
                                        if (!b.date) return -1;
                                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                                    })
                                    .map(board => (
                                        <Flex key={board.id} align="center" mb={1} pl={4} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/app/board/${board.id}`}>
                                            <Box mr={2}>
                                                <Text fontWeight="medium" fontSize="md">
                                                    {board.title || "Untitled Board"}
                                                </Text>
                                                {board.description && (
                                                    <Text fontSize="sm" color="gray.500">{board.description}</Text>
                                                )}
                                            </Box>
                                            <Text fontSize="sm" color="gray.400" mr={2}>
                                                {board.date ? new Date(board.date).toLocaleDateString() : "No date"}
                                            </Text>
                                            <Button colorScheme="red" size="xs" onClick={async (e) => {
                                                e.stopPropagation();
                                                try {
                                                    await deleteBoard(board.id);
                                                    refreshWorkspace();
                                                } catch { }
                                            }}>Delete</Button>
                                        </Flex>
                                    ))
                            ) : (
                                <Text color="gray.400">No boards in this track.</Text>
                            )}
                        </Box>
                    )}
                    <Flex gap={2} mt={4}>
                        <Button
                            colorScheme="blue"
                            disabled={!selectedTrackId}
                            onClick={async () => {
                                if (!selectedTrackId) return;
                                await createBoard({
                                    track_id: selectedTrackId,
                                    title: "New Board",
                                    description: "Description of the new board",
                                    date: new Date().toISOString(),
                                    date_from: new Date().toISOString(),
                                    status: "draft",
                                    created_by: session?.user?.id || "anonymous"
                                });
                                refreshWorkspace();
                            }}
                        >
                            Create New Board
                        </Button>
                        {/* Delete Track button, only if track is empty */}
                        {selectedTrack && (!selectedTrack.board || selectedTrack.board.length === 0) && (
                            <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={async () => {
                                    try {
                                        await import("@/hooks/apiTracks").then(({ deleteTrack }) =>
                                            deleteTrack(selectedTrack.id)
                                        );
                                        setSelectedTrackId(null);
                                        refreshWorkspace();
                                    } catch {
                                        alert("Failed to delete track");
                                    }
                                }}
                            >
                                Delete Track
                            </Button>
                        )}
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
};
