import React, { useCallback, useEffect, useMemo } from "react";
import { Box, Button, Heading, Flex, SimpleGrid } from "@chakra-ui/react";
import { Widget, BlankWidget } from "@/components/widgets";
import { LuTrash2 } from "react-icons/lu";
import { Widget as WidgetType } from "@/types";
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

export const BoardContent: React.FC<BoardContentProps> = ({
    board,
    refetch,
}) => {
    // Selection state for widget
    const [selectedWidgetId, setSelectedWidgetId] = React.useState<string | null>(
        null
    );

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

    // Generalized handler map for widgets
    const widgetHandlerMap = useMemo(() => {
        const map = new Map<
            string,
            {
                onChange: (changes: Partial<WidgetType>) => Promise<void>;
                onClick: (e: any) => void;
                onDelete?: (widget: any) => Promise<void>;
            }
        >();
        (board?.widgets || []).forEach((widget: WidgetType) => {
            map.set(widget.id, {
                onChange: async (changes: Partial<WidgetType>) => {
                    await updateWidget(widget.id, changes);
                    await refetch();
                },
                onClick: (e) => {
                    e.stopPropagation();
                    setSelectedWidgetId(widget.id);
                },
                onDelete: async () => {
                    try {
                        await deleteBoardWidget(widget.boardWidget.id);
                        await deleteWidget(widget.id);
                        await refetch();
                    } catch (e) {
                        console.error("Failed to delete widget:", e);
                    }
                }
            });
        });
        return map;
    }, [board, refetch]);

    const handleAddWidget = async (order?: number) => {
        try {
            const widget = await createWidget({
                title: "",
                created_by: board!.created_by,
                type: "kpi",
                status: null,
                value: {},
            });
            const newWidget = await addWidgetToBoard({
                board_id: board!.id,
                widget_id: widget.id,
                order: typeof order === "number" ? order : board!.widgets.length,
            });
            if (newWidget && newWidget.widget_id) {
                setSelectedWidgetId(newWidget.widget_id);
            }
            await refetch();
        } catch {
            alert("Failed to add widget");
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
            <Flex flex={1} align="center" justify="center" marginY={8} onClick={() => setSelectedWidgetId(null)}>
                <Box position="relative" width="100%">
                    <SimpleGrid
                        columns={[2, 2, 4, 4]}
                        gap={[2, 6, 6, 8]}
                        width="max-content"
                        marginX="auto"
                    >
                        {slots.map((widget, idx) =>
                            widget ? (
                                <Widget
                                    widget={widget}
                                    onChange={widgetHandlerMap.get(widget.id)?.onChange}
                                    onClick={widgetHandlerMap.get(widget.id)?.onClick}
                                    onDelete={widgetHandlerMap.get(widget.id)?.onDelete}
                                    selected={selectedWidgetId === widget.id}
                                    key={widget.id}
                                />
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
