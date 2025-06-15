export type UUID = string;

export type SpaceType = "private" | "team" | string;

export interface User {
  id: UUID;
  firstname: string | null;
  lastname: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Space {
  id: UUID;
  created_at: string;
  created_by: UUID;
  name: string | null;
  type: SpaceType;
}

export interface Track {
  id: UUID;
  created_at: string;
  space_id: UUID;
  name: string | null;
  description: string | null;
}

export interface Board {
  id: UUID;
  created_at: string;
  track_id: UUID | null;
  title: string | null;
  description: string | null;
  date: string | null;
  date_from: string | null;
  status: "draft" | "ready" | "archived" | string | null;
  created_by: UUID;
}

export interface Widget {
  id: UUID;
  created_at: string;
  created_by: UUID;
  title: string | null;
  type: "kpi" | "announcement" | "question" | "help" | string;
  status: "on_track" | "at_risk" | "fail" | null;
  value: Record<string, any>;
}

export interface BoardWidget {
  id: number;
  created_at: string;
  board_id: UUID;
  widget_id: UUID;
  order: number;
}
