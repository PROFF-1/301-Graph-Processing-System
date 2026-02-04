import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Graph,
  AlgorithmType,
  AlgorithmStep,
  AlgorithmResult,
  NodeState,
  EdgeState
} from '@/types/graph';
import {
  bidirectionalBFS,
  dijkstra,
  dfs,
  shortestPath,
  pageRank
} from '@/lib/graphAlgorithms';

interface UseAlgorithmVisualizerProps {
  graph: Graph;
  source: string | null;
  target: string | null;
  algorithm: AlgorithmType;
  config?: { maxIterations?: number; dampingFactor?: number };
}

export function useAlgorithmVisualizer({
  graph,
  source,
  target,
  algorithm,
  config,
}: UseAlgorithmVisualizerProps) {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [result, setResult] = useState<AlgorithmResult | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get current visualization state
  const currentStepData = steps[currentStep] || {
    nodeStates: new Map<string, NodeState>(),
    edgeStates: new Map<string, EdgeState>(),
    message: 'Select an algorithm and nodes to begin',
  };

  // Run the selected algorithm
  const runAlgorithm = useCallback(() => {
    let algorithmResult: AlgorithmResult;

    switch (algorithm) {
      case 'bidirectional-bfs':
        if (!source || !target) {
          algorithmResult = { steps: [], path: [], found: false, error: 'Select source and target' };
        } else {
          algorithmResult = bidirectionalBFS(graph, source, target);
        }
        break;

      case 'dijkstra':
        if (!source || !target) {
          algorithmResult = { steps: [], path: [], found: false, error: 'Select source and target' };
        } else {
          algorithmResult = dijkstra(graph, source, target);
        }
        break;

      case 'dfs':
        if (!source || !target) {
          algorithmResult = { steps: [], path: [], found: false, error: 'Select source and target' };
        } else {
          algorithmResult = dfs(graph, source, target);
        }
        break;

      case 'shortest-path':
        if (!source || !target) {
          algorithmResult = { steps: [], path: [], found: false, error: 'Select source and target' };
        } else {
          algorithmResult = shortestPath(graph, source, target);
        }
        break;

      case 'pagerank':
        algorithmResult = pageRank(graph, config?.maxIterations || 20, config?.dampingFactor || 0.85);
        break;

      default:
        algorithmResult = { steps: [], path: [], found: false, error: 'Unknown algorithm' };
    }

    setResult(algorithmResult);
    setSteps(algorithmResult.steps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [graph, source, target, algorithm, config]);

  // Playback controls
  const play = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Clear steps when algorithm or graph changes
  useEffect(() => {
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
    setIsPlaying(false);
  }, [graph, algorithm]);

  return {
    // State
    steps,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    result,
    currentStepData,

    // Actions
    runAlgorithm,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
    jumpToStep: (step: number) => {
      if (step >= 0 && step < steps.length) {
        setCurrentStep(step);
        setIsPlaying(false);
      }
    },
  };
}
