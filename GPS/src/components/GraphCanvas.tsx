import React from 'react';
import { Graph, NodeState, EdgeState } from '@/types/graph';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GraphCanvasProps {
  graph: Graph;
  nodeStates: Map<string, NodeState>;
  edgeStates: Map<string, EdgeState>;
  selectedSource: string | null;
  selectedTarget: string | null;
  onNodeClick: (nodeId: string) => void;
  pageRankValues?: Map<string, number>;
  distances?: Map<string, number>;
  isEditing?: boolean;
  onNodeMove?: (id: string, x: number, y: number) => void;
  onBackgroundClick?: (x: number, y: number) => void;

  edgeSource?: string | null;
  onNodeDoubleClick?: (id: string) => void;
  onEdgeClick?: (source: string, target: string) => void;
  showPartitions?: boolean;
}

import { PARTITION_COLORS } from '@/lib/partitioning';

const nodeColors: Record<NodeState, string> = {
  'default': 'hsl(var(--node-default))',
  'source': 'hsl(var(--node-source))',
  'target': 'hsl(var(--node-target))',
  'visiting': 'hsl(var(--node-current))',
  'visited': 'hsl(var(--node-visited))',
  'path': 'hsl(var(--node-path))',
  'forward-frontier': 'hsl(173 80% 50%)',
  'backward-frontier': 'hsl(339 90% 60%)',
};

const edgeColors: Record<EdgeState, string> = {
  'default': 'hsl(var(--edge-default))',
  'exploring': 'hsl(var(--edge-exploring))',
  'path': 'hsl(var(--edge-path))',
  'visited': 'hsl(var(--node-visited))',
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  nodeStates,
  edgeStates,
  selectedSource,
  selectedTarget,
  onNodeClick,
  pageRankValues,
  distances,
  isEditing = false,
  onNodeMove,
  onBackgroundClick,

  edgeSource,
  onNodeDoubleClick,
  onEdgeClick,
  showPartitions = false,
}) => {
  const [draggingNode, setDraggingNode] = React.useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Large graph optimization threshold
  const isLargeGraph = graph.nodes.length > 50;
  const isHugeGraph = graph.nodes.length > 1000 || graph.edges.length > 2000;

  const getMousePos = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && isEditing && onNodeMove) {
      const { x, y } = getMousePos(e);
      // Clamp values to stay within viewbox loosely
      const clampedX = Math.max(20, Math.min(630, x));
      const clampedY = Math.max(20, Math.min(480, y));
      onNodeMove(draggingNode, clampedX, clampedY);
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (isEditing && onBackgroundClick && !draggingNode) {
      const { x, y } = getMousePos(e);
      onBackgroundClick(x, y);
    }
  };

  const getEdgeKey = (source: string, target: string) => `${source}-${target}`;

  const getEdgeState = (source: string, target: string): EdgeState => {
    const key1 = getEdgeKey(source, target);
    const key2 = getEdgeKey(target, source);
    return edgeStates.get(key1) || edgeStates.get(key2) || 'default';
  };

  const getNodeState = (nodeId: string): NodeState => {
    if (nodeId === selectedSource) return 'source';
    if (nodeId === selectedTarget) return 'target';
    return nodeStates.get(nodeId) || 'default';
  };

  // Calculate node radius based on PageRank if available
  const getNodeRadius = (nodeId: string) => {
    if (!pageRankValues || pageRankValues.size === 0) return 28;
    const rank = pageRankValues.get(nodeId) || 0;
    const maxRank = Math.max(...Array.from(pageRankValues.values()));
    const minRadius = 20;
    const maxRadius = 45;
    return minRadius + (rank / maxRank) * (maxRadius - minRadius);
  };

  // For huge graphs, use canvas for performance
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    if (!isHugeGraph) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw edges
    ctx.globalAlpha = 0.6;
    for (const edge of graph.edges) {
      const sourceNode = graph.nodes.find(n => n.id === edge.source);
      const targetNode = graph.nodes.find(n => n.id === edge.target);
      if (!sourceNode || !targetNode) continue;
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = '#bbb';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Draw nodes
    ctx.globalAlpha = 1.0;
    for (const node of graph.nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#1976d2';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [graph, isHugeGraph]);

  if (isHugeGraph) {
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={650}
          height={500}
          style={{ width: '100%', height: '100%', background: 'var(--background)', borderRadius: '0.5rem', display: 'block' }}
        />
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
          Huge graph mode: {graph.nodes.length} nodes, {graph.edges.length} edges
        </div>
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      className={`w-full h-full bg-background rounded-lg ${isEditing ? 'cursor-crosshair' : ''}`}
      viewBox="0 0 650 500"
      preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleBackgroundClick}
    >
      {/* Glow filter definitions */}
      <defs>
        <filter id="glow-source" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-target" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-path" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Arrow marker for directed graphs */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--edge-default))"
          />
        </marker>
        <marker
          id="arrowhead-hover"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--primary))"
          />
        </marker>
        <marker
          id="arrowhead-path"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--edge-path))"
          />
        </marker>
      </defs>

      {/* Draw edges first (behind nodes) */}
      {graph.edges.map((edge, index) => {
        const sourceNode = graph.nodes.find(n => n.id === edge.source);
        const targetNode = graph.nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        const state = getEdgeState(edge.source, edge.target);
        const color = edgeColors[state];
        const strokeWidth = state === 'path' ? 4 : state === 'exploring' ? 3 : 2;

        // Calculate midpoint for weight label
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;

        // Calculate shortened line for arrow (so it doesn't overlap node)
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const targetRadius = getNodeRadius(edge.target);
        const shortenedLength = length - targetRadius - 5;
        const endX = sourceNode.x + (dx / length) * shortenedLength;
        const endY = sourceNode.y + (dy / length) * shortenedLength;

        return (
          <g
            key={`edge-${index}`}
            onClick={(e) => {
              if (isEditing && onEdgeClick) {
                e.stopPropagation();
                onEdgeClick(edge.source, edge.target);
              }
            }}
            className={isEditing ? 'cursor-pointer hover:stroke-primary' : ''}
          >
            <line
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={graph.directed ? endX : targetNode.x}
              y2={graph.directed ? endY : targetNode.y}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              markerEnd={graph.directed ? (state === 'path' ? 'url(#arrowhead-path)' : 'url(#arrowhead)') : undefined}
              className={`${state === 'path' ? 'animate-path-trace' : ''} transition-colors`}
              filter={state === 'path' ? 'url(#glow-path)' : undefined}
            />
            {/* Invisible thicker line for easier clicking */}
            {isEditing && (
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="transparent"
                strokeWidth={15}
              />
            )}
            {edge.weight !== undefined && (
              <g>
                <rect
                  x={midX - 12}
                  y={midY - 10}
                  width={24}
                  height={20}
                  fill="hsl(var(--background))"
                  rx={4}
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs font-mono"
                >
                  {edge.weight}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Draw nodes */}
      {graph.nodes.map((node) => {
        const state = getNodeState(node.id);
        const color = nodeColors[state];
        const radius = getNodeRadius(node.id);
        const isGlowing = state === 'source' || state === 'target' || state === 'path' || state === 'visiting';
        const distance = distances?.get(node.id);
        const pageRank = pageRankValues?.get(node.id);

        return (
          <Tooltip key={node.id}>
            <TooltipTrigger asChild>
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeClick(node.id);
                }}
                onMouseDown={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    e.stopPropagation();
                    setDraggingNode(node.id);
                  }
                }}
                onDoubleClick={(e) => {
                  if (isEditing && onNodeDoubleClick) {
                    e.stopPropagation();
                    onNodeDoubleClick(node.id);
                  }
                }}
                className={`transition-transform ${isEditing ? 'cursor-move' : 'cursor-pointer hover:scale-110'}`}
                opacity={isEditing && edgeSource && edgeSource !== node.id ? 0.7 : 1}
              >
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={showPartitions && node.partitionId !== undefined ? PARTITION_COLORS[node.partitionId! % PARTITION_COLORS.length] : color}
                  stroke={state === 'visiting' ? 'hsl(var(--foreground))' : 'transparent'}
                  strokeWidth={3}
                  filter={isGlowing ? `url(#glow-${state === 'source' ? 'source' : state === 'target' ? 'target' : 'path'})` : undefined}
                  className={state === 'visiting' ? 'animate-node-visit' : ''}
                />

                {/* Node label */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-semibold text-sm pointer-events-none select-none"
                  style={{ fontSize: radius > 35 ? '14px' : '12px' }}
                >
                  {node.label}
                </text>

                {/* Distance or PageRank indicator */}
                {distance !== undefined && distance !== Infinity && (
                  <g>
                    <circle
                      cx={node.x + radius * 0.7}
                      cy={node.y - radius * 0.7}
                      r={12}
                      fill="hsl(var(--primary))"
                    />
                    <text
                      x={node.x + radius * 0.7}
                      y={node.y - radius * 0.7 + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-primary-foreground font-mono text-xs pointer-events-none"
                    >
                      {distance}
                    </text>
                  </g>
                )}

                {pageRank !== undefined && (
                  <text
                    x={node.x}
                    y={node.y + radius + 16}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono text-xs"
                  >
                    {pageRank.toFixed(3)}
                  </text>
                )}
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs font-mono">
                <p><span className="font-semibold">ID:</span> {node.id}</p>
                <p><span className="font-semibold">Label:</span> {node.label}</p>
                <p><span className="font-semibold">Pos:</span> ({Math.round(node.x)}, {Math.round(node.y)})</p>
                {distance !== undefined && <p><span className="font-semibold">Dist:</span> {distance === Infinity ? '∞' : distance}</p>}
                {pageRank !== undefined && <p><span className="font-semibold">Rank:</span> {pageRank.toFixed(4)}</p>}
                <p><span className="font-semibold">State:</span> {state}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </svg>
  );
};
