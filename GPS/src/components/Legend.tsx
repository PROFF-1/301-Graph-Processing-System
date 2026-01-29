import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NodeState } from '@/types/graph';

interface LegendProps {
  showPageRank?: boolean;
  showBidirectional?: boolean;
}

const legendItems: { state: NodeState; label: string; color: string }[] = [
  { state: 'source', label: 'Source', color: 'bg-node-source' },
  { state: 'target', label: 'Target', color: 'bg-node-target' },
  { state: 'visiting', label: 'Current', color: 'bg-node-current' },
  { state: 'visited', label: 'Visited', color: 'bg-node-visited' },
  { state: 'path', label: 'Path', color: 'bg-node-path' },
];

export const Legend: React.FC<LegendProps> = ({ 
  showPageRank = false,
  showBidirectional = false 
}) => {
  const items = showPageRank 
    ? [
        { state: 'path' as NodeState, label: 'High Rank', color: 'bg-node-path' },
        { state: 'visiting' as NodeState, label: 'Medium', color: 'bg-node-current' },
        { state: 'visited' as NodeState, label: 'Low Rank', color: 'bg-node-visited' },
      ]
    : showBidirectional
    ? [
        { state: 'source' as NodeState, label: 'Source', color: 'bg-node-source' },
        { state: 'target' as NodeState, label: 'Target', color: 'bg-node-target' },
        { state: 'forward-frontier' as NodeState, label: 'Forward', color: 'bg-[hsl(173,80%,50%)]' },
        { state: 'backward-frontier' as NodeState, label: 'Backward', color: 'bg-[hsl(339,90%,60%)]' },
        { state: 'path' as NodeState, label: 'Path', color: 'bg-node-path' },
      ]
    : legendItems;

  return (
    <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 bg-card/50 rounded-lg border border-border/50">
      <span className="text-xs text-muted-foreground mr-1">Legend:</span>
      {items.map((item) => (
        <Badge 
          key={item.state} 
          variant="outline" 
          className="text-xs py-0.5 gap-1.5"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          {item.label}
        </Badge>
      ))}
    </div>
  );
};
