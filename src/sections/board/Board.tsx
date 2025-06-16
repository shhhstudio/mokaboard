import React from "react";
import { useParams, navigate } from "@reach/router";
import { Box, Button, Heading, Spinner, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import { useBoard } from "@/hooks/useBoard";
import { StatusWidget, BlankWidget } from "@/components/widgets";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const Board: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { board, error, initialLoading, loading, refetch } = useBoard(uuid || null);

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

    // Handle drag end
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = localSlots.findIndex(w => w && w.id === active.id);
        const newIndex = localSlots.findIndex(w => w && w.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const newSlots = arrayMove(localSlots, oldIndex, newIndex);
        setLocalSlots(newSlots);
        // TODO: Persist new order to backend if needed
    };

    // Sortable widget wrapper
    function DraggableSlot({ widget, idx, children }: { widget: any, idx: number, children: React.ReactNode }) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: widget?.id ?? `empty-${idx}`,
            disabled: !widget,
        });
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            zIndex: isDragging ? 2 : 1,
            opacity: isDragging ? 0.7 : 1,
        };
        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                {children}
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
    const mapStatus = (status: string | null | undefined): "success" | "warning" | "error" | "info" => {
        if (!status) return "info";
        if (["success", "on_track"].includes(status)) return "success";
        if (["warning", "at_risk"].includes(status)) return "warning";
        if (["error", "fail"].includes(status)) return "error";
        return "info";
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

    return (
        <Flex minH="100vh" bg="gray.50" direction="column">
            <Flex as="header" w="100%" bg="white" px={8} py={4} align="center" justify="space-between" boxShadow="sm">
                <Heading size="md">{board.title || "Untitled Board"}</Heading>
                <Flex gap={2} align="center">
                    {loading && <Spinner size="sm" color="blue.500" mr={2} />}
                    <Button colorScheme="blue" size="sm" onClick={() => handleAddWidget()}>+ Add Widget</Button>
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
                                opacity={loading ? 0.5 : 1}
                                pointerEvents={loading ? "none" : undefined}
                            >
                                {localSlots.map((widget, idx) => (
                                    <DraggableSlot key={widget?.id ?? `empty-${idx}`} widget={widget} idx={idx}>
                                        {widget ? (
                                            <Box
                                                minH="120px"
                                                bg="white"
                                                borderRadius="md"
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Box position="relative" w="100%" h="100%">
                                                    <StatusWidget
                                                        title={widget.title || "Untitled Widget"}
                                                        status={mapStatus(widget.status)}
                                                    />
                                                    <Flex position="absolute" top={2} right={2} gap={1} zIndex={1}>
                                                        <Button size="xs" mr={1} onClick={() => handleEditWidget(widget)}>Edit</Button>
                                                        <Button size="xs" colorScheme="red" onClick={() => handleDeleteWidget(widget)}>Delete</Button>
                                                    </Flex>
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
        </Flex>
    );
};