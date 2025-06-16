import { supabase } from "@/lib/supabaseClient";
import type { Widget, BoardWidget } from "@/types";

// CRUD for Widget
export async function createWidget(widget: Omit<Widget, "id" | "created_at">): Promise<Widget> {
    const { data, error } = await supabase
        .from("widget")
        .insert(widget)
        .select("id,title,created_by,type,status,value,created_at")
        .single();
    if (error || !data) throw error;
    return data as Widget;
}

export async function updateWidget(id: string, updates: Partial<Widget>): Promise<Widget> {
    const { data, error } = await supabase
        .from("widget")
        .update(updates)
        .eq("id", id)
        .select("id,title,created_by,type,status,value,created_at")
        .single();
    if (error || !data) throw error;
    return data as Widget;
}

export async function deleteWidget(id: string): Promise<void> {
    const { error } = await supabase.from("widget").delete().eq("id", id);
    if (error) throw error;
}

// CRUD for BoardWidget (pivot table)
export async function addWidgetToBoard(boardWidget: Omit<BoardWidget, "id" | "created_at">): Promise<BoardWidget> {
    const { data, error } = await supabase
        .from("board_widget")
        .insert(boardWidget)
        .select("id,created_at,board_id,widget_id,order")
        .single();
    if (error || !data) throw error;
    return data as BoardWidget;
}

export async function updateBoardWidget(id: number, updates: Partial<BoardWidget>): Promise<BoardWidget> {
    const { data, error } = await supabase
        .from("board_widget")
        .update(updates)
        .eq("id", id)
        .select("id,created_at,board_id,widget_id,order")
        .single();
    if (error || !data) throw error;
    return data as BoardWidget;
}

export async function deleteBoardWidget(id: number): Promise<void> {
    const { error } = await supabase.from("board_widget").delete().eq("id", id);
    if (error) throw error;
}
