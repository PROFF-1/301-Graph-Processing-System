import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Network,
  Code2,
  Sparkles,
  Github,
  Settings2
} from 'lucide-react';
import AlgorithmExplanations from '@/components/AlgorithmExplanations';
import { EditGraphDialog } from '@/components/EditGraphDialog';
import { GraphIO } from '@/components/GraphIO';
import { AlgorithmSettingsDialog } from '@/components/AlgorithmSettingsDialog';
import { AlgorithmConfig } from '@/types/graph';
import { getNextLabel } from '@/lib/labelUtils';
import { Plus, Server, Layers } from "lucide-react";
import { MetricsPanel } from '@/components/MetricsPanel';
import { partitionGraph } from '@/lib/partitioning';

import { NewGraphDialog } from '@/components/NewGraphDialog';
import { useGraphStorage } from '@/hooks/useGraphStorage';
import { pregelPageRank } from '@/lib/pregel';

const Index = () => {
  // Storage hook
  const { customGraphs, addGraph, updateGraph } = useGraphStorage();

  // Graph state
  const [selectedGraphId, setSelectedGraphId] = useState<string>('sample-0');
  const [graph, setGraph] = useState<Graph>(sampleGraphs[0].graph);

  // Dialogs
  const [isNewGraphOpen, setIsNewGraphOpen] = useState(false);

  // Progress state
  const [completedAlgorithms, setCompletedAlgorithms] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedAlgorithms');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('completedAlgorithms', JSON.stringify(completedAlgorithms));
  }, [completedAlgorithms]);

  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('bidirectional-bfs');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Comparison Mode state
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [selectedAlgorithm2, setSelectedAlgorithm2] = useState<AlgorithmType>('dfs');

  // Distributed Mode state
  const [isDistributedMode, setIsDistributedMode] = useState(false);
  const [numPartitions, setNumPartitions] = useState(4);
  const [partitionStrategy, setPartitionStrategy] = useState<'hash' | 'range'>('hash');

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [edgeSource, setEdgeSource] = useState<string | null>(null);

  // Dialog state
  const [editingItem, setEditingItem] = useState<{ type: 'node' | 'edge', id: string, source?: string, target?: string, value: string | number } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [algoConfig, setAlgoConfig] = useState<AlgorithmConfig>({ speed: 500, maxIterations: 20, dampingFactor: 0.85 });

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
    steps, // <-- Add this line if your hook returns steps
    jumpToStep,
    result
  } = useAlgorithmVisualizer({
    graph,
    source: selectedSource,
    target: selectedTarget,
    algorithm: isDistributedMode && selectedAlgorithm === 'pagerank' ? 'pregel-pagerank' : selectedAlgorithm,
    config: { ...algoConfig, numPartitions },
  });

  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1) {
      if (!completedAlgorithms.includes(selectedAlgorithm)) {
        setCompletedAlgorithms(prev => [...prev, selectedAlgorithm]);
        // toast.success(`Completed ${selectedAlgorithm}!`);
      }
    }
  }, [currentStep, steps.length, selectedAlgorithm, completedAlgorithms]);

  // Second visualizer for comparison
  const viz2 = useAlgorithmVisualizer({
    graph,
    source: selectedSource,
    target: selectedTarget,
    algorithm: selectedAlgorithm2,
  });

  // Handle graph change
  const handleGraphChange = useCallback((id: string, type: 'sample' | 'custom') => {
    setSelectedGraphId(id);
    if (type === 'custom') {
      const g = customGraphs.find(cg => cg.id === id);
      if (g) setGraph(g.graph);
    } else {
      const index = parseInt(id.replace('sample-', ''));
      setGraph(sampleGraphs[index].graph);
    }
    // Re-partition if needed
    if (isDistributedMode) {
      // We need to defer this slightly or wrap it, but for now simple re-set is ok
      // In a real app we'd use useEffect for this sync, but let's just trigger it manually if needed
      // Or rely on the user toggling mode.
      // Actually, let's just let the effect handle it or a separate function.
    }
    setSelectedSource(null);
    setSelectedTarget(null);
  }, [customGraphs, isDistributedMode]);

  // Handle Partitioning
  useEffect(() => {
    if (isDistributedMode) {
      setGraph(prev => partitionGraph(prev, partitionStrategy, numPartitions));
    }
  }, [isDistributedMode, partitionStrategy, numPartitions]);

  // Auto-save effect
  useEffect(() => {
    if (selectedGraphId.startsWith('custom-')) {
      updateGraph(selectedGraphId, graph);
    }
  }, [graph, selectedGraphId]); // Note: updateGraph should likely be stable or ref-based to avoid cycles, but simple dependency is okay if updater is stable.

  // Handle node click for source/target selection or edge creation
  const handleNodeClick = useCallback((nodeId: string) => {
    if (isEditing) {
      if (!edgeSource) {
        setEdgeSource(nodeId);
        toast.info("Select a target node to connect");
      } else {
        if (edgeSource !== nodeId) {
          // Check if edge already exists
          const edgeExists = graph.edges.some(
            e => (e.source === edgeSource && e.target === nodeId) ||
              (!graph.directed && e.source === nodeId && e.target === edgeSource)
          );

          if (!edgeExists) {
            setGraph(prev => ({
              ...prev,
              edges: [...prev.edges, { source: edgeSource, target: nodeId, weight: 1 }]
            }));
            toast.success("Edge created");
          } else {
            toast.error("Edge already exists");
          }
        } else {
          // Clicked same node, maybe cancel?
          toast.info("Edge creation canceled");
        }
        setEdgeSource(null);
      }
      return;
    }

    if (!selectedSource || (selectedSource && selectedTarget)) {
      setSelectedSource(nodeId);
      setSelectedTarget(null);
    } else if (nodeId !== selectedSource) {
      setSelectedTarget(nodeId);
    }
  }, [selectedSource, selectedTarget, isEditing, edgeSource, graph.edges, graph.directed]);



  const handleNodeMove = useCallback((nodeId: string, x: number, y: number) => {
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, x, y } : node
      )
    }));
  }, []);

  const handleBackgroundClick = useCallback((x: number, y: number) => {
    if (isEditing) {
      if (edgeSource) {
        setEdgeSource(null);
        toast.info("Edge creation canceled");
        return;
      }

      const newNodeId = `n${Date.now()}`;
      const nextLabel = getNextLabel(graph.nodes);

      const newNode = {
        id: newNodeId,
        x,
        y,
        label: nextLabel
      };
      setGraph(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
    }
  }, [isEditing, graph.nodes, edgeSource]);

  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingItem({
        type: 'node',
        id: nodeId,
        value: node.label
      });
    }
  }, [graph.nodes]);

  // Create new graph handler
  const handleCreateGraph = (name: string) => {
    const newGraph: Graph = {
      nodes: [],
      edges: [],
      directed: true
    };
    const newId = addGraph(name, newGraph);
    setSelectedGraphId(newId);
    setGraph(newGraph);
    setSelectedSource(null);
    setSelectedTarget(null);
    setIsEditing(true); // Automatically enter edit mode
    toast.success(`Created graph "${name}"`);
  };

  const handleEdgeClick = useCallback((source: string, target: string) => {
    const edge = graph.edges.find(e =>
      (e.source === source && e.target === target) ||
      (!graph.directed && e.source === target && e.target === source)
    );
    if (edge) {
      setEditingItem({
        type: 'edge',
        id: `${source}-${target}`, // dummy id
        source,
        target,
        value: edge.weight || 1
      });
    }
  }, [graph.edges, graph.directed]);

  const handleSaveEdit = (value: string | number) => {
    if (!editingItem) return;

    if (editingItem.type === 'node') {
      setGraph(prev => ({
        ...prev,
        nodes: prev.nodes.map(n =>
          n.id === editingItem.id ? { ...n, label: String(value) } : n
        )
      }));
    } else {
      setGraph(prev => ({
        ...prev,
        edges: prev.edges.map(e => {
          const isMatch = (e.source === editingItem.source && e.target === editingItem.target) ||
            (!graph.directed && e.source === editingItem.target && e.target === editingItem.source);
          return isMatch ? { ...e, weight: Number(value) } : e;
        })
      }));
    }
    setEditingItem(null); // Close dialog after saving
  };

  const handleDeleteEdit = () => {
    if (!editingItem) return;

    if (editingItem.type === 'node') {
      // Remove node and connected edges
      setGraph(prev => ({
        ...prev,
        nodes: prev.nodes.filter(n => n.id !== editingItem.id),
        edges: prev.edges.filter(e => e.source !== editingItem.id && e.target !== editingItem.id)
      }));
      if (selectedSource === editingItem.id) setSelectedSource(null);
      if (selectedTarget === editingItem.id) setSelectedTarget(null);
    } else {
      setGraph(prev => ({
        ...prev,
        edges: prev.edges.filter(e =>
          !((e.source === editingItem.source && e.target === editingItem.target) ||
            (!graph.directed && e.source === editingItem.target && e.target === editingItem.source))
        )
      }));
    }
    setEditingItem(null); // Close dialog after deleting
  };


  // Handle algorithm change
  const handleAlgorithmChange = useCallback((algo: AlgorithmType) => {
    setSelectedAlgorithm(algo);
    if (algo === 'pagerank') {
      setSelectedTarget(null);
    }
  }, []);

  const handleRunAndPlay = () => {
    if (isDistributedMode && selectedAlgorithm === 'pagerank') {
      // Switch to pregel-pagerank internally or just run pregel
      // The visualizer hook should handle 'pregel-pagerank' if we pass it
      // Or we can override the algorithm type passed to hook
      // Let's modify the hook call or standard algo state?
      // Simpler: Just set algorithm to 'pregel-pagerank' when in distributed mode + pagerank
    }
    runAlgorithm();
    if (isComparisonMode) {
      viz2.runAlgorithm();
      setTimeout(() => viz2.play(), 0);
    }
    setTimeout(() => play(), 0);
  };

  // Sync controls for comparison
  const handleComparisonControl = (action: 'play' | 'pause' | 'reset' | 'stepForward' | 'stepBackward') => {
    if (action === 'play') { play(); if (isComparisonMode) viz2.play(); }
    if (action === 'pause') { pause(); if (isComparisonMode) viz2.pause(); }
    if (action === 'reset') { reset(); if (isComparisonMode) viz2.reset(); }
    if (action === 'stepForward') { stepForward(); if (isComparisonMode) viz2.stepForward(); }
    if (action === 'stepBackward') { stepBackward(); if (isComparisonMode) viz2.stepBackward(); }
  };

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
                <GraphIO
                  graph={graph}
                  onImport={(g, name) => {
                    const newId = addGraph(name, g);
                    setSelectedGraphId(newId);
                    setGraph(g);
                    setSelectedSource(null);
                    setSelectedTarget(null);
                  }}
                />
                <GraphSelector
                  selectedGraphId={selectedGraphId}
                  onGraphChange={handleGraphChange}
                  customGraphs={customGraphs}
                />

                <AlgorithmSelector
                  selectedAlgorithm={selectedAlgorithm}
                  onAlgorithmChange={handleAlgorithmChange}
                  onRun={handleRunAndPlay}
                  selectedSource={selectedSource}
                  selectedTarget={selectedTarget}
                  isRunning={isPlaying}
                />

                <ControlPanel
                  isPlaying={isPlaying}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  speed={speed}
                  onPlay={() => handleComparisonControl('play')}
                  onPause={() => handleComparisonControl('pause')}
                  onStepForward={() => handleComparisonControl('stepForward')}
                  onStepBackward={() => handleComparisonControl('stepBackward')}
                  onReset={() => handleComparisonControl('reset')}
                  onSpeedChange={(val) => { setSpeed(val); if (isComparisonMode) viz2.setSpeed(val); }}
                  message={currentStepData.message}
                />
              </div>

              {/* Main Canvas */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground">
                      {selectedGraphId.startsWith('custom-')
                        ? customGraphs.find(g => g.id === selectedGraphId)?.name || 'Custom Graph'
                        : sampleGraphs[parseInt(selectedGraphId.replace('sample-', ''))]?.name}
                      <span className="ml-2 text-xs">
                        ({graph.directed ? 'Directed' : 'Undirected'})
                      </span>
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="edit-mode" checked={isEditing} onCheckedChange={(val) => { setIsEditing(val); if (val) setIsComparisonMode(false); }} />
                        <Label htmlFor="edit-mode">Edit Mode</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="compare-mode" checked={isComparisonMode} onCheckedChange={(val) => { setIsComparisonMode(val); if (val) { setIsEditing(false); setIsDistributedMode(false); } }} />
                        <Label htmlFor="compare-mode">Compare</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dist-mode" checked={isDistributedMode} onCheckedChange={(val) => { setIsDistributedMode(val); if (val) { setIsEditing(false); setIsComparisonMode(false); setSelectedAlgorithm('pagerank'); } }} />
                        <Label htmlFor="dist-mode">Distributed</Label>
                      </div>
                      <Legend
                        showPageRank={selectedAlgorithm === 'pagerank' || selectedAlgorithm === 'pregel-pagerank'}
                        showBidirectional={selectedAlgorithm === 'bidirectional-bfs'}
                      />
                    </div>
                  </div>

                  {isDistributedMode && (
                    <div className="mb-4 p-3 border border-border rounded-lg bg-secondary/20 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Cluster Config:</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Label>Partitions:</Label>
                        <select
                          className="bg-background border border-border rounded p-1"
                          value={numPartitions}
                          onChange={(e) => setNumPartitions(Number(e.target.value))}
                        >
                          <option value="2">2 Workers</option>
                          <option value="4">4 Workers</option>
                          <option value="8">8 Workers</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Label>Strategy:</Label>
                        <select
                          className="bg-background border border-border rounded p-1"
                          value={partitionStrategy}
                          onChange={(e) => setPartitionStrategy(e.target.value as any)}
                        >
                          <option value="hash">Hash Partitioning</option>
                          <option value="range">Range Partitioning</option>
                        </select>
                      </div>
                      <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        Pregel (BSP) Model Active
                      </div>
                    </div>
                  )}

                  {isComparisonMode && (
                    <div className="mb-4 p-2 border border-border rounded-lg bg-secondary/30">
                      <p className="text-xs font-semibold mb-2">Algorithm 2</p>
                      <AlgorithmSelector
                        selectedAlgorithm={selectedAlgorithm2}
                        onAlgorithmChange={setSelectedAlgorithm2}
                        onRun={() => { }} // Run button hidden or disabled for secondary? Or main run runs both.
                        selectedSource={selectedSource}
                        selectedTarget={selectedTarget}
                        isRunning={viz2.isPlaying}
                        hideRunButton
                      />
                    </div>
                  )}

                  <div className={`grid gap-4 ${isComparisonMode ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className="space-y-2">
                      {isComparisonMode && <Badge>Algorithm 1: {selectedAlgorithm}</Badge>}
                      <div className="aspect-[7/3] w-full bg-background rounded-lg border border-border overflow-hidden">
                        <GraphCanvas
                          graph={graph}
                          nodeStates={currentStepData.nodeStates}
                          edgeStates={currentStepData.edgeStates}
                          selectedSource={selectedSource}
                          selectedTarget={selectedTarget}
                          onNodeClick={handleNodeClick}
                          pageRankValues={currentStepData.pageRankValues}
                          distances={currentStepData.distances}
                          isEditing={isEditing}
                          onNodeMove={handleNodeMove}
                          onBackgroundClick={handleBackgroundClick}
                          onNodeDoubleClick={handleNodeDoubleClick}
                          onEdgeClick={handleEdgeClick}
                          showPartitions={isDistributedMode}
                        />
                      </div>
                    </div>

                    {isComparisonMode && (
                      <div className="space-y-2">
                        <Badge variant="secondary">Algorithm 2: {selectedAlgorithm2}</Badge>
                        <div className="aspect-[7/3] w-full bg-background rounded-lg border border-border overflow-hidden">
                          <GraphCanvas
                            graph={graph}
                            nodeStates={viz2.currentStepData.nodeStates}
                            edgeStates={viz2.currentStepData.edgeStates}
                            selectedSource={selectedSource}
                            selectedTarget={selectedTarget}
                            onNodeClick={handleNodeClick}
                            pageRankValues={viz2.currentStepData.pageRankValues}
                            distances={viz2.currentStepData.distances}
                            // Disable editing on second canvas or sync it? 
                            // Better disable interactions on secondary to avoid confusion, or identical
                            isEditing={false}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground p-2 border rounded">
                          {viz2.currentStepData.message}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick tips */}
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                    </span>
                    <div className="flex justify-end mb-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => setIsNewGraphOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Graph
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} title="Algorithm Settings">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>    <span>•</span>
                    <span>Use controls to step through the algorithm</span>
                  </div>

                  {/* Algorithm Log Section - moved here */}
                  {/* Metrics and Logs Grid */}
                  <div className={`grid gap-6 ${isComparisonMode ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>

                    {/* Algorithm 1 Stats */}
                    <div className={`${isComparisonMode ? 'col-span-1' : 'col-span-1'}`}>
                      <div className="space-y-4">
                        <MetricsPanel result={useAlgorithmVisualizer({ graph, source: selectedSource, target: selectedTarget, algorithm: selectedAlgorithm, config: algoConfig }).result} algorithmName={selectedAlgorithm} />

                        <div className="p-4 bg-card border border-border rounded-xl shadow text-base text-foreground max-h-[400px] overflow-y-auto">
                          <h2 className="text-lg font-bold mb-2 sticky top-0 bg-card z-10">Log: {selectedAlgorithm}</h2>
                          <ol className="list-decimal ml-6 mt-3 space-y-1">
                            {(steps ?? []).map((step, i) => (
                              <li
                                key={i}
                                className={`cursor-pointer hover:bg-muted/50 p-1 rounded ${i === currentStep ? 'font-bold text-primary' : ''}`}
                                onClick={() => jumpToStep(i)}
                              >
                                {step.message}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Algorithm 2 Stats (Comparison Mode Only) */}
                    {isComparisonMode && (
                      <div className="col-span-1">
                        <div className="space-y-4">
                          <MetricsPanel result={viz2.result} algorithmName={selectedAlgorithm2} />

                          <div className="p-4 bg-card border border-border rounded-xl shadow text-base text-foreground max-h-[400px] overflow-y-auto">
                            <h2 className="text-lg font-bold mb-2 sticky top-0 bg-card z-10">Log: {selectedAlgorithm2}</h2>
                            <ol className="list-decimal ml-6 mt-3 space-y-1">
                              {(viz2.steps ?? []).map((step, i) => (
                                <li
                                  key={i}
                                  className={`cursor-pointer hover:bg-muted/50 p-1 rounded ${i === viz2.currentStep ? 'font-bold text-primary' : ''}`}
                                  onClick={() => viz2.jumpToStep(i)}
                                >
                                  {step.message}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanations (Full width if not comparison, or bottom) */}
                    {!isComparisonMode && (
                      <div className="col-span-1 md:col-span-2">
                        <AlgorithmExplanations selectedAlgorithm={selectedAlgorithm} />
                      </div>
                    )}
                  </div>

                  {isComparisonMode && (
                    <div className="mt-8">
                      <AlgorithmExplanations selectedAlgorithm={selectedAlgorithm} />
                    </div>
                  )}
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

      {editingItem && (
        <EditGraphDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          type={editingItem.type}
          initialValue={editingItem.value}
          onSave={handleSaveEdit}
          onDelete={handleDeleteEdit}
        />
      )}

      <AlgorithmSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={algoConfig}
        onSave={setAlgoConfig}
      />

      <NewGraphDialog
        isOpen={isNewGraphOpen}
        onClose={() => setIsNewGraphOpen(false)}
        onCreate={handleCreateGraph}
      />

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


