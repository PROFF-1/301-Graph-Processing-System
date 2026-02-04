import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { Graph } from "@/types/graph";
import { toast } from "sonner"; // Assuming sonner is used for toasts

interface GraphIOProps {
    graph: Graph;
    onImport: (graph: Graph) => void;
}

export const GraphIO: React.FC<GraphIOProps> = ({ graph, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graph, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "graph_export.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("Graph exported successfully");
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedGraph = JSON.parse(content) as Graph;

                // Basic validation
                if (!Array.isArray(importedGraph.nodes) || !Array.isArray(importedGraph.edges)) {
                    throw new Error("Invalid graph format");
                }

                onImport(importedGraph);
                toast.success("Graph imported successfully");
            } catch (error) {
                console.error("Import error:", error);
                toast.error("Failed to import graph: Invalid JSON");
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    return (
        <div className="flex gap-2 w-full">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                className="hidden"
                accept=".json"
            />
        </div>
    );
};
