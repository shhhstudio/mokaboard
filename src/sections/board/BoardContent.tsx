import React, { useEffect, useMemo } from "react";
import {
    Box,
    Button,
    Heading,
    Text,
    Flex,
    SimpleGrid,
    IconButton,
    Textarea,
} from "@chakra-ui/react";
import { StatusWidget, BlankWidget } from "@/components/widgets";
import { LuTrash2 } from "react-icons/lu";
import { Widget } from "@/types";
import { navigate } from "@reach/router";
import {
    updateWidget,
    deleteBoardWidget,
    deleteWidget,
    createWidget,
    addWidgetToBoard,
} from "@/hooks/apiWidgets";

interface BoardContentProps {
    board: any;
    refetch: () => void;
}

export const BoardContent: React.FC<BoardContentProps> = ({ board, refetch }) => {
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
            map.set(widget.id, async (changes: Partial<Widget>) => {
                await updateWidget(widget.id, changes);
                await refetch();
            });
        });
        return map;
    }, [board, refetch]);

    // Add widget handler
    const handleAddWidget = async (order?: number) => {
        try {
            // Create a widget with empty title
            const widget = await createWidget({
                title: "",
                created_by: board!.created_by,
                type: "kpi",
                status: null,
                value: {},
            });
            await addWidgetToBoard({
                board_id: board!.id,
                widget_id: widget.id,
                order: typeof order === "number" ? order : board!.widgets.length,
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
            await deleteBoardWidget(widget.boardWidget.id);
            await deleteWidget(widget.id);
            await refetch();
        } catch {
            alert("Failed to delete widget");
        }
    };

    if (!board) return null;

    return (
        <Flex minH="100vh" bg="gray.50" direction="column">
            <Flex
                as="header"
                w="100%"
                bg="white"
                px={8}
                py={4}
                align="center"
                justify="space-between"
                boxShadow="sm"
            >
                <Heading size="md">{board?.title || "Untitled Board"}</Heading>
                <Flex gap={2} align="center">
                    <Button colorScheme="gray" size="sm" onClick={() => navigate("/app")}>
                        Back
                    </Button>
                </Flex>
            </Flex>
            <Flex flex={1} align="center" justify="center" p={8} bgColor="white">
                <Box position="relative" width="100%">
                    <SimpleGrid
                        columns={[2, 2, 4, 4]}
                        gap={[2, 6, 6, 8]}
                        width="max-content"
                        marginX="auto"
                    >
                        {slots.map((widget, idx) =>
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
                                    cursor="pointer"
                                >
                                    <Box position="relative" w="100%" h="100%">
                                        <StatusWidget
                                            widget={widget}
                                            onChange={widgetOnChangeMap.get(widget.id)}
                                        />
                                        <Flex
                                            position="absolute"
                                            bottom={2}
                                            right={2}
                                            gap={1}
                                            zIndex={3}
                                            pointerEvents="auto"
                                        >
                                            <IconButton
                                                aria-label="Delete"
                                                size="2xs"
                                                rounded="full"
                                                variant="solid"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteWidget(widget);
                                                }}
                                            >
                                                <LuTrash2 size={8} />
                                            </IconButton>
                                        </Flex>
                                    </Box>
                                </Box>
                            ) : (
                                <BlankWidget
                                    key={`empty-${idx}`}
                                    idx={idx}
                                    onAdd={() => handleAddWidget(idx)}
                                />
                            )
                        )}
                    </SimpleGrid>
                </Box>
            </Flex>
        </Flex>
    );
};
