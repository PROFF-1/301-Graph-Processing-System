// Pre-built sample graphs for demonstration

import { Graph } from '@/types/graph';

export const sampleGraphs: { name: string; graph: Graph }[] = [
  {
    name: 'Simple Path',
    graph: {
      nodes: [
        { id: 'A', x: 100, y: 200, label: 'A' },
        { id: 'B', x: 250, y: 100, label: 'B' },
        { id: 'C', x: 250, y: 300, label: 'C' },
        { id: 'D', x: 400, y: 200, label: 'D' },
        { id: 'E', x: 550, y: 200, label: 'E' },
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'D' },
        { source: 'C', target: 'D' },
        { source: 'D', target: 'E' },
      ],
      directed: false,
    },
  },
  {
    name: 'Grid Graph',
    graph: {
      nodes: [
        { id: '1', x: 100, y: 100, label: '1' },
        { id: '2', x: 250, y: 100, label: '2' },
        { id: '3', x: 400, y: 100, label: '3' },
        { id: '4', x: 100, y: 250, label: '4' },
        { id: '5', x: 250, y: 250, label: '5' },
        { id: '6', x: 400, y: 250, label: '6' },
        { id: '7', x: 100, y: 400, label: '7' },
        { id: '8', x: 250, y: 400, label: '8' },
        { id: '9', x: 400, y: 400, label: '9' },
      ],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '4', target: '5' },
        { source: '5', target: '6' },
        { source: '7', target: '8' },
        { source: '8', target: '9' },
        { source: '1', target: '4' },
        { source: '4', target: '7' },
        { source: '2', target: '5' },
        { source: '5', target: '8' },
        { source: '3', target: '6' },
        { source: '6', target: '9' },
      ],
      directed: false,
    },
  },
  {
    name: 'Weighted Graph',
    graph: {
      nodes: [
        { id: 'S', x: 100, y: 200, label: 'S' },
        { id: 'A', x: 250, y: 100, label: 'A' },
        { id: 'B', x: 250, y: 300, label: 'B' },
        { id: 'C', x: 400, y: 100, label: 'C' },
        { id: 'D', x: 400, y: 300, label: 'D' },
        { id: 'T', x: 550, y: 200, label: 'T' },
      ],
      edges: [
        { source: 'S', target: 'A', weight: 4 },
        { source: 'S', target: 'B', weight: 2 },
        { source: 'A', target: 'C', weight: 5 },
        { source: 'A', target: 'B', weight: 1 },
        { source: 'B', target: 'D', weight: 8 },
        { source: 'C', target: 'T', weight: 3 },
        { source: 'D', target: 'T', weight: 2 },
        { source: 'C', target: 'D', weight: 1 },
      ],
      directed: false,
    },
  },
  {
    name: 'Directed Graph (PageRank)',
    graph: {
      nodes: [
        { id: 'Home', x: 300, y: 100, label: 'Home' },
        { id: 'About', x: 150, y: 250, label: 'About' },
        { id: 'Products', x: 450, y: 250, label: 'Products' },
        { id: 'Blog', x: 200, y: 400, label: 'Blog' },
        { id: 'Contact', x: 400, y: 400, label: 'Contact' },
      ],
      edges: [
        { source: 'Home', target: 'About' },
        { source: 'Home', target: 'Products' },
        { source: 'Home', target: 'Blog' },
        { source: 'About', target: 'Home' },
        { source: 'About', target: 'Contact' },
        { source: 'Products', target: 'Home' },
        { source: 'Products', target: 'Contact' },
        { source: 'Blog', target: 'Home' },
        { source: 'Blog', target: 'Products' },
        { source: 'Contact', target: 'Home' },
      ],
      directed: true,
    },
  },
  {
    name: 'Disconnected Graph',
    graph: {
      nodes: [
        { id: 'A', x: 100, y: 150, label: 'A' },
        { id: 'B', x: 200, y: 100, label: 'B' },
        { id: 'C', x: 200, y: 200, label: 'C' },
        { id: 'X', x: 400, y: 150, label: 'X' },
        { id: 'Y', x: 500, y: 100, label: 'Y' },
        { id: 'Z', x: 500, y: 200, label: 'Z' },
      ],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'A', target: 'C' },
        { source: 'B', target: 'C' },
        { source: 'X', target: 'Y' },
        { source: 'X', target: 'Z' },
        { source: 'Y', target: 'Z' },
      ],
      directed: false,
    },
  },
];
