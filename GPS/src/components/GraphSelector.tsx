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
import { sampleGraphs } from '@/lib/sampleGraphs';

interface GraphSelectorProps {
  selectedGraphIndex: number;
  onGraphChange: (index: number) => void;
}

export const GraphSelector: React.FC<GraphSelectorProps> = ({
  selectedGraphIndex,
  onGraphChange,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-primary" />
          Sample Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedGraphIndex.toString()} 
          onValueChange={(v) => onGraphChange(parseInt(v))}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sampleGraphs.map((sg, index) => (
              <SelectItem key={index} value={index.toString()}>
                {sg.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Nodes: {sampleGraphs[selectedGraphIndex]?.graph.nodes.length}</p>
          <p>Edges: {sampleGraphs[selectedGraphIndex]?.graph.edges.length}</p>
          <p>Type: {sampleGraphs[selectedGraphIndex]?.graph.directed ? 'Directed' : 'Undirected'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
