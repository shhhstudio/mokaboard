import React, { useEffect, useMemo } from "react";
import { useParams, navigate } from "@reach/router";
import { Box, Button, Heading, Spinner, Text, Flex, SimpleGrid, IconButton, Dialog, Portal, CloseButton, Textarea } from "@chakra-ui/react";
import { useBoard } from "@/hooks/useBoard";
import { updateWidget } from "@/hooks/apiWidgets";
import { StatusWidget, BlankWidget } from "@/components/widgets";
import { LuTrash2 } from "react-icons/lu";
import { Widget } from "@/types";


export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, loading, refetch } = useBoard(uuid || null);
    const [selectedWidget, setSelectedWidget] = React.useState<any | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [jsonValue, setJsonValue] = React.useState<string>("");
    const [jsonError, setJsonError] = React.useState<string | null>(null);

    // Extract widgetId from URL if present
    const params = useParams<{ uuid: string; widgetId?: string }>();
    const widgetId = params.widgetId || null;

    // Build grid slots from widgets[].boardWidget.order (max 8 slots for 4x2 grid)
    const GRID_SIZE = 8;
    const slots = useMemo(() => {
        const arr = Array(GRID_SIZE).fill(null);
        const widgets = board?.widgets || [];
        widgets.forEach((widget: any) => {
            const order = widget.boardWidget.order;
            if (order < GRID_SIZE) arr[order] = widget;
        });
        return arr;
    }, [board]);

    // Memoize the onChange handler for each widget
    const widgetOnChangeMap = useMemo(() => {
        const map = new Map<string, (changes: Partial<Widget>) => Promise<void>>();
        (board?.widgets || []).forEach((widget: Widget) => {
            map.set(
                widget.id,
                async (changes: Partial<Widget>) => {
                    await updateWidget(widget.id, changes);
                    await refetch();
                }
            );
        });
        return map;
    }, [board, refetch]);

    // Memoize handleWidgetClick to avoid unnecessary rerenders
    const handleWidgetClick = React.useCallback((widget: any) => {
        // Optionally implement modal open logic
    }, []);

    // Open modal if widgetId in URL
    useEffect(() => {
        if (widgetId && board?.widgets) {
            const found = board.widgets.find((w: any) => w.id === widgetId);
            if (found) {
                setSelectedWidget(found);
                setDialogOpen(true);
            }
        } else {
            setSelectedWidget(null);
            setDialogOpen(false);
        }
    }, [widgetId, board]);

    // Sync JSON editor with only editable widget properties when modal opens or widget changes
    useEffect(() => {
        if (selectedWidget && dialogOpen) {
            const editable = {
                type: selectedWidget.type,
                title: selectedWidget.title,
                value: selectedWidget.value,
                status: selectedWidget.status,
            };
            setJsonValue(JSON.stringify(editable, null, 2));
            setJsonError(null);
        }
    }, [selectedWidget, dialogOpen]);

    // Add widget handler
    const handleAddWidget = async (order?: number) => {
        try {
            const title = window.prompt("Widget title?");
            if (!title) return;
            const { createWidget, addWidgetToBoard } = await import("@/hooks/apiWidgets");
            const widget = await createWidget({
                title,
                created_by: board!.created_by,
                type: "kpi",
                status: null,
                value: {},
                scopes: [],
            });
            await addWidgetToBoard({
                board_id: board!.id,
                widget_id: widget.id,
                order: typeof order === 'number' ? order : board!.widgets.length,
            });
            await refetch();
        } catch {
            alert("Failed to add widget");
        }
    };

    // Delete widget handler
    const handleDeleteWidget = async (widget: any) => {
        if (!window.confirm("Delete this widget? This cannot be undone.")) return;
        try {
            const { deleteBoardWidget, deleteWidget } = await import("@/hooks/apiWidgets");
            await deleteBoardWidget(widget.boardWidget.id);
            await deleteWidget(widget.id);
            await refetch();
        } catch {
            alert("Failed to delete widget");
        }
    };

    // Modal open/close handlers
    const handleModalClose = () => {
        window.history.pushState({}, '', `/app/board/${uuid}`);
        setDialogOpen(false);
        setSelectedWidget(null);
    };

    // Save handler for JSON editor (update only editable widget fields)
    const handleSaveJson = async () => {
        try {
            const parsed = JSON.parse(jsonValue);
            setJsonError(null);
            const { updateWidget } = await import("@/hooks/apiWidgets");
            await updateWidget(selectedWidget.id, {
                type: parsed.type,
                title: parsed.title,
                value: parsed.value,
                status: parsed.status,
            });
            await refetch();
        } catch (e: any) {
            setJsonError("Invalid JSON: " + (e?.message || ""));
        }
    };

    if (initialLoading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
    if (error || !board) return (
        <Flex minH="100vh" align="center" justify="center" direction="column">
            <Text fontSize="xl" color="red.500">Board not found</Text>
            <Button mt={4} onClick={() => navigate("/app")}>Back to Home</Button>
        </Flex>
    );

    return (
        <Flex minH="100vh" bg="gray.50" direction="column">
            <Flex as="header" w="100%" bg="white" px={8} py={4} align="center" justify="space-between" boxShadow="sm">
                <Heading size="md">{board?.title || "Untitled Board"}</Heading>
                <Flex gap={2} align="center">
                    {loading && <Spinner size="sm" color="blue.500" mr={2} />}
                    <Button colorScheme="gray" size="sm" onClick={() => navigate("/app")}>Back</Button>
                </Flex>
            </Flex>
            <Flex flex={1} align="center" justify="center" p={8} bgColor="white">
                <Box position="relative" width="100%">
                    <SimpleGrid
                        columns={[2, 2, 4, 4]}
                        gap={[2, 6, 6, 8]}
                        width="max-content"
                        marginX="auto"
                        pointerEvents={loading ? "none" : undefined}
                    >
                        {slots.map((widget, idx) => (
                            widget ? (
                                <Box
                                    key={widget.id}
                                    minH="120px"
                                    bg="white"
                                    borderRadius="md"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    position="relative"
                                    onClick={() => handleWidgetClick(widget)}
                                    cursor="pointer"
                                >
                                    <Box position="relative" w="100%" h="100%">
                                        <StatusWidget
                                            widget={widget}
                                            onChange={widgetOnChangeMap.get(widget.id)}
                                        />
                                        <Flex position="absolute" bottom={2} right={2} gap={1} zIndex={3} pointerEvents="auto">
                                            <IconButton
                                                aria-label="Delete"
                                                size="2xs"
                                                rounded="full"
                                                variant="solid"
                                                onClick={e => { e.stopPropagation(); handleDeleteWidget(widget); }}
                                            >
                                                <LuTrash2 size={8} />
                                            </IconButton>
                                        </Flex>
                                    </Box>
                                </Box>
                            ) : (
                                <BlankWidget key={`empty-${idx}`} idx={idx} onAdd={() => handleAddWidget(idx)} />
                            )
                        ))}
                    </SimpleGrid>
                </Box>
            </Flex>

            <Dialog.Root open={dialogOpen} size="full" onOpenChange={details => { if (!details.open) handleModalClose(); setDialogOpen(details.open); }} placement="center" motionPreset="none">
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header height={12}>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton rounded="full" />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body alignContent="center">
                                <Flex maxWidth="800px" mx="auto" w="100%" gap={6}>
                                    <StatusWidget
                                        widget={selectedWidget}
                                    />
                                    <Box flexGrow={1} alignContent="center">
                                        <Box>
                                            <Textarea
                                                variant="outline"
                                                minH="200px"
                                                value={jsonValue}
                                                onChange={e => setJsonValue(e.target.value)}
                                                fontFamily="mono"
                                                placeholder="Edit widget JSON data"
                                            />
                                            {jsonError && <Text color="red.500" fontSize="sm" mt={2}>{jsonError}</Text>}
                                            <Button mt={2} colorScheme="blue" size="sm" onClick={handleSaveJson}>Save JSON</Button>
                                        </Box>
                                    </Box>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer height={12}>

                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </Flex >
    );
};