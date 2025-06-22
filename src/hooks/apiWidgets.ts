import { supabase } from "@/lib/supabaseClient";
import type { Widget, BoardWidget, Tag, WidgetTag } from "@/types";

// CRUD for Widget
export async function createWidget(widget: Omit<Widget, "id" | "created_at" | "scopes">): Promise<Widget> {
    const { data, error } = await supabase
        .from("widget")
        .insert(widget)
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as Widget;
}

export async function updateWidget(id: string, updates: Partial<Widget>): Promise<Widget> {
    const { data, error } = await supabase
        .from("widget")
        .update(updates)
        .eq("id", id)
        .select("*")
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
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as BoardWidget;
}

export async function updateBoardWidget(id: number, updates: Partial<BoardWidget>): Promise<BoardWidget> {
    const { data, error } = await supabase
        .from("board_widget")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as BoardWidget;
}

export async function deleteBoardWidget(id: number): Promise<void> {
    const { error } = await supabase.from("board_widget").delete().eq("id", id);
    if (error) throw error;
}

// TAG API
export async function getTagsForSpace(space_id: string): Promise<Tag[]> {
    const { data, error } = await supabase
        .from("tag")
        .select("*")
        .eq("space_id", space_id);
    if (error) throw error;
    return data as Tag[];
}

export async function createTag(tag: Omit<Tag, "id" | "created_at">): Promise<Tag> {
    const { data, error } = await supabase
        .from("tag")
        .insert(tag)
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as Tag;
}

export async function updateTag(id: string, updates: Partial<Tag>): Promise<Tag> {
    const { data, error } = await supabase
        .from("tag")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as Tag;
}

export async function deleteTag(id: string): Promise<void> {
    const { error } = await supabase.from("tag").delete().eq("id", id);
    if (error) throw error;
}

// WIDGET_TAG API
export async function addTagToWidget(widget_id: string, tag_id: string): Promise<WidgetTag> {
    const { data, error } = await supabase
        .from("widget_tag")
        .insert({ widget_id, tag_id })
        .select("*")
        .single();
    if (error || !data) throw error;
    return data as WidgetTag;
}

export async function removeTagFromWidget(widget_id: string, tag_id: string): Promise<void> {
    const { error } = await supabase
        .from("widget_tag")
        .delete()
        .eq("widget_id", widget_id)
        .eq("tag_id", tag_id);
    if (error) throw error;
}

export async function getTagsForWidget(widget_id: string): Promise<Tag[]> {
    const { data, error } = await supabase
        .from("widget_tag")
        .select("tag(*)")
        .eq("widget_id", widget_id);
    if (error) throw error;
    return (data || []).map((row: any) => row.tag as Tag);
}
