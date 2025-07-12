import { supabase } from "@/lib/supabaseClient";
import type { Board } from "@/types";

export async function createBoard(board: Omit<Board, "id" | "created_at">): Promise<Board> {
    const { data, error } = await supabase
        .from("board")
        .insert(board)
        .select("*") // Use * to always get all fields, or specify new fields
        .single();
    if (error || !data) throw error;
    return data as Board;
}

export async function updateBoard(id: string, updates: Partial<Board>): Promise<Board> {
    const { data, error } = await supabase
        .from("board")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as Board;
}

export async function deleteBoard(id: string): Promise<void> {
    const { error } = await supabase.from("board").delete().eq("id", id);
    if (error) throw error;
}
