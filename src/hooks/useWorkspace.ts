import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
    Board,
    Space,
    Track,
    UUID,
    PermissionRole,
    BoardPermissionRole,
} from "@/types";

export interface WorkspaceTreeSpace extends Space {
    space_user?: { user_id: UUID; role: PermissionRole }[];
    track?: Array<WorkspaceTreeTrack>;
}
export interface WorkspaceTreeTrack extends Track {
    track_user?: { user_id: UUID; role: PermissionRole }[];
    board?: Array<WorkspaceTreeBoard>;
}
export interface WorkspaceTreeBoard extends Board {
    board_user?: { user_id: UUID; role: BoardPermissionRole }[];
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
                const { data, error } = await supabase
                    .from('space')
                    .select(`*,track(*,board(*))`);
                if (error) throw error;
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
