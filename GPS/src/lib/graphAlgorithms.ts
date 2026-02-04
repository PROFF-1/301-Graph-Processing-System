// Graph Algorithm Implementations
// These algorithms power the visualization and mirror the Java implementation

import {
  Graph,
  GraphEdge,
  AlgorithmStep,
  AlgorithmResult,
  NodeState,
  EdgeState
} from '@/types/graph';

// Helper to create adjacency list from graph
function buildAdjacencyList(graph: Graph): Map<string, string[]> {
  const adjList = new Map<string, string[]>();

  // Initialize all nodes
  for (const node of graph.nodes) {
    adjList.set(node.id, []);
  }

  // Add edges
  for (const edge of graph.edges) {
    adjList.get(edge.source)?.push(edge.target);
    if (!graph.directed) {
      adjList.get(edge.target)?.push(edge.source);
    }
  }

  return adjList;
}

// Helper to get edge key
function getEdgeKey(source: string, target: string): string {
  return `${source}-${target}`;
}

// Helper to get node label
function getLabel(graph: Graph, nodeId: string): string {
  const node = graph.nodes.find(n => n.id === nodeId);
  return node ? node.label : nodeId;
}

// Helper to create a step snapshot
function createStep(
  nodeStates: Map<string, NodeState>,
  edgeStates: Map<string, EdgeState>,
  message: string,
  extras?: Partial<AlgorithmStep>
): AlgorithmStep {
  return {
    nodeStates: new Map(nodeStates),
    edgeStates: new Map(edgeStates),
    message,
    ...extras
  };
}

/**
 * BIDIRECTIONAL BFS
 * Searches from both source and target simultaneously
 * Meeting in the middle for optimal performance
 */
export function bidirectionalBFS(
  graph: Graph,
  sourceId: string,
  targetId: string
): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  // Initialize states
  graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
  graph.edges.forEach(e => {
    edgeStates.set(getEdgeKey(e.source, e.target), 'default');
    if (!graph.directed) {
      edgeStates.set(getEdgeKey(e.target, e.source), 'default');
    }
  });

  // Validation
  if (!graph.nodes.find(n => n.id === sourceId)) {
    return { steps: [], path: [], found: false, error: `Source node '${sourceId}' not found` };
  }
  if (!graph.nodes.find(n => n.id === targetId)) {
    return { steps: [], path: [], found: false, error: `Target node '${targetId}' not found` };
  }
  if (sourceId === targetId) {
    nodeStates.set(sourceId, 'path');
    steps.push(createStep(nodeStates, edgeStates, 'Source equals target - trivial path'));
    return { steps, path: [sourceId], found: true };
  }

  const adjList = buildAdjacencyList(graph);

  // Forward search (from source)
  const forwardQueue: string[] = [sourceId];
  const forwardVisited = new Map<string, string | null>([[sourceId, null]]);

  // Backward search (from target)
  const backwardQueue: string[] = [targetId];
  const backwardVisited = new Map<string, string | null>([[targetId, null]]);

  nodeStates.set(sourceId, 'source');
  nodeStates.set(targetId, 'target');

  steps.push(createStep(
    nodeStates,
    edgeStates,
    `Starting bidirectional BFS from '${getLabel(graph, sourceId)}' (cyan) and '${getLabel(graph, targetId)}' (pink)`,
    { forwardFrontier: [sourceId], backwardFrontier: [targetId] }
  ));

  let meetingNode: string | null = null;

  while (forwardQueue.length > 0 && backwardQueue.length > 0 && !meetingNode) {
    // Expand forward frontier
    const forwardSize = forwardQueue.length;
    for (let i = 0; i < forwardSize && !meetingNode; i++) {
      const current = forwardQueue.shift()!;

      if (nodeStates.get(current) !== 'source') {
        nodeStates.set(current, 'forward-frontier');
      }

      for (const neighbor of adjList.get(current) || []) {
        const edgeKey = getEdgeKey(current, neighbor);

        if (!forwardVisited.has(neighbor)) {
          forwardVisited.set(neighbor, current);
          forwardQueue.push(neighbor);
          edgeStates.set(edgeKey, 'exploring');

          // Check if we met the backward search
          if (backwardVisited.has(neighbor)) {
            meetingNode = neighbor;
            steps.push(createStep(
              nodeStates,
              edgeStates,
              `🎯 Searches meet at node '${neighbor}'!`,
              { forwardFrontier: [...forwardQueue], backwardFrontier: [...backwardQueue] }
            ));
            break;
          }
        }
      }
    }

    if (meetingNode) break;

    steps.push(createStep(
      nodeStates,
      edgeStates,
      `Forward frontier expanded. Queue: [${forwardQueue.map(id => getLabel(graph, id)).join(', ')}]`,
      { forwardFrontier: [...forwardQueue], backwardFrontier: [...backwardQueue] }
    ));

    // Expand backward frontier
    const backwardSize = backwardQueue.length;
    for (let i = 0; i < backwardSize && !meetingNode; i++) {
      const current = backwardQueue.shift()!;

      if (nodeStates.get(current) !== 'target') {
        nodeStates.set(current, 'backward-frontier');
      }

      for (const neighbor of adjList.get(current) || []) {
        const edgeKey = getEdgeKey(current, neighbor);

        if (!backwardVisited.has(neighbor)) {
          backwardVisited.set(neighbor, current);
          backwardQueue.push(neighbor);
          edgeStates.set(edgeKey, 'exploring');

          // Check if we met the forward search
          if (forwardVisited.has(neighbor)) {
            meetingNode = neighbor;
            steps.push(createStep(
              nodeStates,
              edgeStates,
              `🎯 Searches meet at node '${neighbor}'!`,
              { forwardFrontier: [...forwardQueue], backwardFrontier: [...backwardQueue] }
            ));
            break;
          }
        }
      }
    }

    if (meetingNode) break;

    steps.push(createStep(
      nodeStates,
      edgeStates,
      `Backward frontier expanded. Queue: [${backwardQueue.map(id => getLabel(graph, id)).join(', ')}]`,
      { forwardFrontier: [...forwardQueue], backwardFrontier: [...backwardQueue] }
    ));
  }

  if (!meetingNode) {
    steps.push(createStep(nodeStates, edgeStates, '❌ No path exists between nodes'));
    return { steps, path: [], found: false };
  }

  // Reconstruct path
  const path: string[] = [];

  // Forward path (source to meeting)
  let node: string | null = meetingNode;
  const forwardPath: string[] = [];
  while (node !== null) {
    forwardPath.unshift(node);
    node = forwardVisited.get(node) || null;
  }

  // Backward path (meeting to target)
  node = backwardVisited.get(meetingNode) || null;
  const backwardPath: string[] = [];
  while (node !== null) {
    backwardPath.push(node);
    node = backwardVisited.get(node) || null;
  }

  path.push(...forwardPath, ...backwardPath);

  // Mark final path
  for (const nodeId of path) {
    nodeStates.set(nodeId, 'path');
  }
  for (let i = 0; i < path.length - 1; i++) {
    edgeStates.set(getEdgeKey(path[i], path[i + 1]), 'path');
    if (!graph.directed) {
      edgeStates.set(getEdgeKey(path[i + 1], path[i]), 'path');
    }
  }

  steps.push(createStep(
    nodeStates,
    edgeStates,
    `✅ Path found! Length: ${path.length - 1} edges. Path: ${path.map(id => getLabel(graph, id)).join(' → ')}`
  ));

  return { steps, path, found: true };
}

/**
 * DIJKSTRA'S ALGORITHM
 * Finds shortest path in weighted graphs
 */
export function dijkstra(
  graph: Graph,
  sourceId: string,
  targetId: string
): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  // Initialize
  graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
  graph.edges.forEach(e => {
    edgeStates.set(getEdgeKey(e.source, e.target), 'default');
    if (!graph.directed) {
      edgeStates.set(getEdgeKey(e.target, e.source), 'default');
    }
  });

  // Validation
  if (!graph.nodes.find(n => n.id === sourceId)) {
    return { steps: [], path: [], found: false, error: `Source node '${sourceId}' not found` };
  }
  if (!graph.nodes.find(n => n.id === targetId)) {
    return { steps: [], path: [], found: false, error: `Target node '${targetId}' not found` };
  }

  // Build weighted adjacency list
  const adjList = new Map<string, { neighbor: string; weight: number }[]>();
  graph.nodes.forEach(n => adjList.set(n.id, []));
  graph.edges.forEach(e => {
    const weight = e.weight ?? 1;
    adjList.get(e.source)?.push({ neighbor: e.target, weight });
    if (!graph.directed) {
      adjList.get(e.target)?.push({ neighbor: e.source, weight });
    }
  });

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  graph.nodes.forEach(n => {
    distances.set(n.id, n.id === sourceId ? 0 : Infinity);
    previous.set(n.id, null);
    unvisited.add(n.id);
  });

  nodeStates.set(sourceId, 'source');
  nodeStates.set(targetId, 'target');

  steps.push(createStep(
    nodeStates,
    edgeStates,
    `Starting Dijkstra from '${getLabel(graph, sourceId)}'. All distances initialized to ∞ except source (0)`,
    { distances: new Map(distances) }
  ));

  while (unvisited.size > 0) {
    // Find minimum distance node
    let minDist = Infinity;
    let current: string | null = null;
    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId)!;
      if (dist < minDist) {
        minDist = dist;
        current = nodeId;
      }
    }

    if (current === null || minDist === Infinity) {
      steps.push(createStep(nodeStates, edgeStates, '❌ No path exists - remaining nodes unreachable'));
      return { steps, path: [], found: false };
    }

    if (current === targetId) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | null = targetId;
      while (node !== null) {
        path.unshift(node);
        nodeStates.set(node, 'path');
        node = previous.get(node) || null;
      }

      for (let i = 0; i < path.length - 1; i++) {
        edgeStates.set(getEdgeKey(path[i], path[i + 1]), 'path');
        if (!graph.directed) {
          edgeStates.set(getEdgeKey(path[i + 1], path[i]), 'path');
        }
      }

      steps.push(createStep(
        nodeStates,
        edgeStates,
        `✅ Shortest path found! Total distance: ${distances.get(targetId)}. Path: ${path.map(id => getLabel(graph, id)).join(' → ')}`,
        { distances: new Map(distances) }
      ));

      return { steps, path, found: true };
    }

    unvisited.delete(current);

    if (current !== sourceId) {
      nodeStates.set(current, 'visiting');
    }

    steps.push(createStep(
      nodeStates,
      edgeStates,
      `Visiting '${getLabel(graph, current)}' (distance: ${distances.get(current)})`,
      { distances: new Map(distances), currentNodes: [current] }
    ));

    // Relax edges
    for (const { neighbor, weight } of adjList.get(current) || []) {
      if (!unvisited.has(neighbor)) continue;

      const edgeKey = getEdgeKey(current, neighbor);
      edgeStates.set(edgeKey, 'exploring');

      const newDist = distances.get(current)! + weight;
      if (newDist < distances.get(neighbor)!) {
        distances.set(neighbor, newDist);
        previous.set(neighbor, current);

        steps.push(createStep(
          nodeStates,
          edgeStates,
          `Updated distance to '${getLabel(graph, neighbor)}': ${newDist} (via '${getLabel(graph, current)}')`,
          { distances: new Map(distances) }
        ));
      }
    }

    if (current !== sourceId && current !== targetId) {
      nodeStates.set(current, 'visited');
    }
  }

  steps.push(createStep(nodeStates, edgeStates, '❌ Target not reachable'));
  return { steps, path: [], found: false };
}

/**
 * DEPTH-FIRST SEARCH (DFS)
 * Explores as deep as possible before backtracking
 */
export function dfs(
  graph: Graph,
  sourceId: string,
  targetId: string
): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
  graph.edges.forEach(e => {
    edgeStates.set(getEdgeKey(e.source, e.target), 'default');
    if (!graph.directed) {
      edgeStates.set(getEdgeKey(e.target, e.source), 'default');
    }
  });

  if (!graph.nodes.find(n => n.id === sourceId)) {
    return { steps: [], path: [], found: false, error: `Source node '${sourceId}' not found` };
  }
  if (!graph.nodes.find(n => n.id === targetId)) {
    return { steps: [], path: [], found: false, error: `Target node '${targetId}' not found` };
  }

  const adjList = buildAdjacencyList(graph);
  const visited = new Set<string>();
  const path: string[] = [];
  let found = false;

  nodeStates.set(sourceId, 'source');
  nodeStates.set(targetId, 'target');

  steps.push(createStep(nodeStates, edgeStates, `Starting DFS from '${getLabel(graph, sourceId)}'`));

  function dfsRecursive(current: string): boolean {
    if (found) return true;

    visited.add(current);
    path.push(current);

    if (current !== sourceId && current !== targetId) {
      nodeStates.set(current, 'visiting');
    }

    steps.push(createStep(
      nodeStates,
      edgeStates,
      `Visiting '${getLabel(graph, current)}'. Stack: [${path.map(id => getLabel(graph, id)).join(', ')}]`,
      { currentNodes: [current] }
    ));

    if (current === targetId) {
      found = true;
      return true;
    }

    for (const neighbor of adjList.get(current) || []) {
      if (!visited.has(neighbor)) {
        const edgeKey = getEdgeKey(current, neighbor);
        edgeStates.set(edgeKey, 'exploring');

        if (dfsRecursive(neighbor)) {
          edgeStates.set(edgeKey, 'path');
          if (!graph.directed) {
            edgeStates.set(getEdgeKey(neighbor, current), 'path');
          }
          return true;
        }
      }
    }

    // Backtrack
    if (!found) {
      path.pop();
      if (current !== sourceId && current !== targetId) {
        nodeStates.set(current, 'visited');
      }
      steps.push(createStep(nodeStates, edgeStates, `Backtracking from '${getLabel(graph, current)}'`));
    }

    return false;
  }

  dfsRecursive(sourceId);

  if (found) {
    for (const nodeId of path) {
      nodeStates.set(nodeId, 'path');
    }
    steps.push(createStep(
      nodeStates,
      edgeStates,
      `✅ Path found! Length: ${path.length - 1} edges. Path: ${path.map(id => getLabel(graph, id)).join(' → ')}`
    ));
    return { steps, path, found: true };
  }

  steps.push(createStep(nodeStates, edgeStates, '❌ No path exists'));
  return { steps, path: [], found: false };
}

/**
 * BFS SHORTEST PATH
 * Standard BFS for unweighted shortest path
 */
export function shortestPath(
  graph: Graph,
  sourceId: string,
  targetId: string
): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
  graph.edges.forEach(e => {
    edgeStates.set(getEdgeKey(e.source, e.target), 'default');
    if (!graph.directed) {
      edgeStates.set(getEdgeKey(e.target, e.source), 'default');
    }
  });

  if (!graph.nodes.find(n => n.id === sourceId)) {
    return { steps: [], path: [], found: false, error: `Source node '${sourceId}' not found` };
  }
  if (!graph.nodes.find(n => n.id === targetId)) {
    return { steps: [], path: [], found: false, error: `Target node '${targetId}' not found` };
  }
  if (sourceId === targetId) {
    nodeStates.set(sourceId, 'path');
    steps.push(createStep(nodeStates, edgeStates, 'Source equals target'));
    return { steps, path: [sourceId], found: true };
  }

  const adjList = buildAdjacencyList(graph);
  const queue: string[] = [sourceId];
  const visited = new Map<string, string | null>([[sourceId, null]]);

  nodeStates.set(sourceId, 'source');
  nodeStates.set(targetId, 'target');

  steps.push(createStep(nodeStates, edgeStates, `Starting BFS from '${getLabel(graph, sourceId)}'`));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current !== sourceId && current !== targetId) {
      nodeStates.set(current, 'visiting');
    }

    steps.push(createStep(
      nodeStates,
      edgeStates,
      `Visiting '${getLabel(graph, current)}'. Queue: [${queue.map(id => getLabel(graph, id)).join(', ')}]`,
      { currentNodes: [current] }
    ));

    for (const neighbor of adjList.get(current) || []) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, current);
        queue.push(neighbor);

        const edgeKey = getEdgeKey(current, neighbor);
        edgeStates.set(edgeKey, 'exploring');

        if (neighbor === targetId) {
          // Reconstruct path
          const path: string[] = [];
          let node: string | null = targetId;
          while (node !== null) {
            path.unshift(node);
            node = visited.get(node) || null;
          }

          for (const nodeId of path) {
            nodeStates.set(nodeId, 'path');
          }
          for (let i = 0; i < path.length - 1; i++) {
            edgeStates.set(getEdgeKey(path[i], path[i + 1]), 'path');
            if (!graph.directed) {
              edgeStates.set(getEdgeKey(path[i + 1], path[i]), 'path');
            }
          }

          steps.push(createStep(
            nodeStates,
            edgeStates,
            `✅ Shortest path found! Length: ${path.length - 1} edges. Path: ${path.map(id => getLabel(graph, id)).join(' → ')}`
          ));

          return { steps, path, found: true };
        }
      }
    }

    if (current !== sourceId && current !== targetId) {
      nodeStates.set(current, 'visited');
    }
  }

  steps.push(createStep(nodeStates, edgeStates, '❌ No path exists'));
  return { steps, path: [], found: false };
}

/**
 * PAGERANK ALGORITHM
 * Computes importance scores for nodes
 */
export function pageRank(
  graph: Graph,
  iterations: number = 20,
  dampingFactor: number = 0.85
): AlgorithmResult {
  const steps: AlgorithmStep[] = [];
  const nodeStates = new Map<string, NodeState>();
  const edgeStates = new Map<string, EdgeState>();

  graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
  graph.edges.forEach(e => {
    edgeStates.set(getEdgeKey(e.source, e.target), 'default');
  });

  const n = graph.nodes.length;
  if (n === 0) {
    return { steps: [], path: [], found: false, error: 'Empty graph' };
  }

  // Build outgoing adjacency list
  const outLinks = new Map<string, string[]>();
  graph.nodes.forEach(node => outLinks.set(node.id, []));
  graph.edges.forEach(e => {
    outLinks.get(e.source)?.push(e.target);
  });

  // Initialize PageRank values
  const pageRankValues = new Map<string, number>();
  graph.nodes.forEach(node => pageRankValues.set(node.id, 1 / n));

  steps.push(createStep(
    nodeStates,
    edgeStates,
    `Initializing PageRank. Each node starts with value ${(1 / n).toFixed(4)}`,
    { pageRankValues: new Map(pageRankValues) }
  ));

  for (let iter = 0; iter < iterations; iter++) {
    const newRanks = new Map<string, number>();

    // Calculate new ranks
    for (const node of graph.nodes) {
      let rankSum = 0;

      // Sum contributions from incoming links
      for (const edge of graph.edges) {
        if (edge.target === node.id) {
          const sourceOutDegree = outLinks.get(edge.source)?.length || 1;
          rankSum += (pageRankValues.get(edge.source) || 0) / sourceOutDegree;
        }
      }

      newRanks.set(
        node.id,
        (1 - dampingFactor) / n + dampingFactor * rankSum
      );
    }

    // Update values
    for (const [nodeId, rank] of newRanks) {
      pageRankValues.set(nodeId, rank);
    }

    // Color nodes based on rank (higher = more green/path color)
    const maxRank = Math.max(...Array.from(pageRankValues.values()));
    for (const [nodeId, rank] of pageRankValues) {
      if (rank >= maxRank * 0.8) {
        nodeStates.set(nodeId, 'path');
      } else if (rank >= maxRank * 0.5) {
        nodeStates.set(nodeId, 'visiting');
      } else {
        nodeStates.set(nodeId, 'visited');
      }
    }

    if (iter % 5 === 0 || iter === iterations - 1) {
      const topNodes = Array.from(pageRankValues.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, rank]) => `${getLabel(graph, id)}: ${rank.toFixed(4)}`)
        .join(', ');

      steps.push(createStep(
        nodeStates,
        edgeStates,
        `Iteration ${iter + 1}/${iterations}. Top nodes: ${topNodes}`,
        { pageRankValues: new Map(pageRankValues) }
      ));
    }
  }

  const sortedRanks = Array.from(pageRankValues.entries())
    .sort((a, b) => b[1] - a[1]);

  steps.push(createStep(
    nodeStates,
    edgeStates,
    `✅ PageRank complete! Highest: '${getLabel(graph, sortedRanks[0][0])}' (${sortedRanks[0][1].toFixed(4)})`,
    { pageRankValues: new Map(pageRankValues) }
  ));

  return {
    steps,
    path: sortedRanks.map(([id]) => id),
    found: true
  };
}
