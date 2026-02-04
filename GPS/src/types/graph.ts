// Graph data structures and types for algorithm visualization

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

export type NodeState = 
  | 'default'
  | 'source'
  | 'target'
  | 'visiting'
  | 'visited'
  | 'path'
  | 'forward-frontier'  // Bidirectional: expanding from source
  | 'backward-frontier'; // Bidirectional: expanding from target

export type EdgeState = 
  | 'default'
  | 'exploring'
  | 'path'
  | 'visited';

export interface AlgorithmStep {
  nodeStates: Map<string, NodeState>;
  edgeStates: Map<string, EdgeState>;
  currentNodes?: string[];
  message: string;
  forwardFrontier?: string[];
  backwardFrontier?: string[];
  pageRankValues?: Map<string, number>;
  distances?: Map<string, number>;
}

export interface AlgorithmResult {
  steps: AlgorithmStep[];
  path: string[];
  found: boolean;
  error?: string;
}

export type AlgorithmType = 
  | 'bidirectional-bfs'
  | 'dijkstra'
  | 'dfs'
  | 'shortest-path'
  | 'pagerank';

export interface AlgorithmConfig {
  speed: number;
  dampingFactor?: number;
  maxIterations?: number;
}

