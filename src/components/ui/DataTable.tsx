'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Dropdown } from './Dropdown';
import { Skeleton } from './Skeleton';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selection?: { selected: Set<string>; onChange: (s: Set<string>) => void };
  sortable?: boolean;
  filterable?: boolean;
  pagination?: { page: number; pageSize: number; total: number; onChange: (p: number, ps: number) => void };
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: (row: T) => string;
  actions?: { options: Array<{ label: string; value: string; icon?: React.ReactNode; danger?: boolean }>; onAction: (a: string, r: T) => void };
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, keyExtractor, onRowClick, selection, sortable = true, filterable = true, pagination, loading = false, emptyMessage = 'No data available', rowClassName, actions, className = '',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const sortedAndFilteredData = useMemo(() => {
    let result = [...data];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== '__global') result = result.filter(row => String(row[key] || '').toLowerCase().includes(value.toLowerCase()));
    });
    if (filters.__global) { const s = filters.__global.toLowerCase(); result = result.filter(row => Object.values(row).some(v => String(v || '').toLowerCase().includes(s))); }
    if (sortConfig) result.sort((a, b) => { const av = a[sortConfig.key], bv = b[sortConfig.key]; if (av === bv) return 0; return (String(av) > String(bv) ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1); });
    return result;
  }, [data, sortConfig, filters]);

  const handleSort = (key: string) => { if (sortable) setSortConfig(p => ({ key, direction: p?.key === key && p.direction === 'asc' ? 'desc' : 'asc' })); };
  const handleFilterChange = (key: string, value: string) => setFilters(p => ({ ...p, [key]: value }));
  const toggleSelectAll = () => { if (!selection) return; const ks = sortedAndFilteredData.map(keyExtractor); const all = ks.every(k => selection.selected.has(k)); selection.onChange(new Set(all ? [] : [...selection.selected, ...ks])); };
  const handleRowSelect = (key: string) => { if (!selection) return; const ns = new Set(selection.selected); ns.has(key) ? ns.delete(key) : ns.add(key); selection.onChange(ns); };
  const displayedData = pagination ? sortedAndFilteredData.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize) : sortedAndFilteredData;

  if (loading) return <div className={cn('rounded-xl bg-[#18191d] border border-[#2e3038] overflow-hidden', className)}><div className="p-4 space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}</div></div>;

  return (
    <div className={cn('rounded-xl bg-[#18191d] border border-[#2e3038] overflow-hidden', className)}>
      <div>DataTable component - minimal version</div>
    </div>
  );
}