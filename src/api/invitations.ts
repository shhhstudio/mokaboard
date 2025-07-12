import { supabase } from "@/lib/supabaseClient";
import type { Invitation } from "@/types";

export async function createInvitation(
  invitation: Omit<
    Invitation,
    "id" | "created_at" | "token" | "status" | "accepted_by"
  >
): Promise<Invitation> {
  const { data, error } = await supabase
    .from("invitation")
    .insert(invitation)
    .select("*")
    .single();
  if (error || !data) throw error;
  return data as Invitation;
}

export async function updateInvitation(
  id: string,
  updates: Partial<Invitation>
): Promise<Invitation> {
  const { data, error } = await supabase
    .from("invitation")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw error;
  return data as Invitation;
}

export async function deleteInvitation(id: string): Promise<void> {
  const { error } = await supabase.from("invitation").delete().eq("id", id);
  if (error) throw error;
}

export async function claimInvitation(token: string): Promise<void> {
  const { error } = await supabase.rpc("claim_invitation", { p_token: token });
  if (error) throw error;
}
