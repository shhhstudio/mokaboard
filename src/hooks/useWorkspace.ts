import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Board, Space, Track } from "@/types";

export interface WorkspaceTreeSpace extends Space {
    track?: Array<WorkspaceTreeTrack>;
}
export interface WorkspaceTreeTrack extends Track {
    board?: Array<Board>;
}

export interface WorkspaceTree {
    spaces: WorkspaceTreeSpace[];
}

export function useWorkspace() {
    const [workspace, setWorkspace] = useState<WorkspaceTree>({ spaces: [] });
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const isFirstLoad = useRef(true);

    const refreshWorkspace = useCallback(() => {
        setLoading(true);
        setError(null);
        (async () => {
            try {
                // Deep select: spaces -> track -> board
                const { data, error } = await supabase
                    .from("space")
                    .select(`id,created_at,created_by,name,type,track(id,created_at,space_id,name,description,board(id,created_at,track_id,title,description,date,date_from,status,created_by))`);
                if (error) throw error;
                // Keep the tree structure as returned by Supabase
                setWorkspace({ spaces: data || [] });
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
                if (isFirstLoad.current) {
                    setInitialLoading(false);
                    isFirstLoad.current = false;
                }
            }
        })();
    }, []);

    useEffect(() => {
        refreshWorkspace();
    }, [refreshWorkspace]);

    return {
        workspace,
        loading,
        initialLoading,
        error,
        refreshWorkspace,
    };
}
