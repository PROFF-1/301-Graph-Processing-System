import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Graph } from "@/types/graph";
import { toast } from "sonner"; // Assuming sonner is used for toasts

interface GraphIOProps {
    graph: Graph;
    onImport: (graph: Graph, name: string) => void; // Updated interface
}

export const GraphIO: React.FC<GraphIOProps> = ({ graph, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleExport = () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `graph_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            toast.success("Graph exported successfully");
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("Failed to export graph");
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset beforehand
            fileInputRef.current.click();
        }
    };

    const MAX_NODES = 1000;
    const MAX_EDGES = 2000;
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            // Read file as text asynchronously
            const content = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (!e.target?.result) reject(new Error("Empty file content"));
                    else resolve(e.target.result as string);
                };
                reader.onerror = () => reject(new Error("Error reading file"));
                reader.readAsText(file);
            });

            // Parse JSON asynchronously to avoid UI freeze
            let importedGraph: Graph;
            await new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    try {
                        importedGraph = JSON.parse(content) as Graph;
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                }, 0);
            });

            // Basic validation
            if (!Array.isArray(importedGraph.nodes) || !Array.isArray(importedGraph.edges)) {
                throw new Error("Invalid graph format: missing nodes or edges array");
            }

            if (importedGraph.nodes.length > MAX_NODES || importedGraph.edges.length > MAX_EDGES) {
                toast.error(`Graph too large! Limit: ${MAX_NODES} nodes, ${MAX_EDGES} edges. Your file: ${importedGraph.nodes.length} nodes, ${importedGraph.edges.length} edges.`);
                setLoading(false);
                return;
            }

            // Sanitize and Fill Defaults
            const safeNodes = importedGraph.nodes.map((n, i) => ({
                ...n,
                id: n.id ? String(n.id) : `n${i}`,
                label: n.label ? String(n.label) : (n.id ? String(n.id) : `Node ${i}`),
                x: typeof n.x === 'number' ? n.x : Math.random() * 500 + 50,
                y: typeof n.y === 'number' ? n.y : Math.random() * 300 + 50,
            }));

            const safeEdges = importedGraph.edges.map(e => ({
                ...e,
                source: String(e.source),
                target: String(e.target),
                weight: typeof e.weight === 'number' ? e.weight : 1
            })).filter(e =>
                safeNodes.some(n => n.id === e.source) &&
                safeNodes.some(n => n.id === e.target)
            );

            const sanitizedGraph: Graph = {
                ...importedGraph,
                nodes: safeNodes,
                edges: safeEdges,
                directed: typeof importedGraph.directed === 'boolean' ? importedGraph.directed : true
            };

            // Use filename (minus extension) as default name
            const name = file.name.replace(/\.[^/.]+$/, "") || "Imported Graph";

            onImport(sanitizedGraph, name);
            toast.success(`Imported graph "${name}" with ${sanitizedGraph.nodes.length} nodes`);
        } catch (error) {
            console.error("Import error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to import graph");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 w-full items-center">
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleExport}
                type="button"
                disabled={loading}
            >
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleImportClick}
                type="button"
                disabled={loading}
            >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? "Importing..." : "Import"}
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                style={{ display: 'none' }}
                accept=".json"
                disabled={loading}
            />
            {loading && <span className="ml-2 text-xs text-muted-foreground">Parsing large file...</span>}
        </div>
    );
};
