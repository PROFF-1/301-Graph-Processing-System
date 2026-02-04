import { Graph, AlgorithmResult, AlgorithmStep, NodeState, EdgeState } from "@/types/graph";

// Simulated "Message" in Pregel
interface Message {
    targetId: string;
    value: number;
}

// Vertex state for PageRank
interface VertexState {
    id: string;
    value: number;
    active: boolean;
    partitionId: number;
}

export function pregelPageRank(
    graph: Graph,
    numPartitions: number,
    iterations: number = 15,
    dampingFactor: number = 0.85
): AlgorithmResult {
    const steps: AlgorithmStep[] = [];
    const nodeStates = new Map<string, NodeState>();
    const edgeStates = new Map<string, EdgeState>(); // Not strictly used in Pregel visual but good for consistency

    // Initialize visualization states
    graph.nodes.forEach(n => nodeStates.set(n.id, 'default'));
    graph.edges.forEach(e => edgeStates.set(`${e.source}-${e.target}`, 'default'));

    // 1. Initialize Vertices
    // In Pregel PageRank, initial value is often 1/N
    const n = graph.nodes.length;
    let vertices: VertexState[] = graph.nodes.map(node => ({
        id: node.id,
        value: 1 / n,
        active: true,
        partitionId: node.partitionId || 0
    }));

    // Helper to get out-neighbors
    const outLinks = new Map<string, string[]>();
    graph.nodes.forEach(node => outLinks.set(node.id, []));
    graph.edges.forEach(e => outLinks.get(e.source)?.push(e.target));

    // Current messages (Inbox for next superstep)
    let currentMessages: Message[] = [];

    // Record initial state
    steps.push({
        nodeStates: new Map(nodeStates),
        edgeStates: new Map(edgeStates),
        message: `[Superstep 0] Initializing Pregel. ${n} vertices distributed across ${numPartitions} partitions.`,
        pageRankValues: new Map(vertices.map(v => [v.id, v.value])),
        partitionStats: getPartitionStats(vertices, [])
    });

    // 2. Superstep Loop
    for (let step = 1; step <= iterations; step++) {
        const nextMessages: Message[] = [];
        const activeVerticesCount = vertices.filter(v => v.active).length;

        if (activeVerticesCount === 0 && currentMessages.length === 0) {
            break; // Halt if no active vertices and no messages
        }

        // --- COMPUTE PHASE (Simulated Parallelism) ---
        // In a real system, this runs on workers. Here we iterate all.

        // Group messages by target
        const inbox = new Map<string, number[]>();
        currentMessages.forEach(msg => {
            if (!inbox.has(msg.targetId)) inbox.set(msg.targetId, []);
            inbox.get(msg.targetId)?.push(msg.value);
        });

        let maxChange = 0;

        vertices.forEach(vertex => {
            // "Compute" function for PageRank
            const messages = inbox.get(vertex.id) || [];
            const sum = messages.reduce((a, b) => a + b, 0);

            const newValue = (1 - dampingFactor) / n + dampingFactor * sum;
            const change = Math.abs(newValue - vertex.value);
            if (change > maxChange) maxChange = change;

            vertex.value = newValue;

            // Send messages along outgoing edges
            const neighbors = outLinks.get(vertex.id) || [];
            if (neighbors.length > 0) {
                const msgValue = vertex.value / neighbors.length;
                neighbors.forEach(target => {
                    nextMessages.push({ targetId: target, value: msgValue });
                });
            }

            // Vote to halt? In PageRank we usually run fixed iterations or until convergence.
            // We will keep them "active" for visualization purposes mostly based on change
            // vertex.active = change > 0.0001; 
        });

        // --- VISUALIZATION UPDATE ---

        // Highlight active transfers (messages)
        // We can't show ALL messages, but we can highlight edges carrying messages
        // Or just nodes processing.

        // Update simple visual states
        vertices.forEach(v => {
            // Color based on rank
            // For Pregel, maybe we just show "Visiting" if they processed messages?
            // Let's stick to rank coloring for consistency with standard PageRank
            nodeStates.set(v.id, 'default');
        });

        const maxRank = Math.max(...vertices.map(v => v.value));
        vertices.forEach(v => {
            if (v.value >= maxRank * 0.8) nodeStates.set(v.id, 'path');
            else if (v.value >= maxRank * 0.5) nodeStates.set(v.id, 'visiting');
            else nodeStates.set(v.id, 'visited');
        });

        steps.push({
            nodeStates: new Map(nodeStates),
            edgeStates: new Map(edgeStates), // Edges don't really change state in PageRank
            message: `[Superstep ${step}] Exchange: ${currentMessages.length} msgs. Max Δ: ${maxChange.toFixed(6)}`,
            pageRankValues: new Map(vertices.map(v => [v.id, v.value])),
            partitionStats: getPartitionStats(vertices, nextMessages)
        });

        currentMessages = nextMessages;
    }

    // Final Result
    const sortedRanks = [...vertices].sort((a, b) => b.value - a.value);

    return {
        steps,
        path: sortedRanks.map(v => v.id),
        found: true,
        metrics: {
            timeComplexity: 'O(L * (V+E)/P)', // Supersteps * Work per partition
            spaceComplexity: 'O(V + E)',
            visitedNodes: n,
            visitedEdges: graph.edges.length
        }
    };
}

function getPartitionStats(vertices: VertexState[], messages: Message[]) {
    const stats = new Map<number, { activeNodes: number; messagesSent: number }>();

    // Count nodes per partition
    vertices.forEach(v => {
        const current = stats.get(v.partitionId) || { activeNodes: 0, messagesSent: 0 };
        stats.set(v.partitionId, { ...current, activeNodes: current.activeNodes + 1 });
    });

    // Count outgoing messages per partition (source partition)
    // We need to look up which partition the SOURCE of the message is.
    // But message struct only has target.
    // In simulation, we know we just generated nextMessages from the vertices loop.
    // Ideally we'd track this during generation.
    // Approximation: assume uniform distribution for stats or just track global?
    // Let's refine: The stats are "Messages Exchanged".
    // We can just count total for now, or if we want partition view, we need source info.
    // For simplicity in this step, let's just count active nodes.

    return stats;
}
