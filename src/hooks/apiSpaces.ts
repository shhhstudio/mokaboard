import { supabase } from "@/lib/supabaseClient";
import type { Space } from "@/types";

export async function createSpace(space: Omit<Space, "id" | "created_at">): Promise<Space> {
    const { data, error } = await supabase
        .from("space")
        .insert(space)
        .select("id,name,description,created_by,date,status")
        .single();
    if (error || !data) throw error;
    return data as Space;
}

export async function updateSpace(id: string, updates: Partial<Space>): Promise<Space> {
    const { data, error } = await supabase
        .from("space")
        .update(updates)
        .eq("id", id)
        .select("id,name,description,created_by,date,status")
        .single();
    if (error || !data) throw error;
    return data as Space;
}

export async function deleteSpace(id: string): Promise<void> {
    const { error } = await supabase.from("space").delete().eq("id", id);
    if (error) throw error;
}
