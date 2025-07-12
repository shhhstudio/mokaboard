import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Collapsible,
    Text,
    Flex,
    Avatar,
    IconButton,
    useBreakpointValue,
} from "@chakra-ui/react";
import { useSession } from "@/providers/AuthProvider";
import { useWorkspace } from "@/hooks/useWorkspace";
import { createBoard, deleteBoard, updateBoard } from "@/api/boards";
import { createTrack, updateTrack } from "@/api/tracks";
import { createSpace, updateSpace, deleteSpace } from "@/api/spaces";
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
import { Icon, Select, Portal, createListCollection } from "@chakra-ui/react";
import { set } from "lodash";

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

    useEffect(() => {
        if (selectBoardToDeleteId === null) {
            return;
        }
        const handleClickOutside = (e) => {
            setSelectBoardToDeleteId(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [selectBoardToDeleteId !== null]);

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
                                        <BoardThumbnail
                                            key={board.id}
                                            cursor="pointer"
                                            onClick={() => {
                                                window.location.href = `/app/board/${board.id}`;
                                            }}
                                        >
                                            <Flex direction="column" justify="space-between" grow={1}>
                                                <Box marginBottom={3}>
                                                    <Text
                                                        children={board.title}
                                                        fontWeight="medium"
                                                        fontSize="md"
                                                    />
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                        children={board.description}
                                                    />
                                                </Box>
                                                <Flex align="center" gap={2} justify="space-between">
                                                    <IconButton
                                                        aria-label="Delete Board"
                                                        variant="ghost"
                                                        size="2xs"
                                                        borderRadius="full"
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            if (selectBoardToDeleteId !== board.id) {
                                                                setSelectBoardToDeleteId(board.id);
                                                            } else if (selectBoardToDeleteId === board.id) {
                                                                await deleteBoard(board.id);
                                                                setSelectBoardToDeleteId(null);
                                                                refreshWorkspace();
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (selectBoardToDeleteId === board.id) {
                                                                setSelectBoardToDeleteId(null);
                                                            }
                                                        }}
                                                        {...(selectBoardToDeleteId === board.id
                                                            ? { background: "red.200", color: "red.600" }
                                                            : {})}
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
                                        background="moka.background.subtle"
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
                                                updated_at: new Date().toISOString(),
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
    const [selected, setSelected] = useState<{
        space: string;
        track: string | null;
    } | null>(null);
    const collapsForceOpen = useBreakpointValue({ base: undefined, md: true });
    const [menuOpened, setMenuOpened] = useState<boolean>(false);

    // Find selected track object
    const spaceAndTrack = React.useMemo(() => {
        const space = workspace.spaces.find(
            (space) => space.id === selected?.space
        );
        const track = space?.track?.find((t) => t.id === selected?.track);
        return { space, track };
    }, [workspace.spaces, selected]);

    // Select first track of first space by default
    useEffect(() => {
        if (!selected?.space && workspace.spaces && workspace.spaces.length > 0) {
            const firstTrack = workspace.spaces[0].track?.[0];
            if (firstTrack)
                setSelected({
                    space: workspace.spaces[0].id,
                    track: firstTrack.id,
                });
        }
    }, [workspace.spaces, selected]);

    const spacesList = createListCollection({
        items: workspace.spaces.map((space) => ({
            label: space.name,
            value: space.id,
        })),
    });

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
                        hidden={collapsForceOpen ? true : false}
                    >
                        <Flex justify="space-between" align="center" width="100%">
                            <Text>
                                {collapsForceOpen === undefined && menuOpened === false
                                    ? `${spaceAndTrack?.space?.name} > ${spaceAndTrack?.track?.name}`
                                    : "Menu"}
                            </Text>
                            {collapsForceOpen === undefined &&
                                (menuOpened ? <LuX /> : <LuAlignRight />)}
                        </Flex>
                    </Collapsible.Trigger>
                    <Collapsible.Content paddingLeft={3} paddingTop={6}>
                        {workspace.spaces?.map((space) => (
                            <Box key={space.id} mb={6}>
                                <Flex
                                    width="100%"
                                    alignItems="center"
                                    justify={"space-between"}
                                >
                                    <EditableText
                                        placeholder="New Workspace..."
                                        value={space.name || undefined}
                                        onChange={async (newName) => {
                                            if (newName.trim().length > 0) {
                                                await updateSpace(space.id, { name: newName });
                                                refreshWorkspace();
                                            } else if (space?.track?.length === 0) {
                                                await deleteSpace(space.id);
                                                setSelected(null);
                                                refreshWorkspace();
                                            }
                                        }}
                                        disabled={space.type === "private"}
                                        _disabled={{ opacity: 1 }}
                                        fontSize="md"
                                    />
                                </Flex>
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
                                                    console.log("Track clicked:", track.id);
                                                    setSelected({ space: space.id, track: track.id });
                                                }}
                                                fontWeight={
                                                    selected?.track === track.id ? "bold" : "normal"
                                                }
                                                fontSize="md"
                                            />
                                        </Box>
                                    ))}

                                    <Box
                                        key={"new-track"}
                                        mt={3}
                                        display="flex"
                                        alignItems="center"
                                        aria-label="Add Project"
                                        fontSize="sm"
                                        opacity={0.5}
                                        cursor="pointer"
                                        onClick={async () => {
                                            try {
                                                const track = await createTrack({
                                                    name: "",
                                                    space_id: space.id,
                                                    description: "",
                                                });
                                                setSelected({ space: space.id, track: track.id });
                                                refreshWorkspace();
                                            } catch (e) {
                                                alert("Failed to create track");
                                                console.log(e);
                                            }
                                        }}
                                    >
                                        <Icon size="xs" marginRight={1}>
                                            <LuPlus />
                                        </Icon>
                                        New Project
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        <Box
                            key={"new-workspace"}
                            mt={3}
                            display="flex"
                            alignItems="center"
                            aria-label="Add Workspace"
                            fontSize="sm"
                            opacity={0.5}
                            cursor="pointer"
                            onClick={async () => {
                                try {
                                    const newWorkspace = await createSpace({
                                        name: "",
                                        type: "personal",
                                        created_by: session?.user?.id || "anonymous",
                                    });
                                    setSelected({ space: newWorkspace.id, track: "" });
                                    refreshWorkspace();
                                } catch (e) {
                                    alert("Failed to create track");
                                    console.log(e);
                                }
                            }}
                        >
                            <Icon size="xs" marginRight={1}>
                                <LuPlus />
                            </Icon>
                            New Workspace
                        </Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Layout.Sidebar>
            <Layout.Content>
                <Box flex={1} p={8}>
                    {!selected && (
                        <Text color="gray.500">Select a track to view its boards.</Text>
                    )}
                    {spaceAndTrack?.track && (
                        <Box mb={4}>
                            <Flex marginBottom={12} gap={1}>
                                {spaceAndTrack?.track?.members?.map((member, index) => {
                                    return (
                                        <Box key={index}>
                                            <Avatar.Root size="xs">
                                                <Avatar.Fallback
                                                    name={member.user.firstname || undefined}
                                                />
                                                <Avatar.Image
                                                    src={member.user.avatar_url || undefined}
                                                />
                                            </Avatar.Root>
                                        </Box>
                                    );
                                })}
                                <Box>
                                    <IconButton
                                        aria-label="Add Member"
                                        variant="subtle"
                                        size="xs"
                                        borderRadius="full"
                                    >
                                        <LuPlus size={28} />
                                    </IconButton>
                                </Box>
                            </Flex>
                            <BoardTimeline
                                selectedTrack={spaceAndTrack?.track}
                                deleteBoard={deleteBoard}
                                refreshWorkspace={refreshWorkspace}
                                selectedTrackId={selected?.track}
                                session={session}
                            />
                        </Box>
                    )}
                    <Flex gap={2} mt={4}>
                        {spaceAndTrack?.track &&
                            (!spaceAndTrack?.track?.board ||
                                spaceAndTrack?.track?.board.length === 0) && (
                                <Button
                                    colorPalette="red"
                                    variant="subtle"
                                    onClick={async () => {
                                        try {
                                            await import("@/api/tracks").then(
                                                ({ deleteTrack }) =>
                                                    deleteTrack(spaceAndTrack?.track?.id || "")
                                            );
                                            setSelected(null);
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
