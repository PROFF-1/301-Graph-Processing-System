import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowRightLeft, 
  Route, 
  GitBranch,
  Gauge,
  Star,
  Play
} from 'lucide-react';
import { AlgorithmType } from '@/types/graph';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  onRun: () => void;
  selectedSource: string | null;
  selectedTarget: string | null;
  isRunning: boolean;
}

const algorithms: { 
  id: AlgorithmType; 
  name: string; 
  icon: React.ReactNode;
  description: string;
  complexity: string;
  requiresTarget: boolean;
}[] = [
  {
    id: 'bidirectional-bfs',
    name: 'Bidirectional BFS',
    icon: <ArrowRightLeft className="w-4 h-4" />,
    description: 'Search from both ends, meet in middle',
    complexity: 'O(b^(d/2))',
    requiresTarget: true,
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    icon: <Gauge className="w-4 h-4" />,
    description: 'Shortest path with weighted edges',
    complexity: 'O((V+E) log V)',
    requiresTarget: true,
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    icon: <GitBranch className="w-4 h-4" />,
    description: 'Explore deep before backtracking',
    complexity: 'O(V + E)',
    requiresTarget: true,
  },
  {
    id: 'shortest-path',
    name: 'BFS Shortest Path',
    icon: <Route className="w-4 h-4" />,
    description: 'Standard BFS for unweighted graphs',
    complexity: 'O(V + E)',
    requiresTarget: true,
  },
  {
    id: 'pagerank',
    name: 'PageRank',
    icon: <Star className="w-4 h-4" />,
    description: 'Rank nodes by importance',
    complexity: 'O(E × iter)',
    requiresTarget: false,
  },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onRun,
  selectedSource,
  selectedTarget,
  isRunning,
}) => {
  const currentAlgo = algorithms.find(a => a.id === selectedAlgorithm);
  const canRun = currentAlgo?.requiresTarget 
    ? selectedSource && selectedTarget 
    : selectedSource || !currentAlgo?.requiresTarget;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Algorithm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select 
          value={selectedAlgorithm} 
          onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {algorithms.map((algo) => (
              <SelectItem key={algo.id} value={algo.id}>
                <div className="flex items-center gap-2">
                  {algo.icon}
                  <span>{algo.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentAlgo && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {currentAlgo.description}
            </p>
            <Badge variant="outline" className="font-mono text-xs">
              {currentAlgo.complexity}
            </Badge>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Source:</span>
            <Badge 
              variant={selectedSource ? 'default' : 'secondary'}
              className={selectedSource ? 'bg-node-source text-primary-foreground' : ''}
            >
              {selectedSource || 'Click a node'}
            </Badge>
          </div>
          
          {currentAlgo?.requiresTarget && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Target:</span>
              <Badge 
                variant={selectedTarget ? 'default' : 'secondary'}
                className={selectedTarget ? 'bg-node-target text-foreground' : ''}
              >
                {selectedTarget || 'Click another node'}
              </Badge>
            </div>
          )}
        </div>

        <Button
          onClick={onRun}
          disabled={!canRun || isRunning}
          className="w-full bg-gradient-primary hover:opacity-90"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Algorithm'}
        </Button>

        {!canRun && currentAlgo?.requiresTarget && (
          <p className="text-xs text-muted-foreground text-center">
            Click nodes to select source & target
          </p>
        )}
      </CardContent>
    </Card>
  );
};
