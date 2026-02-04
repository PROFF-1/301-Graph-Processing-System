import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shuffle } from 'lucide-react';
import { CustomGraph } from '@/hooks/useGraphStorage';
import { SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { sampleGraphs } from '@/lib/sampleGraphs';

interface GraphSelectorProps {
  selectedGraphId: string;
  onGraphChange: (id: string, type: 'sample' | 'custom') => void;
  customGraphs: CustomGraph[];
}

export const GraphSelector: React.FC<GraphSelectorProps> = ({
  selectedGraphId,
  onGraphChange,
  customGraphs,
}) => {
  const getGraphDetails = () => {
    if (selectedGraphId.startsWith('custom-')) {
      const g = customGraphs.find(g => g.id === selectedGraphId);
      return g ? { nodes: g.graph.nodes.length, edges: g.graph.edges.length, type: g.graph.directed } : null;
    } else {
      const index = parseInt(selectedGraphId.replace('sample-', ''));
      const g = sampleGraphs[index];
      return g ? { nodes: g.graph.nodes.length, edges: g.graph.edges.length, type: g.graph.directed } : null;
    }
  };

  const details = getGraphDetails();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-primary" />
          Select Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedGraphId}
          onValueChange={(v) => {
            if (v.startsWith('custom-')) {
              onGraphChange(v, 'custom');
            } else {
              onGraphChange(v, 'sample');
            }
          }}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sample Graphs</SelectLabel>
              {sampleGraphs.map((sg, index) => (
                <SelectItem key={`sample-${index}`} value={`sample-${index}`}>
                  {sg.name}
                </SelectItem>
              ))}
            </SelectGroup>

            {customGraphs.length > 0 && (
              <>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>My Graphs</SelectLabel>
                  {customGraphs.map((cg) => (
                    <SelectItem key={cg.id} value={cg.id}>
                      {cg.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </>
            )}
          </SelectContent>
        </Select>

        {details && (
          <div className="mt-3 text-xs text-muted-foreground">
            <p>Nodes: {details.nodes}</p>
            <p>Edges: {details.edges}</p>
            <p>Type: {details.type ? 'Directed' : 'Undirected'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
