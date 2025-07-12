import { useState, useCallback } from "react";
import type { Invitation } from "@/types";
import type { PostgrestError } from "@supabase/postgrest-js";
import { createInvitation as apiCreate, claimInvitation as apiClaim } from "@/api/invitations";

interface State {
  loading: boolean;
  error: PostgrestError | null;
}

export function useInvitationActions() {
  const [state, setState] = useState<State>({ loading: false, error: null });

  const createInvitation = useCallback(
    async (
      invitation: Omit<
        Invitation,
        "id" | "created_at" | "token" | "status" | "accepted_by"
      >
    ) => {
      setState(s => ({ ...s, loading: true, error: null }));
      try {
        const data = await apiCreate(invitation);
        setState(s => ({ ...s, loading: false }));
        return data;
      } catch (error: any) {
        setState({ loading: false, error });
        throw error;
      }
    },
    []
  );

  const claimInvitation = useCallback(async (token: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      await apiClaim(token);
      setState(s => ({ ...s, loading: false }));
    } catch (error: any) {
      setState({ loading: false, error });
      throw error;
    }
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    createInvitation,
    claimInvitation,
  };
}

