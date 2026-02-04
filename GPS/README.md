# Graph Processing System

## System Design and Architecture

### Overview

The Graph Processing System is an interactive web application for visualizing and learning graph algorithms. It is designed for clarity, modularity, and educational value, allowing users to select sample graphs, choose algorithms, set source/target nodes, and step through or animate the algorithm execution.

### High-Level Architecture

```
+-------------------+
|   User Interface  |
| (React Components)|
+-------------------+
          |
          v
+-------------------+
|  Visualizer Logic |
| (Custom Hooks)    |
+-------------------+
          |
          v
+-------------------+
|   Algorithm Core  |
| (Algorithm Impl.) |
+-------------------+
          |
          v
+-------------------+
|   Data Models     |
| (Graph, Steps)    |
+-------------------+
```

### Main Components

- **User Interface (UI):**
  - Built with React and Tailwind CSS.
  - Components: `GraphCanvas`, `AlgorithmSelector`, `ControlPanel`, `GraphSelector`, `Legend`, `AlgorithmExplanations`, `JavaCodePanel`.
  - Provides interactive controls, visualization, and explanations.

- **Visualizer Logic:**
  - Custom React hook: `useAlgorithmVisualizer`.
  - Manages algorithm state, step history, playback, and animation.

- **Algorithm Core:**
  - Implements core graph algorithms (Bidirectional BFS, Dijkstra, DFS, BFS Shortest Path, PageRank).
  - Each algorithm emits step-by-step logs for visualization.

- **Data Models:**
  - TypeScript interfaces for `Graph`, `AlgorithmStep`, node/edge states, etc.
  - Sample graphs provided for demonstration.

### Component Interactions

- **User** interacts with the UI to select graphs, algorithms, and nodes.
- **UI Components** trigger actions (e.g., run algorithm, step forward) via props and callbacks.
- **Visualizer Hook** (`useAlgorithmVisualizer`) manages the current algorithm state and exposes control functions (`runAlgorithm`, `play`, `stepForward`, etc.).
- **Algorithm Implementations** process the graph and emit step logs, which are visualized in the UI.

---

## Implementation Details

### Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **Icons/UI:** Lucide, custom UI components
- **State Management:** React hooks and local state
- **Visualization:** Custom SVG-based `GraphCanvas`
- **Code Display:** Java code snippets for each algorithm

### Algorithms Implemented

- **Bidirectional BFS:** Efficient shortest path search from both source and target.
- **Dijkstra's Algorithm:** Weighted shortest path algorithm.
- **Depth-First Search (DFS):** Explores as deep as possible before backtracking.
- **BFS Shortest Path:** Standard BFS for unweighted graphs.
- **PageRank:** Ranks nodes by importance using iterative probability distribution.

### Key Code Segments

#### 1. Visualizer Hook (`useAlgorithmVisualizer`)

Manages algorithm execution, step history, and playback:

```typescript
const {
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  currentStepData,
  runAlgorithm,
  play,
  pause,
  stepForward,
  stepBackward,
  reset,
  setSpeed,
  steps
} = useAlgorithmVisualizer({ graph, source, target, algorithm });
```

#### 2. Algorithm Selector

Allows users to choose the algorithm and run it:

```tsx
<AlgorithmSelector
  selectedAlgorithm={selectedAlgorithm}
  onAlgorithmChange={handleAlgorithmChange}
  onRun={handleRunAndPlay}
  selectedSource={selectedSource}
  selectedTarget={selectedTarget}
  isRunning={isPlaying}
/>
```

#### 3. Running and Animating the Algorithm

Ensures the algorithm runs and animates through all steps:

```typescript
const handleRunAndPlay = () => {
  runAlgorithm();
  setTimeout(() => play(), 0); // Start animation after setup
};
```

#### 4. Algorithm Log and Explanations

Displays a step-by-step log and algorithm description under the graph:

```tsx
<div className="mt-6 p-4 bg-card border border-border rounded-xl shadow text-base text-foreground">
  <h2 className="text-lg font-bold mb-2">Algorithm Log</h2>
  <ol className="list-decimal ml-6 mt-3 space-y-1">
    {(steps ?? []).map((step, i) => (
      <li key={i} className={i === currentStep ? 'font-bold text-primary' : ''}>
        {step.message}
      </li>
    ))}
  </ol>
</div>
<AlgorithmExplanations selectedAlgorithm={selectedAlgorithm} />
```

#### 5. Graph Visualization

Renders the graph and highlights node/edge states:

```tsx
<GraphCanvas
  graph={graph}
  nodeStates={currentStepData.nodeStates}
  edgeStates={currentStepData.edgeStates}
  selectedSource={selectedSource}
  selectedTarget={selectedTarget}
  onNodeClick={handleNodeClick}
  pageRankValues={currentStepData.pageRankValues}
  distances={currentStepData.distances}
/>
```

---

## How It Works

1. **Select a graph** and an **algorithm**.
2. **Choose source/target nodes** as required.
3. **Click "Run Algorithm"** to animate the algorithm step-by-step.
4. **View the algorithm log** and **description** below the graph for learning and reference.
5. **Step controls** allow manual navigation through the algorithm's execution.

---

## Extensibility

- **Add new algorithms** by implementing them in the algorithm core and updating the selector.
- **Add new sample graphs** in the `sampleGraphs` module.
- **UI and logic** are decoupled for easy maintenance and extension.

---

## Folder Structure (Key Files)

```
/src
  /components
    AlgorithmSelector.tsx
    ControlPanel.tsx
    GraphCanvas.tsx
    AlgorithmExplanations.tsx
    ...
  /hooks
    useAlgorithmVisualizer.ts
  /lib
    sampleGraphs.ts
  /pages
    Index.tsx
  /types
    graph.ts
```

---

## Credits

- Built with React, TypeScript, and Tailwind CSS.
- Algorithms and visualizations designed for educational clarity.

---

You can copy and use this as your README or documentation section!
