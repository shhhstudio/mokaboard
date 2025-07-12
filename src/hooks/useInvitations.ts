import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Invitation } from "@/types";

interface State {
  invitations: Invitation[];
  loading: boolean;
  error: Error | null;
}

export function useInvitations() {
  const [state, setState] = useState<State>({
    invitations: [],
    loading: true,
    error: null,
  });

  const fetchInvitations = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    const { data, error } = await supabase.from("invitation").select("*");
    if (error) {
      setState({ invitations: [], loading: false, error });
    } else {
      setState({ invitations: data || [], loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations: state.invitations,
    loading: state.loading,
    error: state.error,
    refresh: fetchInvitations,
  };
}
