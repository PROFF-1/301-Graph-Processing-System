import React from 'react';
import { AlgorithmType } from '@/types/graph';

const algoDetails: Record<AlgorithmType, { title: string; description: string; steps: string[] }> = {
  'bidirectional-bfs': {
    title: 'Bidirectional BFS',
    description:
      'Bidirectional Breadth-First Search (BFS) finds the shortest path between two nodes by simultaneously searching from the source and the target. Each search explores one level at a time, and when the two searches meet, the shortest path is found. This approach is often much faster than standard BFS for large graphs.',
    steps: [
      'Start BFS from both the source and the target nodes.',
      'Alternate expanding one level from each side.',
      'If a node is visited by both searches, the searches have met.',
      'Reconstruct the path by combining the paths from source to meeting node and meeting node to target.',
    ],
  },
  dijkstra: {
    title: "Dijkstra's Algorithm",
    description:
      "Dijkstra's algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It uses a priority queue to always expand the node with the smallest known distance.",
    steps: [
      'Initialize all node distances as infinity, except the source (distance 0).',
      'Use a priority queue to select the node with the smallest distance.',
      'For each neighbor, update its distance if a shorter path is found.',
      'Repeat until all nodes are visited or the target is reached.',
    ],
  },
  dfs: {
    title: 'Depth-First Search (DFS)',
    description:
      'DFS explores as far as possible along each branch before backtracking. It is useful for traversing or searching tree and graph structures.',
    steps: [
      'Start at the source node and mark it as visited.',
      'Recursively visit each unvisited neighbor, going as deep as possible.',
      'Backtrack when no unvisited neighbors remain.',
    ],
  },
  pagerank: {
    title: 'PageRank',
    description:
      'PageRank measures the importance of each node in a directed graph, originally used by Google Search. It simulates a random surfer who randomly follows links, with occasional random jumps.',
    steps: [
      'Initialize all nodes with equal rank.',
      'Iteratively update each node\'s rank based on the ranks of incoming neighbors.',
      'Apply a damping factor to model random jumps.',
      'Repeat until ranks converge.',
    ],
  },
  "shortest-path": {
    title: 'Shortest Path',
    description:
      'The Shortest Path algorithm finds the minimum path between two nodes in a graph, which can be implemented using algorithms like BFS for unweighted graphs or Dijkstra for weighted graphs.',
    steps: [
      'Select the source and target nodes.',
      'Initialize the data structures needed for the chosen algorithm.',
      'Explore the graph to find the minimum path from source to target.',
      'Reconstruct and return the shortest path found.',
    ],
  },
};

interface AlgorithmExplanationsProps {
  selectedAlgorithm: AlgorithmType;
}

const AlgorithmExplanations: React.FC<AlgorithmExplanationsProps> = ({ selectedAlgorithm }) => {
  const algo = algoDetails[selectedAlgorithm];
  return (
    <section className="max-w-4xl mx-auto mt-12 mb-8 p-6 bg-card border border-border rounded-xl shadow-lg space-y-6 text-base text-foreground">
      <h2 className="text-xl font-bold mb-2">How {algo.title} Works</h2>
      <div>
        <p>{algo.description}</p>
        <ol className="list-decimal ml-6 mt-3 space-y-1">
          {algo.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default AlgorithmExplanations;
