import React, { useEffect } from "react";
import { useParams, navigate } from "@reach/router";
import { Box, Button, Heading, Spinner, Text, Flex, SimpleGrid, IconButton, Dialog, Portal, CloseButton, Textarea } from "@chakra-ui/react";
import { useBoard } from "@/hooks/useBoard";
import { StatusWidget, BlankWidget } from "@/components/widgets";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LuPen, LuTrash2 } from "react-icons/lu";
import { LuGripVertical } from "react-icons/lu";

const SegmentedControl = ({ value, onChange, options, size }: { value: string, onChange: (val: string) => void, options: { label: string, value: string }[], size?: string }) => (
    <Flex borderRadius="md" bg="gray.100" p={1} gap={1}>
        {options.map(opt => (
            <Button
                key={opt.value}
                size={size as any}
                variant={value === opt.value ? "solid" : "ghost"}
                colorScheme={value === opt.value ? "blue" : undefined}
                onClick={() => onChange(opt.value)}
                fontWeight={value === opt.value ? 700 : 400}
                borderRadius="md"
            >
                {opt.label}
            </Button>
        ))}
    </Flex>
);

export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, loading, refetch } = useBoard(uuid || null);
    const [selectedWidget, setSelectedWidget] = React.useState<any | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [mode, setMode] = React.useState<'view' | 'edit'>('view');
    const [jsonValue, setJsonValue] = React.useState<string>("");
    const [jsonError, setJsonError] = React.useState<string | null>(null);

    console.log("Board component rendered with board:", board);

    // Extract widgetId from URL if present
    const params = useParams<{ uuid: string; widgetId?: string }>();
    const widgetId = params.widgetId || null;

    // Build grid slots from widgets[].boardWidget.order (max 8 slots for 4x2 grid)
    const GRID_SIZE = 8;
    const slots = React.useMemo(() => {
        const arr = Array(GRID_SIZE).fill(null);
        const widgets = board?.widgets || [];
        widgets.forEach((widget: any) => {
            const order = widget.boardWidget.order;
            if (order < GRID_SIZE) arr[order] = widget;
        });
        return arr;
    }, [board]); // Only depend on board, not JSON.stringify

    // DnD-kit setup
    const sensors = useSensors(useSensor(PointerSensor));
    const [localSlots, setLocalSlots] = React.useState<(any | null)[]>(slots);
    React.useEffect(() => {
        setLocalSlots(slots);
    }, [slots]);

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
    React.useEffect(() => {
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

    // Handle drag end (only in reorder mode)
    const handleDragEnd = async (event: any) => {
        if (mode !== 'edit') return;
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const getIndex = (id: string) => {
            let idx = localSlots.findIndex(w => w && w.id === id);
            if (idx === -1 && id.startsWith('empty-')) {
                idx = parseInt(id.replace('empty-', ''), 10);
            }
            return idx;
        };
        const oldIndex = getIndex(active.id);
        const newIndex = getIndex(over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const newSlots = arrayMove(localSlots, oldIndex, newIndex);
        setLocalSlots(newSlots);
        try {
            const { updateBoardWidget } = await import("@/hooks/apiWidgets");
            const updates = newSlots.map((widget, idx) => {
                if (widget && widget.boardWidget && widget.boardWidget.order !== idx) {
                    return updateBoardWidget(widget.boardWidget.id, { order: idx });
                }
                return null;
            }).filter(Boolean);
            await Promise.all(updates);
            await refetch();
        } catch (e) {
            alert("Failed to persist widget order");
        }
    };

    // Sortable widget wrapper
    function DraggableSlot({ widget, idx, children }: { widget: any, idx: number, children: (args: { listeners: any }) => React.ReactNode }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: widget?.id ?? `empty-${idx}`,
            disabled: !widget || mode !== 'edit',
        });
        return (
            <div
                ref={setNodeRef}
                {...attributes}
                style={{
                    position: 'relative',
                    transform: CSS.Transform.toString(transform),
                    transition,
                    zIndex: isDragging ? 2 : 1,
                    opacity: isDragging ? 0.7 : 1,
                    cursor: mode === 'edit' && widget ? 'grab' : undefined,
                } as React.CSSProperties}
            >
                {children({ listeners })}
            </div>
        );
    }

    // Show spinner for initial board load only
    if (initialLoading) return <Flex minH="100vh" align="center" justify="center"><Spinner size="xl" /></Flex>;
    if (error || !board) return (
        <Flex minH="100vh" align="center" justify="center" direction="column">
            <Text fontSize="xl" color="red.500">Board not found</Text>
            <Button mt={4} onClick={() => navigate("/app")}>Back to Home</Button>
        </Flex>
    );

    // Helper to map widget.status to StatusValue
    const mapStatus = (status: string | null | undefined): "success" | "warning" | "error" | "info" | "none" => {
        if (!status) return "none";
        if (["success", "on_track"].includes(status)) return "success";
        if (["warning", "at_risk"].includes(status)) return "warning";
        if (["error", "fail"].includes(status)) return "error";
        return "none";
    };

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

    // Edit widget handler
    const handleEditWidget = async (widget: any) => {
        try {
            const newTitle = window.prompt("Edit widget title", widget.title ?? undefined);
            if (typeof newTitle !== "string" || !newTitle || newTitle === widget.title) return;
            const { updateWidget } = await import("@/hooks/apiWidgets");
            await updateWidget(widget.id, { title: newTitle });
            await refetch();
        } catch {
            alert("Failed to update widget");
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

    // Replace navigate with window.history.pushState for modal open/close
    const handleWidgetClick = (widget: any) => {
        window.history.pushState({}, '', `/app/board/${uuid}/${widget.id}`);
        setSelectedWidget(widget);
        setDialogOpen(true);
    };

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

    return (
        <Flex minH="100vh" bg="gray.50" direction="column">
            <Flex as="header" w="100%" bg="white" px={8} py={4} align="center" justify="space-between" boxShadow="sm">
                <Heading size="md">{board.title || "Untitled Board"}</Heading>
                <Flex gap={2} align="center">
                    {loading && <Spinner size="sm" color="blue.500" mr={2} />}
                    <SegmentedControl
                        value={mode}
                        onChange={(val: string) => setMode(val as 'view' | 'edit')}
                        options={[
                            { label: 'View', value: 'view' },
                            { label: 'Edit', value: 'edit' },
                        ]}
                        size="sm"
                    />
                    <Button colorScheme="gray" size="sm" onClick={() => navigate("/app")}>Back</Button>
                </Flex>
            </Flex>
            <Flex flex={1} align="center" justify="center" p={8} bgColor="white">
                <Box position="relative" width="100%">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localSlots.map((w, idx) => w?.id ?? `empty-${idx}`)}
                            strategy={rectSortingStrategy}
                        >
                            <SimpleGrid
                                columns={[2, 2, 4, 4]}
                                gap={[2, 6, 6, 8]}
                                width="max-content"
                                marginX="auto"
                                pointerEvents={loading ? "none" : undefined}
                            >
                                {localSlots.map((widget, idx) => (
                                    <DraggableSlot key={widget?.id ?? `empty-${idx}`} widget={widget} idx={idx}>
                                        {({ listeners }) => widget ? (
                                            <Box
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
                                                        title={widget.title || "Untitled Widget"}
                                                        status={mapStatus(widget.status)}
                                                        scopes={widget.widget_tag.map((tag: any) => tag.tag.name)}
                                                    />
                                                    {mode === 'edit' && (
                                                        <Flex position="absolute" bottom={2} right={2} gap={1} zIndex={3} pointerEvents="auto">
                                                            <IconButton
                                                                aria-label="Reorder"
                                                                size="2xs"
                                                                variant="solid"
                                                                rounded="full"
                                                                {...listeners}
                                                            >
                                                                <LuGripVertical size={12} />
                                                            </IconButton>
                                                            <IconButton
                                                                aria-label="Edit"
                                                                size="2xs"
                                                                variant="solid"
                                                                rounded="full"
                                                                onClick={e => { e.stopPropagation(); handleEditWidget(widget); }}
                                                            >
                                                                <LuPen size={8} />
                                                            </IconButton>
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
                                                    )}
                                                </Box>
                                            </Box>
                                        ) : (
                                            <BlankWidget idx={idx} onAdd={() => handleAddWidget(idx)} />
                                        )}
                                    </DraggableSlot>
                                ))}
                            </SimpleGrid>
                        </SortableContext>
                    </DndContext>
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
                                        title={selectedWidget?.title || "Untitled Widget"}
                                        status={mapStatus(selectedWidget?.status)}
                                    />
                                    <Box flexGrow={1} alignContent="center">
                                        {mode === 'edit' && selectedWidget ? (
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
                                        ) : (
                                            <Box>
                                                ...
                                            </Box>
                                        )}
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