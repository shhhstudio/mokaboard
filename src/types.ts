// ────────────────────────────────────────────────
// Re-aligned types (matching current schema)
// ────────────────────────────────────────────────

export type UUID = string;

/*─────────────────────────*/
/*  Shared enums           */
/*─────────────────────────*/
export type SpaceType = "private" | "team" | string;
export type PermissionRole = "owner" | "member" | "guest";
export type BoardStatus = "private" | "draft" | "published" | "archived";
export type WidgetHealth = "on_track" | "at_risk" | "fail" | null;

/*─────────────────────────*/
/*  Users                  */
/*─────────────────────────*/
export interface User {
  id: UUID;
  firstname: string | null;
  lastname: string | null;
  avatar_url: string | null;
  created_at: string;
}

/*─────────────────────────*/
/*  Space & membership     */
/*─────────────────────────*/
export interface Space {
  id: UUID;
  created_at: string;
  created_by: UUID;
  name: string | null;
  type: SpaceType;
}

export interface SpaceUser {
  id: UUID;
  created_at: string;
  space_id: UUID;
  user_id: UUID;
  role: PermissionRole;        // 'owner' | 'member' | 'guest'
}

/*─────────────────────────*/
/*  Track & membership     */
/*─────────────────────────*/
export interface Track {
  id: UUID;
  created_at: string;
  space_id: UUID | null;
  name: string | null;
  description: string | null;
}

export interface TrackUser {
  id: UUID;
  created_at: string;
  track_id: UUID;
  user_id: UUID;
  role: PermissionRole;
}

/*─────────────────────────*/
/*  Board (+ widgets)      */
/*─────────────────────────*/
export interface Board {
  id: UUID;
  created_at: string;
  updated_at: string;
  track_id: UUID | null;
  title: string | null;
  description: string | null;
  date: string | null;
  date_from: string | null;
  status: BoardStatus | null;  // 'private' | 'draft' | 'published' | 'archived' | null
  created_by: UUID;
}

export interface BoardWidget {
  id: number;                 // bigint → JS number
  created_at: string;
  board_id: UUID | null;
  widget_id: UUID | null;
  order: number | null;
}

/*─────────────────────────*/
/*  Widget & tags          */
/*─────────────────────────*/
export interface Widget {
  id: UUID;
  created_at: string;
  updated_at: string;
  created_by: UUID | null;
  title: string | null;
  type: string | null;         // e.g. 'kpi', 'announcement', …
  status: WidgetHealth;        // 'on_track' | 'at_risk' | 'fail' | null
  value: Record<string, any> | null;
}

export interface Tag {
  id: UUID;
  created_at: string;
  space_id: UUID;
  name: string;
  label: string | null;
  color: string | null;
  category: string | null;
  is_global: boolean;
}

export interface WidgetTag {
  id: number;                  // bigint → JS number
  widget_id: UUID;
  tag_id: UUID;
}
