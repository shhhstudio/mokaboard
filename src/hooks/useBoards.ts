import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Board } from '@/types';

export function useBoards(trackId: string | null) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) {
      setBoards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from('boards')
      .select('*')
      .eq('track_id', trackId)
      .then(({ data, error }) => {
        if (!error && data) {
          setBoards(data as Board[]);
        }
        setLoading(false);
      });
  }, [trackId]);

  return { boards, loading };
}

export async function createBoard(
  board: Omit<Board, 'id' | 'created_at'>,
): Promise<Board> {
  const { data, error } = await supabase
    .from('boards')
    .insert(board)
    .single();
  if (error || !data) throw error;
  return data as Board;
}

export async function updateBoard(
  id: string,
  updates: Partial<Board>,
): Promise<Board> {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', id)
    .single();
  if (error || !data) throw error;
  return data as Board;
}

export async function deleteBoard(id: string): Promise<void> {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
