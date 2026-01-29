import React, { useState, useCallback } from 'react';
import { Graph, AlgorithmType } from '@/types/graph';
import { sampleGraphs } from '@/lib/sampleGraphs';
import { useAlgorithmVisualizer } from '@/hooks/useAlgorithmVisualizer';
import { GraphCanvas } from '@/components/GraphCanvas';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { ControlPanel } from '@/components/ControlPanel';
import { GraphSelector } from '@/components/GraphSelector';
import { JavaCodePanel } from '@/components/JavaCodePanel';
import { Legend } from '@/components/Legend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Code2, 
  Sparkles,
  Github
} from 'lucide-react';

const Index = () => {
  // Graph state
  const [selectedGraphIndex, setSelectedGraphIndex] = useState(0);
  const [graph, setGraph] = useState<Graph>(sampleGraphs[0].graph);
  
  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bidirectional-bfs');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Visualizer hook
  const {
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    currentStepData,
    runAlgorithm,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
  } = useAlgorithmVisualizer({
    graph,
    source: selectedSource,
    target: selectedTarget,
    algorithm: selectedAlgorithm,
  });

  // Handle graph change
  const handleGraphChange = useCallback((index: number) => {
    setSelectedGraphIndex(index);
    setGraph(sampleGraphs[index].graph);
    setSelectedSource(null);
    setSelectedTarget(null);
  }, []);

  // Handle node click for source/target selection
  const handleNodeClick = useCallback((nodeId: string) => {
    if (!selectedSource || (selectedSource && selectedTarget)) {
      setSelectedSource(nodeId);
      setSelectedTarget(null);
    } else if (nodeId !== selectedSource) {
      setSelectedTarget(nodeId);
    }
  }, [selectedSource, selectedTarget]);

  // Handle algorithm change
  const handleAlgorithmChange = useCallback((algo: AlgorithmType) => {
    setSelectedAlgorithm(algo);
    if (algo === 'pagerank') {
      setSelectedTarget(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Network className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Graph Algorithm Visualizer
                </h1>
                <p className="text-sm text-muted-foreground">
                  Interactive learning for Bidirectional BFS, Dijkstra, DFS & PageRank
                </p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Interactive Demo + Java Code
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="visualizer" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="visualizer" className="gap-2">
              <Network className="w-4 h-4" />
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code2 className="w-4 h-4" />
              Java Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Controls */}
              <div className="lg:col-span-1 space-y-4">
                <GraphSelector
                  selectedGraphIndex={selectedGraphIndex}
                  onGraphChange={handleGraphChange}
                />
                
                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={handleAlgorithmChange}
                  onRun={runAlgorithm}
                  selectedSource={selectedSource}
                  selectedTarget={selectedTarget}
                  isRunning={isPlaying}
                />
                
                <ControlPanel
                  isPlaying={isPlaying}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  speed={speed}
                  onPlay={play}
                  onPause={pause}
                  onStepForward={stepForward}
                  onStepBackward={stepBackward}
                  onReset={reset}
                  onSpeedChange={setSpeed}
                  message={currentStepData.message}
                />
              </div>

              {/* Main Canvas */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      {sampleGraphs[selectedGraphIndex].name}
                      <span className="ml-2 text-xs">
                        ({graph.directed ? 'Directed' : 'Undirected'})
                      </span>
                    </h2>
                    <Legend 
                      showPageRank={selectedAlgorithm === 'pagerank'}
                      showBidirectional={selectedAlgorithm === 'bidirectional-bfs'}
                    />
                  </div>
                  
                  <div className="aspect-[4/3] w-full bg-background rounded-lg border border-border overflow-hidden">
                    <GraphCanvas
                      graph={graph}
                      nodeStates={currentStepData.nodeStates}
                      edgeStates={currentStepData.edgeStates}
                      selectedSource={selectedSource}
                      selectedTarget={selectedTarget}
                      onNodeClick={handleNodeClick}
                      pageRankValues={currentStepData.pageRankValues}
                      distances={currentStepData.distances}
                    />
                  </div>

                  {/* Quick tips */}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-node-source" />
                      Click a node to set as source
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-node-target" />
                      Click another to set as target
                    </span>
                    <span>•</span>
                    <span>Use controls to step through the algorithm</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code">
            <div className="max-w-5xl mx-auto">
              <JavaCodePanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Built for learning graph algorithms • All code thoroughly commented
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                React + TypeScript
              </Badge>
              <Badge variant="outline" className="text-xs">
                Java 8+
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
