import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgorithmResult } from '@/types/graph';
import { Clock, Database, Eye, Route } from 'lucide-react';

interface MetricsPanelProps {
    result: AlgorithmResult | null;
    algorithmName: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ result, algorithmName }) => {
    if (!result || !result.metrics) {
        return (
            <Card className="h-full bg-card border-border">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{algorithmName} Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Run the algorithm to see metrics.</div>
                </CardContent>
            </Card>
        );
    }

    const { timeComplexity, spaceComplexity, visitedNodes, visitedEdges, pathLength } = result.metrics;

    return (
        <Card className="h-full bg-card border-border">
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    {algorithmName} Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Time Complexity
                    </div>
                    <p className="text-sm font-mono font-medium">{timeComplexity}</p>
                </div>

                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Database className="w-3 h-3" /> Space Complexity
                    </div>
                    <p className="text-sm font-mono font-medium">{spaceComplexity}</p>
                </div>

                <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Nodes Visited
                    </div>
                    <p className="text-sm font-mono font-medium">{visitedNodes}</p>
                </div>

                {pathLength !== undefined && (
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Route className="w-3 h-3" /> Path Length
                        </div>
                        <p className="text-sm font-mono font-medium">{pathLength}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
