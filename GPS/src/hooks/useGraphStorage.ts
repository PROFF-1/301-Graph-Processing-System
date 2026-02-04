import { useState, useEffect } from 'react';
import { Graph } from '@/types/graph';

export interface CustomGraph {
    id: string;
    name: string;
    graph: Graph;
    updatedAt: number;
}

export function useGraphStorage() {
    const [customGraphs, setCustomGraphs] = useState<CustomGraph[]>(() => {
        try {
            const saved = localStorage.getItem('customGraphs');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load custom graphs", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('customGraphs', JSON.stringify(customGraphs));
    }, [customGraphs]);

    const addGraph = (name: string, initialGraph: Graph) => {
        const newGraph: CustomGraph = {
            id: `custom-${Date.now()}`,
            name,
            graph: initialGraph,
            updatedAt: Date.now(),
        };
        setCustomGraphs(prev => [...prev, newGraph]);
        return newGraph.id;
    };

    const updateGraph = (id: string, graph: Graph) => {
        setCustomGraphs(prev => prev.map(g =>
            g.id === id ? { ...g, graph, updatedAt: Date.now() } : g
        ));
    };

    const deleteGraph = (id: string) => {
        setCustomGraphs(prev => prev.filter(g => g.id !== id));
    };

    return {
        customGraphs,
        addGraph,
        updateGraph,
        deleteGraph
    };
}
