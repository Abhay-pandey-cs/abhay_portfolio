'use client';

import { useState, useCallback } from 'react';
import { DataStore } from '@/lib/storage';
import { SiteSettings } from '@/types';
import { generateId } from '@/lib/utils';

interface HistoryEntry<T> { data: T[]; timestamp: number; action: string; }

export function useAdminStore<T extends { id: string }>(
  storageKey: string,
  initialData: T[],
  getData: () => T[],
  setData: (data: T[]) => void
) {
  const [data, setDataState] = useState<T[]>(initialData);
  const [history, setHistory] = useState<HistoryEntry<T>[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const MAX_HISTORY = 50;

  const pushHistory = useCallback((newData: T[], action: string) => {
    setHistory(prev => {
      const nh = prev.slice(0, historyIndex + 1);
      nh.push({ data: newData, timestamp: Date.now(), action });
      if (nh.length > MAX_HISTORY) nh.shift();
      return nh;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  const refresh = useCallback(() => {
    const f = getData();
    setDataState(f);
    setHistory([]);
    setHistoryIndex(-1);
  }, [getData]);

  const add = useCallback((item: Omit<T, 'id'> & { id?: string }) => {
    const ni = { ...item, id: item.id || generateId() } as T;
    const nd = [...data, ni];
    setDataState(nd);
    setData(nd);
    pushHistory(nd, `Added ${storageKey}`);
    return ni;
  }, [data, setData, pushHistory, storageKey]);

  const update = useCallback((id: string, ups: Partial<T>) => {
    const nd = data.map(i => i.id === id ? { ...i, ...ups } : i);
    setDataState(nd);
    setData(nd);
    pushHistory(nd, `Updated ${storageKey}`);
  }, [data, setData, pushHistory, storageKey]);

  const remove = useCallback((id: string) => {
    const nd = data.filter(i => i.id !== id);
    setDataState(nd);
    setData(nd);
    pushHistory(nd, `Deleted ${storageKey}`);
  }, [data, setData, pushHistory, storageKey]);

  return {
    data,
    setData: setDataState,
    refresh,
    add,
    update,
    remove,
  };
}
