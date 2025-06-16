import { supabase } from "@/lib/supabaseClient";
import type { Track } from "@/types";

export async function createTrack(track: Omit<Track, "id" | "created_at">): Promise<Track> {
    const { data, error } = await supabase
        .from("track")
        .insert(track)
        .select("id,name,description,space_id")
        .single();
    if (error || !data) throw error;
    return data as Track;
}

export async function updateTrack(id: string, updates: Partial<Track>): Promise<Track> {
    const { data, error } = await supabase
        .from("track")
        .update(updates)
        .eq("id", id)
        .select("id,name,description,space_id")
        .single();
    if (error || !data) throw error;
    return data as Track;
}

export async function deleteTrack(id: string): Promise<void> {
    const { error } = await supabase.from("track").delete().eq("id", id);
    if (error) throw error;
}
