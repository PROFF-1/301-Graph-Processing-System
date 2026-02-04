import { Graph } from "@/types/graph";

export type PartitionStrategy = 'hash' | 'range';

export function partitionGraph(
    graph: Graph,
    strategy: PartitionStrategy,
    numPartitions: number
): Graph {
    if (numPartitions <= 1) {
        return {
            ...graph,
            nodes: graph.nodes.map(n => ({ ...n, partitionId: 0 }))
        };
    }

    const nodes = [...graph.nodes];

    if (strategy === 'hash') {
        // Hash Partitioning: Assign based on hash of ID
        nodes.forEach(node => {
            let hash = 0;
            for (let i = 0; i < node.id.length; i++) {
                hash = ((hash << 5) - hash) + node.id.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            node.partitionId = Math.abs(hash) % numPartitions;
        });
    } else {
        // Range Partitioning: Sort by ID and split evenly
        // (Simple implementation assuming alphanumeric IDs)
        nodes.sort((a, b) => a.id.localeCompare(b.id));
        const chunkSize = Math.ceil(nodes.length / numPartitions);

        nodes.forEach((node, index) => {
            node.partitionId = Math.floor(index / chunkSize);
        });
    }

    return {
        ...graph,
        nodes
    };
}

export const PARTITION_COLORS = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
];
