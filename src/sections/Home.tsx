import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Collapsible,
    Text,
    Flex,
    IconButton,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useSession } from "@/providers/AuthProvider";
import { useWorkspace } from "@/hooks/useWorkspace";
import { createBoard, deleteBoard, updateBoard } from "@/hooks/apiBoards";
import { createTrack, updateTrack } from "@/hooks/apiTracks";
import { Layout } from "@/components/layout/Layout";
import { Timeline } from "@chakra-ui/react";
import { BoardThumbnail } from "@/components/board/BoardThumbnail";
import {
    LuArrowRight,
    LuPlus,
    LuTrash2,
    LuAlignRight,
    LuX,
} from "react-icons/lu";
import { EditableText } from "@/components/EditableText";

interface RouteProps {
    path?: string;
    default?: boolean;
}

export default function BoardTimeline({
    selectedTrack,
    deleteBoard,
    refreshWorkspace,
    selectedTrackId,
    session,
}) {
    const [selectBoardToDeleteId, setSelectBoardToDeleteId] = useState<
        string | null
    >(null);
    const boards = selectedTrack.board || [];

    // Sort boards by date ascending
    const sorted = [...boards].sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (diff !== 0) {
            return diff;
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // Group boards by formatted date
    const grouped = sorted.reduce((acc, board) => {
        const key = board.date
            ? new Date(board.date).toISOString().split("T")[0]
            : "No date";
        acc[key] = acc[key] || [];
        acc[key].push(board);
        return acc;
    }, {});

    const today = new Date().toISOString().split("T")[0];
    if (!grouped[today]) {
        grouped[today] = [];
    }

    return (
        <Timeline.Root>
            {Object.entries(grouped)
                .sort((a, b) => {
                    return b[0].localeCompare(a[0]);
                })
                .map(([dateKey, items], idx) => {
                    const groupDate = new Date(dateKey);
                    return (
                        <Timeline.Item key={dateKey}>
                            <Timeline.Connector>
                                <Timeline.Separator />
                                <Timeline.Indicator>
                                    <Text fontSize="2xs">{items.length}</Text>
                                </Timeline.Indicator>
                            </Timeline.Connector>

                            <Timeline.Content>
                                <Timeline.Title>
                                    {groupDate.toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Timeline.Title>
                                <Flex mt={1} direction="row" gap={3} wrap={"wrap"}>
                                    {items.map((board) => (
                                        <BoardThumbnail key={board.id} cursor="pointer" onClick={() => {
                                            window.location.href = `/app/board/${board.id}`;
                                        }}>
                                            <Flex direction="column" justify="space-between" grow={1}>
                                                <Box>
                                                    <EditableText
                                                        value={board.title}
                                                        onChange={async (newTitle) => {
                                                            await updateBoard(board.id, { title: newTitle });
                                                            refreshWorkspace();
                                                        }}
                                                        fontWeight="medium"
                                                        fontSize="md"
                                                        stopOnClickPropagation
                                                    />
                                                    <EditableText
                                                        fontSize="sm"
                                                        color="gray.500"
                                                        value={board.description}
                                                        onChange={async (newDescription) => {
                                                            await updateBoard(board.id, {
                                                                description: newDescription,
                                                            });
                                                            refreshWorkspace();
                                                        }}
                                                        stopOnClickPropagation
                                                    />
                                                </Box>
                                                <Flex align="center" gap={2} justify="space-between">
                                                    <IconButton
                                                        aria-label="Add Board"
                                                        variant="ghost"
                                                        size="2xs"
                                                        borderRadius="full"
                                                        _focus={{ background: "red.200", color: "red.600" }}
                                                        color="gray.400"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (selectBoardToDeleteId !== board.id) {
                                                                setSelectBoardToDeleteId(board.id);
                                                            } else if (selectBoardToDeleteId === board.id) {
                                                                await deleteBoard(board.id);
                                                                setSelectBoardToDeleteId(null);
                                                                refreshWorkspace();
                                                            }
                                                            e.stopPropagation();
                                                        }}
                                                        onBlur={() => {
                                                            if (selectBoardToDeleteId === board.id) {
                                                                setSelectBoardToDeleteId(null);
                                                            }
                                                        }}
                                                    >
                                                        <LuTrash2 />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="Add Board"
                                                        variant="ghost"
                                                        size="2xs"
                                                        borderRadius="full"
                                                        onClick={() =>
                                                            (window.location.href = `/app/board/${board.id}`)
                                                        }
                                                    >
                                                        <LuArrowRight />
                                                    </IconButton>
                                                </Flex>
                                            </Flex>
                                        </BoardThumbnail>
                                    ))}
                                    <BoardThumbnail
                                        key="new-board"
                                        background="moka.subtleBackground"
                                        align="center"
                                        justify="center"
                                        cursor="pointer"
                                        onClick={async () => {
                                            if (!selectedTrackId) return;
                                            await createBoard({
                                                track_id: selectedTrackId,
                                                title: "New Board",
                                                description: "Description of the new board",
                                                date:
                                                    items.length > 0
                                                        ? items[items.length - 1].date
                                                        : new Date().toISOString(),
                                                date_from:
                                                    items.length > 0
                                                        ? items[items.length - 1].date_from
                                                        : new Date().toISOString(),
                                                status: "draft",
                                                created_by: session?.user?.id || "anonymous",
                                            });
                                            refreshWorkspace();
                                        }}
                                    >
                                        <IconButton
                                            aria-label="Add Board"
                                            variant="ghost"
                                            size="lg"
                                            borderRadius="full"
                                        >
                                            <LuPlus />
                                        </IconButton>
                                    </BoardThumbnail>
                                </Flex>
                            </Timeline.Content>
                        </Timeline.Item>
                    );
                })}
        </Timeline.Root>
    );
}

export const Home: React.FC<RouteProps> = () => {
    const session = useSession();
    const { workspace, loading, refreshWorkspace } = useWorkspace();
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
    const collapsForceOpen = useBreakpointValue({ base: undefined, md: true });
    const [menuOpened, setMenuOpened] = useState<boolean>(true);

    // Find selected track object
    const selectedTrack = React.useMemo(() => {
        for (const space of workspace.spaces || []) {
            const track = space.track?.find((t) => t.id === selectedTrackId);
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
        <Layout>
            <Layout.Sidebar>
                <Collapsible.Root
                    open={collapsForceOpen}
                    onOpenChange={(change) => {
                        setMenuOpened(change.open);
                    }}
                    defaultOpen={true}
                >
                    <Collapsible.Trigger
                        paddingLeft={3}
                        fontSize="md"
                        fontWeight="normal"
                        width="100%"
                    >
                        <Flex justify="space-between" align="center" width="100%">
                            <Text>
                                {collapsForceOpen === undefined && menuOpened === false
                                    ? selectedTrack?.name
                                    : "Spaces"}
                            </Text>
                            {collapsForceOpen === undefined &&
                                (menuOpened ? <LuX /> : <LuAlignRight />)}
                        </Flex>
                    </Collapsible.Trigger>
                    <Collapsible.Content paddingLeft={3} paddingTop={6}>
                        {workspace.spaces?.map((space) => (
                            <Box key={space.id} mb={2}>
                                <Text fontWeight="bold">{space.name || "Untitled Space"}</Text>
                                <Box pl={6} mt={1}>
                                    {space.track?.map((track) => (
                                        <Box
                                            key={track.id}
                                            mb={1}
                                            display="flex"
                                            alignItems="center"
                                        >
                                            <EditableText
                                                placeholder="New Project..."
                                                value={track.name || undefined}
                                                onChange={async (newName) => {
                                                    await updateTrack(track.id, { name: newName });
                                                    refreshWorkspace();
                                                }}
                                                onClick={(e) => {
                                                    setSelectedTrackId(track.id);
                                                }}
                                                fontWeight={
                                                    selectedTrackId === track.id ? "bold" : "normal"
                                                }
                                                fontSize="md"
                                            />
                                        </Box>
                                    ))}
                                    <IconButton
                                        marginTop={2}
                                        aria-label="Add Project"
                                        variant="subtle"
                                        bgColor="moka.200"
                                        size="2xs"
                                        borderRadius="full"
                                        onClick={async () => {
                                            try {
                                                const track = await createTrack({
                                                    name: "",
                                                    space_id: space.id,
                                                    description: "",
                                                });
                                                setSelectedTrackId(track.id);
                                                refreshWorkspace();
                                            } catch {
                                                alert("Failed to update track name");
                                            }
                                        }}
                                    >
                                        <LuPlus />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Collapsible.Content>
                </Collapsible.Root>
            </Layout.Sidebar>
            <Layout.Content>
                <Box flex={1} p={8}>
                    {!selectedTrackId && (
                        <Text color="gray.500">Select a track to view its boards.</Text>
                    )}
                    {selectedTrack && (
                        <Box mb={4}>
                            <BoardTimeline
                                selectedTrack={selectedTrack}
                                deleteBoard={deleteBoard}
                                refreshWorkspace={refreshWorkspace}
                                selectedTrackId={selectedTrackId}
                                session={session}
                            />
                        </Box>
                    )}
                    <Flex gap={2} mt={4}>
                        {selectedTrack &&
                            (!selectedTrack.board || selectedTrack.board.length === 0) && (
                                <Button
                                    colorPalette="red"
                                    variant="subtle"
                                    onClick={async () => {
                                        try {
                                            await import("@/hooks/apiTracks").then(
                                                ({ deleteTrack }) => deleteTrack(selectedTrack.id)
                                            );
                                            setSelectedTrackId(null);
                                            refreshWorkspace();
                                        } catch {
                                            alert("Failed to delete track");
                                        }
                                    }}
                                >
                                    Delete Project
                                </Button>
                            )}
                    </Flex>
                </Box>
            </Layout.Content>
        </Layout>
    );
};
