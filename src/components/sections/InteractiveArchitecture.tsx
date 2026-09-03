'use client';

import React, { useState } from 'react';
import { ArchitectureNode } from '@/types';
import { ArrowRight, Cpu, Info, CheckCircle2 } from 'lucide-react';

interface InteractiveArchitectureProps {
  nodes?: ArchitectureNode[];
  description?: string;
}

export const InteractiveArchitecture: React.FC<InteractiveArchitectureProps> = ({
  nodes = [],
  description,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] text-xs font-mono text-gray-400">
        {description || 'Architecture overview pipeline'}
      </div>
    );
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="p-5 rounded-xl bg-[#141518] border border-[#2e3038] space-y-4 font-sans">
      {/* Title & helper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#007acc]" />
          <h4 className="text-xs font-mono font-bold text-gray-200 uppercase tracking-wider">
            Interactive Architecture Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-[#38bdf8]" />
          Click or hover nodes to inspect data flow
        </span>
      </div>

      {/* Nodes Flowchart Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 px-1 scrollbar-none">
        {nodes.map((node, index) => {
          const isSelected = selectedNode?.id === node.id;
          const isLast = index === nodes.length - 1;

          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => setSelectedNodeId(node.id)}
                className={`flex-shrink-0 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#007acc]/20 border-[#007acc] text-white shadow-lg shadow-[#007acc]/20 scale-105'
                    : 'bg-[#1e2026] border-[#343740] text-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#2a2d36] flex items-center justify-center text-[10px] font-mono font-bold text-[#38bdf8]">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold font-mono whitespace-nowrap">{node.label}</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400">{node.role}</div>
              </div>

              {!isLast && (
                <div className="flex-shrink-0 flex items-center justify-center px-1 text-gray-400">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Deep Inspector */}
      {selectedNode && (
        <div className="p-4 rounded-lg bg-[#1a1b20] border border-[#2b2e37] space-y-2 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#007acc]/20 text-[#38bdf8] font-mono text-xs font-semibold">
                Node {nodes.findIndex(n => n.id === selectedNode.id) + 1}: {selectedNode.label}
              </span>
              <span className="text-xs text-gray-400 font-mono">({selectedNode.role})</span>
            </div>

            {selectedNode.tech && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#25272e] border border-[#383a42] text-gray-300">
                Tech: {selectedNode.tech}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            {selectedNode.description}
          </p>
        </div>
      )}
    </div>
  );
};
