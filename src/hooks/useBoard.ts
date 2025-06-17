import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Board, Widget, BoardWidget, Tag } from "@/types";

export interface BoardWithWidgets extends Board {
    widgets: Array<Widget & { boardWidget: BoardWidget }>;
}

export function useBoard(boardId: string | null) {
    const [board, setBoard] = useState<BoardWithWidgets | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchBoard = useCallback(async (isInitial = false) => {
        if (!boardId) {
            setBoard(null);
            setInitialLoading(false);
            setLoading(false);
            return;
        }
        setError(null);
        if (isInitial) {
            setInitialLoading(true);
        }
        setLoading(true);
        const { data, error } = await supabase
            .from("board")
            .select(`*, board_widget:board_widget(*, widget:widget(*, widget_tag:widget_tag(tag(*))))`)
            .eq("id", boardId)
            .single();
        if (error || !data) {
            setError(error || new Error("Board not found"));
            setBoard(null);
            if (isInitial) {
                setInitialLoading(false);
            }
            setLoading(false);
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
        setBoard({ ...data, widgets });
        setInitialLoading(false);
        setLoading(false);
    }, [boardId]);

    useEffect(() => {
        fetchBoard(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchBoard]);

    // Refetch for actions (not initial load)
    const refetch = useCallback(async () => {
        await fetchBoard(false);
    }, [fetchBoard]);

    return { board, error, initialLoading, loading, refetch };
}
