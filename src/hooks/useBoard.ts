import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Board, Widget, BoardWidget, Tag } from "@/types";

export interface BoardWithWidgets extends Board {
    widgets: Array<Widget & { boardWidget: BoardWidget; tags: Tag[] }>;
}

interface BoardState {
    board: BoardWithWidgets | null;
    error: Error | null;
    initialLoading: boolean;
}

export function useBoard(boardId: string | null) {
    const [state, setState] = useState<BoardState>({
        board: null,
        error: null,
        initialLoading: true,
    });

    // Factorized fetch logic
    const fetchBoard = useCallback(
        async (isInitial = false) => {
            if (!boardId) {
                setState(s => ({ ...s, board: null, initialLoading: false }));
                return;
            }
            const { data, error } = await supabase
                .from("board")
                .select(`*, board_widget:board_widget(*, widget:widget(*, widget_tag:widget_tag(tag(*))))`)
                .eq("id", boardId)
                .single();
            if (error || !data) {
                setState(s => ({ ...s, board: null, error: error || new Error("Board not found"), initialLoading: false }));
                return;
            }
            const widgets: BoardWithWidgets["widgets"] = (data.board_widget || []).map((bw: any) => {
                const tags = (bw.widget.widget_tag || []).map((wt: any) => wt.tag);
                return {
                    ...bw.widget,
                    boardWidget: {
                        id: bw.id,
                        created_at: bw.created_at,
                        board_id: bw.board_id,
                        widget_id: bw.widget_id,
                        order: bw.order,
                    },
                    tags,
                };
            });
            setState(s => ({ ...s, board: { ...data, widgets }, initialLoading: false, error: null }));
        },
        [boardId]
    );

    useEffect(() => {
        fetchBoard(true);
    }, [boardId, fetchBoard]);

    // Refetch for actions (not initial load)
    const refetch = useCallback(() => { return fetchBoard(false) }, [fetchBoard]);

    return { board: state.board, error: state.error, initialLoading: state.initialLoading, refetch };
}
