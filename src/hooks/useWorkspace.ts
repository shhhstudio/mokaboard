import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
    Board,
    Space,
    Track,
    Widget,
    BoardWidget,
    TrackUserRow,
    SpaceUserRow,
    User
} from "@/types";

export interface WorkspaceTreeBoard extends Board {
    /* boards no longer carry board_user because table was removed */
    widgets?: Array<Widget & { boardWidget: BoardWidget }>;
}

export interface WorkspaceTreeTrack extends Track {
    /* members—in the same shape you select: role + user object   */
    members?: Array<TrackUserRow & {
        user: Pick<User,
            "id" | "firstname" | "lastname" | "avatar_url">
    }>;
    board?: WorkspaceTreeBoard[];
}

export interface WorkspaceTreeSpace extends Space {
    /* members of the space */
    space_user?: Array<SpaceUserRow & {
        user: Pick<User,
            "id" | "firstname" | "lastname" | "avatar_url">
    }>;
    track?: WorkspaceTreeTrack[];
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
                const { data, error } = await supabase.from("space").select(`*,track(*,board(*),members:track_user(role,user:users(id, firstname, lastname, avatar_url)))`);
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
