import { GraphNode } from "@/types/graph";

export const getNextLabel = (nodes: GraphNode[]): string => {
    if (nodes.length === 0) return "A";

    const labels = nodes.map(n => n.label);
    const lastLabel = labels[labels.length - 1];

    // Check if all labels are numeric
    const allNumeric = labels.every(l => /^\d+$/.test(l));

    if (allNumeric) {
        // Find max number and increment
        const maxNum = Math.max(...labels.map(l => parseInt(l, 10)));
        return (maxNum + 1).toString();
    }

    // Check if labels are single letters (A, B, C...)
    const allSingleLetters = labels.every(l => /^[A-Z]$/.test(l));
    if (allSingleLetters) {
        const lastCharCode = lastLabel.charCodeAt(0);
        // If we reach Z, maybe wrap to AA? For now let's just go next char code
        // But simple increments work best for now.
        return String.fromCharCode(lastCharCode + 1);
    }

    // Fallback pattern: Try to detect "Node X" pattern
    const nodePattern = /^Node (\d+)$/;
    const nodeMatches = labels.map(l => l.match(nodePattern));
    if (nodeMatches.every(m => m !== null)) {
        const maxNum = Math.max(...nodeMatches.map(m => parseInt(m![1], 10)));
        return `Node ${maxNum + 1}`;
    }

    // Fallback: If mixture or unknown, just use len+1 or a timestamp based ID?
    // User asked for "if A, B, C.. next is D".
    // Let's rely on the last label primarily if global consistency isn't clear.

    if (/^\d+$/.test(lastLabel)) {
        return (parseInt(lastLabel) + 1).toString();
    }

    if (/^[A-Za-z]$/.test(lastLabel)) {
        return String.fromCharCode(lastLabel.charCodeAt(0) + 1).toUpperCase();
    }

    return `Node ${nodes.length + 1}`;
};
