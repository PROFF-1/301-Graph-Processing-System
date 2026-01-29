// Java source code strings for download

export const javaFiles = {
  'Graph.java': `/**
 * Graph.java - Adjacency List Graph Representation
 * 
 * This class represents an unweighted graph using an adjacency list.
 * An adjacency list stores, for each node, a list of all nodes it connects to.
 * 
 * Why adjacency list?
 * - Memory efficient for sparse graphs (most real-world graphs)
 * - O(1) to add an edge
 * - O(degree) to iterate neighbors
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class Graph {
    // Map from node ID to list of neighbor IDs
    // Example: { "A" -> ["B", "C"], "B" -> ["A", "D"], ... }
    private Map<String, List<String>> adjacencyList;
    
    // Whether edges have direction (A→B doesn't mean B→A)
    private boolean isDirected;

    /**
     * Creates a new empty graph.
     * 
     * @param isDirected true for directed graph, false for undirected
     */
    public Graph(boolean isDirected) {
        this.adjacencyList = new HashMap<>();
        this.isDirected = isDirected;
    }

    /**
     * Adds a node to the graph.
     * If node already exists, nothing happens.
     * 
     * @param node The unique identifier for the node
     */
    public void addNode(String node) {
        // putIfAbsent only adds if key doesn't exist
        adjacencyList.putIfAbsent(node, new ArrayList<>());
    }

    /**
     * Adds an edge between two nodes.
     * Creates nodes if they don't exist.
     * 
     * @param source Starting node of the edge
     * @param target Ending node of the edge
     */
    public void addEdge(String source, String target) {
        // Ensure both nodes exist
        addNode(source);
        addNode(target);
        
        // Add the edge from source to target
        adjacencyList.get(source).add(target);
        
        // For undirected graphs, also add reverse edge
        if (!isDirected) {
            adjacencyList.get(target).add(source);
        }
    }

    /**
     * Gets all neighbors of a node (nodes it connects to).
     * 
     * @param node The node to get neighbors for
     * @return List of neighbor node IDs, or empty list if node doesn't exist
     */
    public List<String> getNeighbors(String node) {
        return adjacencyList.getOrDefault(node, Collections.emptyList());
    }

    /**
     * Checks if a node exists in the graph.
     * 
     * @param node The node to check
     * @return true if node exists, false otherwise
     */
    public boolean hasNode(String node) {
        return adjacencyList.containsKey(node);
    }

    /**
     * Gets all nodes in the graph.
     * 
     * @return Set of all node IDs
     */
    public Set<String> getAllNodes() {
        return adjacencyList.keySet();
    }

    /**
     * Checks if graph is empty.
     * 
     * @return true if no nodes exist
     */
    public boolean isEmpty() {
        return adjacencyList.isEmpty();
    }

    /**
     * Gets the number of nodes.
     * 
     * @return Count of nodes
     */
    public int size() {
        return adjacencyList.size();
    }

    /**
     * Whether this graph is directed.
     * 
     * @return true if directed
     */
    public boolean isDirected() {
        return isDirected;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(isDirected ? "Directed" : "Undirected").append(" Graph:\\n");
        for (Map.Entry<String, List<String>> entry : adjacencyList.entrySet()) {
            sb.append("  ").append(entry.getKey())
              .append(" -> ").append(entry.getValue()).append("\\n");
        }
        return sb.toString();
    }
}`,

  'WeightedGraph.java': `/**
 * WeightedGraph.java - Adjacency List with Edge Weights
 * 
 * Extension of the basic graph to support weighted edges.
 * Used for Dijkstra's algorithm where edge costs matter.
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class WeightedGraph {
    
    /**
     * Inner class representing a weighted edge.
     * Stores the destination node and the weight/cost.
     */
    public static class Edge {
        public final String target;  // Destination node
        public final int weight;     // Cost/distance to traverse this edge
        
        public Edge(String target, int weight) {
            this.target = target;
            this.weight = weight;
        }
        
        @Override
        public String toString() {
            return target + "(" + weight + ")";
        }
    }
    
    // Map from node ID to list of weighted edges
    private Map<String, List<Edge>> adjacencyList;
    private boolean isDirected;

    public WeightedGraph(boolean isDirected) {
        this.adjacencyList = new HashMap<>();
        this.isDirected = isDirected;
    }

    public void addNode(String node) {
        adjacencyList.putIfAbsent(node, new ArrayList<>());
    }

    /**
     * Adds a weighted edge between two nodes.
     * 
     * @param source Starting node
     * @param target Ending node  
     * @param weight The cost/distance of this edge
     */
    public void addEdge(String source, String target, int weight) {
        addNode(source);
        addNode(target);
        
        adjacencyList.get(source).add(new Edge(target, weight));
        
        if (!isDirected) {
            adjacencyList.get(target).add(new Edge(source, weight));
        }
    }

    public List<Edge> getEdges(String node) {
        return adjacencyList.getOrDefault(node, Collections.emptyList());
    }

    public boolean hasNode(String node) {
        return adjacencyList.containsKey(node);
    }

    public Set<String> getAllNodes() {
        return adjacencyList.keySet();
    }

    public boolean isEmpty() {
        return adjacencyList.isEmpty();
    }

    public int size() {
        return adjacencyList.size();
    }
}`,

  'BidirectionalSearch.java': `/**
 * BidirectionalSearch.java - Bidirectional BFS Implementation
 * 
 * WHAT IS BIDIRECTIONAL SEARCH?
 * ============================
 * Instead of searching from just the source, we search from BOTH ends:
 * - One BFS expands forward from the source
 * - Another BFS expands backward from the target
 * 
 * When the two searches meet in the middle, we've found a path!
 * 
 * WHY IS THIS FASTER?
 * ===================
 * Regular BFS explores nodes in expanding circles. If the path has length d,
 * it explores roughly O(b^d) nodes, where b is the branching factor.
 * 
 * Bidirectional search explores two smaller circles that meet in the middle:
 * O(2 * b^(d/2)) = O(b^(d/2)), which is MUCH smaller!
 * 
 * Example: If b=10 and d=6:
 * - Regular BFS: 10^6 = 1,000,000 nodes
 * - Bidirectional: 2 * 10^3 = 2,000 nodes
 * 
 * ALGORITHM STEPS:
 * 1. Initialize two queues: one at source, one at target
 * 2. Initialize two visited sets, each tracking parent pointers
 * 3. Alternately expand each frontier by one level
 * 4. After each expansion, check if any node is in BOTH visited sets
 * 5. If found, reconstruct path from source → meeting point → target
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class BidirectionalSearch {
    
    /**
     * Finds the shortest path using Bidirectional BFS.
     * 
     * @param graph  The graph to search
     * @param source Starting node ID
     * @param target Destination node ID
     * @return List of node IDs forming the path, or empty list if no path
     * @throws IllegalArgumentException if inputs are invalid
     */
    public static List<String> findPath(Graph graph, String source, String target) {
        // ========== INPUT VALIDATION ==========
        
        // Check for null graph
        if (graph == null || graph.isEmpty()) {
            System.out.println("Error: Graph is null or empty");
            return Collections.emptyList();
        }
        
        // Check if source exists
        if (!graph.hasNode(source)) {
            System.out.println("Error: Source node '" + source + "' not found in graph");
            return Collections.emptyList();
        }
        
        // Check if target exists
        if (!graph.hasNode(target)) {
            System.out.println("Error: Target node '" + target + "' not found in graph");
            return Collections.emptyList();
        }
        
        // Handle trivial case: source equals target
        if (source.equals(target)) {
            System.out.println("Source equals target - trivial path");
            return Collections.singletonList(source);
        }
        
        // ========== INITIALIZATION ==========
        
        // Forward search data structures (expanding from source)
        Queue<String> forwardQueue = new LinkedList<>();
        // Maps each visited node to its parent in the forward search
        Map<String, String> forwardParent = new HashMap<>();
        
        // Backward search data structures (expanding from target)
        Queue<String> backwardQueue = new LinkedList<>();
        // Maps each visited node to its parent in the backward search
        Map<String, String> backwardParent = new HashMap<>();
        
        // Start forward search at source
        forwardQueue.add(source);
        forwardParent.put(source, null);  // Source has no parent
        
        // Start backward search at target
        backwardQueue.add(target);
        backwardParent.put(target, null);  // Target has no parent
        
        // ========== MAIN SEARCH LOOP ==========
        
        // Continue while both queues have nodes to explore
        while (!forwardQueue.isEmpty() && !backwardQueue.isEmpty()) {
            
            // --- STEP 1: Expand forward frontier ---
            // Process all nodes at current level of forward search
            String meetingNode = expandFrontier(
                graph, forwardQueue, forwardParent, backwardParent, "forward"
            );
            
            if (meetingNode != null) {
                // Searches have met! Reconstruct and return path
                return reconstructPath(meetingNode, forwardParent, backwardParent);
            }
            
            // --- STEP 2: Expand backward frontier ---
            // Process all nodes at current level of backward search
            meetingNode = expandFrontier(
                graph, backwardQueue, backwardParent, forwardParent, "backward"
            );
            
            if (meetingNode != null) {
                // Searches have met! Reconstruct and return path
                return reconstructPath(meetingNode, forwardParent, backwardParent);
            }
        }
        
        // ========== NO PATH FOUND ==========
        System.out.println("No path exists between '" + source + "' and '" + target + "'");
        return Collections.emptyList();
    }
    
    /**
     * Expands one level of the BFS frontier.
     * 
     * @param graph         The graph being searched
     * @param queue         Queue for this search direction
     * @param visited       Visited map for this search direction
     * @param otherVisited  Visited map for the opposite direction
     * @param direction     "forward" or "backward" (for logging)
     * @return The meeting node if searches intersect, null otherwise
     */
    private static String expandFrontier(
            Graph graph,
            Queue<String> queue,
            Map<String, String> visited,
            Map<String, String> otherVisited,
            String direction) {
        
        // Process all nodes currently in the queue (one BFS level)
        int levelSize = queue.size();
        
        for (int i = 0; i < levelSize; i++) {
            String current = queue.poll();
            
            // Explore all neighbors of current node
            for (String neighbor : graph.getNeighbors(current)) {
                
                // Skip if we've already visited this node from this direction
                if (visited.containsKey(neighbor)) {
                    continue;
                }
                
                // Mark as visited and record parent
                visited.put(neighbor, current);
                queue.add(neighbor);
                
                // *** KEY CHECK: Has the other search visited this node? ***
                if (otherVisited.containsKey(neighbor)) {
                    System.out.println("Searches meet at node: " + neighbor);
                    return neighbor;  // Found the meeting point!
                }
            }
        }
        
        return null;  // No intersection found at this level
    }
    
    /**
     * Reconstructs the full path after the searches meet.
     * 
     * The path has two parts:
     * 1. Source → Meeting point (traced through forwardParent)
     * 2. Meeting point → Target (traced through backwardParent)
     * 
     * @param meetingNode   Where the two searches intersected
     * @param forwardParent Parent pointers from forward search
     * @param backwardParent Parent pointers from backward search
     * @return Complete path from source to target
     */
    private static List<String> reconstructPath(
            String meetingNode,
            Map<String, String> forwardParent,
            Map<String, String> backwardParent) {
        
        LinkedList<String> path = new LinkedList<>();
        
        // --- Part 1: Build path from source to meeting point ---
        // Trace backward from meeting point to source using forward parents
        String node = meetingNode;
        while (node != null) {
            path.addFirst(node);  // Add to front of list
            node = forwardParent.get(node);
        }
        
        // --- Part 2: Append path from meeting point to target ---
        // Trace backward from meeting point to target using backward parents
        // Skip the meeting node itself (already added)
        node = backwardParent.get(meetingNode);
        while (node != null) {
            path.addLast(node);  // Add to end of list
            node = backwardParent.get(node);
        }
        
        System.out.println("Path found! Length: " + (path.size() - 1) + " edges");
        return path;
    }
}`,

  'DijkstraAlgorithm.java': `/**
 * DijkstraAlgorithm.java - Shortest Path in Weighted Graphs
 * 
 * WHAT IS DIJKSTRA'S ALGORITHM?
 * ============================
 * Dijkstra's algorithm finds the shortest path between nodes in a graph
 * where edges have different weights (costs/distances).
 * 
 * Unlike BFS (which finds shortest path by number of edges), Dijkstra
 * finds the path with minimum total weight.
 * 
 * ALGORITHM STEPS:
 * 1. Initialize distances: source = 0, all others = infinity
 * 2. Create a priority queue, add source
 * 3. While queue is not empty:
 *    a. Extract node with minimum distance
 *    b. For each neighbor, calculate new potential distance
 *    c. If new distance is shorter, update it (relaxation)
 * 4. Reconstruct path using parent pointers
 * 
 * TIME COMPLEXITY: O((V + E) log V) with priority queue
 * SPACE COMPLEXITY: O(V) for distances and parent pointers
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class DijkstraAlgorithm {
    
    /**
     * Finds the shortest weighted path between two nodes.
     * 
     * @param graph  Weighted graph to search
     * @param source Starting node
     * @param target Destination node
     * @return List of nodes forming shortest path, or empty if none
     */
    public static List<String> findShortestPath(
            WeightedGraph graph, 
            String source, 
            String target) {
        
        // ========== INPUT VALIDATION ==========
        
        if (graph == null || graph.isEmpty()) {
            System.out.println("Error: Graph is null or empty");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(source)) {
            System.out.println("Error: Source '" + source + "' not found");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(target)) {
            System.out.println("Error: Target '" + target + "' not found");
            return Collections.emptyList();
        }
        
        if (source.equals(target)) {
            return Collections.singletonList(source);
        }
        
        // ========== INITIALIZATION ==========
        
        // Distance from source to each node (infinity = unreached)
        Map<String, Integer> distances = new HashMap<>();
        
        // Parent pointers for path reconstruction
        Map<String, String> parents = new HashMap<>();
        
        // Nodes we've finalized (found shortest path to)
        Set<String> finalized = new HashSet<>();
        
        // Priority queue: always extracts node with smallest distance
        // Format: [distance, nodeId]
        PriorityQueue<int[]> pq = new PriorityQueue<>(
            Comparator.comparingInt(a -> a[0])
        );
        
        // Map node IDs to integers for the priority queue
        Map<String, Integer> nodeToInt = new HashMap<>();
        Map<Integer, String> intToNode = new HashMap<>();
        int idx = 0;
        for (String node : graph.getAllNodes()) {
            nodeToInt.put(node, idx);
            intToNode.put(idx, node);
            distances.put(node, Integer.MAX_VALUE);
            idx++;
        }
        
        // Source has distance 0
        distances.put(source, 0);
        pq.add(new int[]{0, nodeToInt.get(source)});
        
        // ========== MAIN ALGORITHM LOOP ==========
        
        while (!pq.isEmpty()) {
            // Extract node with minimum distance
            int[] current = pq.poll();
            int currentDist = current[0];
            String currentNode = intToNode.get(current[1]);
            
            // Skip if we've already finalized this node
            if (finalized.contains(currentNode)) {
                continue;
            }
            
            // Mark as finalized
            finalized.add(currentNode);
            
            // Found target? We're done!
            if (currentNode.equals(target)) {
                return reconstructPath(target, parents);
            }
            
            // *** RELAXATION STEP ***
            // Check all edges from current node
            for (WeightedGraph.Edge edge : graph.getEdges(currentNode)) {
                String neighbor = edge.target;
                
                // Skip finalized nodes
                if (finalized.contains(neighbor)) {
                    continue;
                }
                
                // Calculate potential new distance through current node
                int newDist = currentDist + edge.weight;
                
                // Is this path shorter than what we knew before?
                if (newDist < distances.get(neighbor)) {
                    // Yes! Update the distance
                    distances.put(neighbor, newDist);
                    parents.put(neighbor, currentNode);
                    
                    // Add to priority queue with new priority
                    pq.add(new int[]{newDist, nodeToInt.get(neighbor)});
                }
            }
        }
        
        // Target was never reached
        System.out.println("No path exists to target");
        return Collections.emptyList();
    }
    
    /**
     * Traces parent pointers to build the path.
     */
    private static List<String> reconstructPath(
            String target, 
            Map<String, String> parents) {
        
        LinkedList<String> path = new LinkedList<>();
        String node = target;
        
        while (node != null) {
            path.addFirst(node);
            node = parents.get(node);
        }
        
        return path;
    }
}`,

  'DepthFirstSearch.java': `/**
 * DepthFirstSearch.java - DFS Implementation
 * 
 * WHAT IS DEPTH-FIRST SEARCH?
 * ==========================
 * DFS explores as far as possible along each branch before backtracking.
 * It uses a stack (or recursion) to remember where to go back to.
 * 
 * Think of it like exploring a maze:
 * - Go down one path as far as you can
 * - When you hit a dead end, backtrack to the last junction
 * - Try the next unexplored path
 * - Repeat until you find the exit or explore everything
 * 
 * DFS vs BFS:
 * - DFS goes deep first, BFS goes wide first
 * - DFS uses less memory (just the current path)
 * - BFS finds shortest paths, DFS might not
 * 
 * APPLICATIONS:
 * - Cycle detection
 * - Topological sorting
 * - Finding connected components
 * - Solving mazes and puzzles
 * 
 * TIME COMPLEXITY: O(V + E)
 * SPACE COMPLEXITY: O(V) for the recursion stack
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class DepthFirstSearch {
    
    /**
     * Finds a path using DFS (not necessarily shortest).
     * 
     * @param graph  Graph to search
     * @param source Starting node
     * @param target Destination node
     * @return A path from source to target, or empty if none
     */
    public static List<String> findPath(Graph graph, String source, String target) {
        
        // ========== INPUT VALIDATION ==========
        
        if (graph == null || graph.isEmpty()) {
            System.out.println("Error: Graph is null or empty");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(source)) {
            System.out.println("Error: Source '" + source + "' not found");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(target)) {
            System.out.println("Error: Target '" + target + "' not found");
            return Collections.emptyList();
        }
        
        if (source.equals(target)) {
            return Collections.singletonList(source);
        }
        
        // ========== DFS SETUP ==========
        
        // Track visited nodes to avoid cycles
        Set<String> visited = new HashSet<>();
        
        // Current path being explored
        List<String> path = new ArrayList<>();
        
        // Start the recursive search
        if (dfsRecursive(graph, source, target, visited, path)) {
            return path;
        }
        
        System.out.println("No path found");
        return Collections.emptyList();
    }
    
    /**
     * Recursive DFS helper.
     * 
     * @param graph   The graph
     * @param current Current node being explored
     * @param target  Destination we're looking for
     * @param visited Set of already-visited nodes
     * @param path    Current path (modified in place)
     * @return true if target is reachable from current
     */
    private static boolean dfsRecursive(
            Graph graph,
            String current,
            String target,
            Set<String> visited,
            List<String> path) {
        
        // Mark current node as visited
        visited.add(current);
        
        // Add current node to path
        path.add(current);
        
        // *** BASE CASE: Found the target! ***
        if (current.equals(target)) {
            return true;
        }
        
        // *** RECURSIVE CASE: Explore all unvisited neighbors ***
        for (String neighbor : graph.getNeighbors(current)) {
            
            // Skip if already visited (prevents cycles)
            if (visited.contains(neighbor)) {
                continue;
            }
            
            // Recursively search from this neighbor
            if (dfsRecursive(graph, neighbor, target, visited, path)) {
                return true;  // Target found down this path!
            }
        }
        
        // *** BACKTRACK: This path didn't lead to target ***
        // Remove current node from path
        path.remove(path.size() - 1);
        
        return false;
    }
    
    /**
     * Iterative DFS using explicit stack.
     * Equivalent to recursive version but shows stack explicitly.
     */
    public static List<String> findPathIterative(
            Graph graph, 
            String source, 
            String target) {
        
        if (graph == null || !graph.hasNode(source) || !graph.hasNode(target)) {
            return Collections.emptyList();
        }
        
        if (source.equals(target)) {
            return Collections.singletonList(source);
        }
        
        // Stack of nodes to visit
        Deque<String> stack = new ArrayDeque<>();
        
        // Parent pointers for path reconstruction
        Map<String, String> parents = new HashMap<>();
        
        // Visited set
        Set<String> visited = new HashSet<>();
        
        stack.push(source);
        parents.put(source, null);
        
        while (!stack.isEmpty()) {
            String current = stack.pop();
            
            if (visited.contains(current)) {
                continue;
            }
            visited.add(current);
            
            if (current.equals(target)) {
                // Reconstruct path
                LinkedList<String> path = new LinkedList<>();
                String node = target;
                while (node != null) {
                    path.addFirst(node);
                    node = parents.get(node);
                }
                return path;
            }
            
            // Push neighbors onto stack (reverse order to maintain left-to-right)
            List<String> neighbors = graph.getNeighbors(current);
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                String neighbor = neighbors.get(i);
                if (!visited.contains(neighbor)) {
                    stack.push(neighbor);
                    if (!parents.containsKey(neighbor)) {
                        parents.put(neighbor, current);
                    }
                }
            }
        }
        
        return Collections.emptyList();
    }
}`,

  'PageRank.java': `/**
 * PageRank.java - Google's Famous Ranking Algorithm
 * 
 * WHAT IS PAGERANK?
 * ================
 * PageRank is an algorithm that assigns importance scores to nodes
 * based on the structure of links between them.
 * 
 * The core idea (simplified):
 * - A page is important if important pages link to it
 * - Each page distributes its importance equally among outgoing links
 * - We iterate until scores stabilize
 * 
 * THE RANDOM SURFER MODEL:
 * Imagine a web surfer randomly clicking links:
 * - With probability 'd' (damping factor), they click a random link
 * - With probability '1-d', they jump to a random page
 * 
 * Pages visited more often get higher PageRank.
 * 
 * FORMULA:
 * PR(A) = (1-d)/N + d * Σ(PR(B) / OutDegree(B))
 *         for all pages B that link to A
 * 
 * Where:
 * - d = damping factor (usually 0.85)
 * - N = total number of pages
 * - OutDegree(B) = number of outgoing links from B
 * 
 * TIME COMPLEXITY: O(E * iterations) where E is number of edges
 * SPACE COMPLEXITY: O(N) for storing PageRank values
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class PageRank {
    
    // Damping factor (probability of following a link vs random jump)
    private static final double DAMPING_FACTOR = 0.85;
    
    // Number of iterations to converge
    private static final int DEFAULT_ITERATIONS = 20;
    
    /**
     * Computes PageRank scores for all nodes in a directed graph.
     * 
     * @param graph A directed graph
     * @return Map from node ID to PageRank score
     */
    public static Map<String, Double> compute(Graph graph) {
        return compute(graph, DEFAULT_ITERATIONS);
    }
    
    /**
     * Computes PageRank with specified iterations.
     * 
     * @param graph      Directed graph
     * @param iterations Number of power iterations
     * @return PageRank scores
     */
    public static Map<String, Double> compute(Graph graph, int iterations) {
        
        // ========== INPUT VALIDATION ==========
        
        if (graph == null || graph.isEmpty()) {
            System.out.println("Error: Graph is null or empty");
            return Collections.emptyMap();
        }
        
        Set<String> nodes = graph.getAllNodes();
        int n = nodes.size();
        
        // ========== INITIALIZATION ==========
        
        // Start with equal probability for all nodes
        Map<String, Double> pageRank = new HashMap<>();
        double initialRank = 1.0 / n;
        
        for (String node : nodes) {
            pageRank.put(node, initialRank);
        }
        
        // Build incoming links map (who links TO each node)
        Map<String, List<String>> incomingLinks = new HashMap<>();
        for (String node : nodes) {
            incomingLinks.put(node, new ArrayList<>());
        }
        
        // Build outgoing degree map
        Map<String, Integer> outDegree = new HashMap<>();
        for (String node : nodes) {
            List<String> neighbors = graph.getNeighbors(node);
            outDegree.put(node, neighbors.size());
            
            // Record incoming links
            for (String neighbor : neighbors) {
                incomingLinks.get(neighbor).add(node);
            }
        }
        
        // ========== POWER ITERATION ==========
        
        for (int iter = 0; iter < iterations; iter++) {
            Map<String, Double> newRank = new HashMap<>();
            
            // Calculate new PageRank for each node
            for (String node : nodes) {
                double rankSum = 0.0;
                
                // Sum contributions from all incoming links
                for (String inLink : incomingLinks.get(node)) {
                    int outDeg = outDegree.get(inLink);
                    if (outDeg > 0) {
                        // Each incoming link contributes its PR / its out-degree
                        rankSum += pageRank.get(inLink) / outDeg;
                    }
                }
                
                // Apply PageRank formula
                // (1-d)/n is the random jump probability
                // d * rankSum is the link-following probability
                double newPR = (1 - DAMPING_FACTOR) / n + DAMPING_FACTOR * rankSum;
                newRank.put(node, newPR);
            }
            
            // Update all values
            pageRank = newRank;
        }
        
        return pageRank;
    }
    
    /**
     * Returns nodes sorted by PageRank (highest first).
     */
    public static List<Map.Entry<String, Double>> getSortedRanks(
            Map<String, Double> pageRank) {
        
        List<Map.Entry<String, Double>> sorted = new ArrayList<>(pageRank.entrySet());
        sorted.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        return sorted;
    }
    
    /**
     * Pretty-prints the PageRank results.
     */
    public static void printRanks(Map<String, Double> pageRank) {
        System.out.println("\\n=== PageRank Results ===");
        
        List<Map.Entry<String, Double>> sorted = getSortedRanks(pageRank);
        int rank = 1;
        
        for (Map.Entry<String, Double> entry : sorted) {
            System.out.printf("%d. %s: %.6f%n", 
                rank++, entry.getKey(), entry.getValue());
        }
    }
}`,

  'ShortestPathBFS.java': `/**
 * ShortestPathBFS.java - BFS for Unweighted Shortest Path
 * 
 * WHAT IS BFS SHORTEST PATH?
 * =========================
 * In an unweighted graph (all edges have equal cost), BFS naturally
 * finds the shortest path because it explores nodes level by level.
 * 
 * Level 0: Start node
 * Level 1: All nodes 1 edge away
 * Level 2: All nodes 2 edges away
 * ...and so on
 * 
 * The first time we reach the target, we've found the shortest path!
 * 
 * WHY BFS WORKS:
 * Since all edges have equal weight, the first path found to any node
 * is guaranteed to be the shortest (in terms of number of edges).
 * 
 * TIME COMPLEXITY: O(V + E)
 * SPACE COMPLEXITY: O(V) for the queue and visited set
 * 
 * @author Algorithm Visualizer
 */

import java.util.*;

public class ShortestPathBFS {
    
    /**
     * Finds the shortest path in an unweighted graph.
     * 
     * @param graph  Unweighted graph
     * @param source Starting node
     * @param target Destination node
     * @return Shortest path as list of nodes, or empty if no path
     */
    public static List<String> findShortestPath(
            Graph graph, 
            String source, 
            String target) {
        
        // ========== INPUT VALIDATION ==========
        
        if (graph == null || graph.isEmpty()) {
            System.out.println("Error: Graph is null or empty");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(source)) {
            System.out.println("Error: Source '" + source + "' not found");
            return Collections.emptyList();
        }
        
        if (!graph.hasNode(target)) {
            System.out.println("Error: Target '" + target + "' not found");
            return Collections.emptyList();
        }
        
        if (source.equals(target)) {
            return Collections.singletonList(source);
        }
        
        // ========== BFS SETUP ==========
        
        // Queue for BFS traversal (FIFO order)
        Queue<String> queue = new LinkedList<>();
        
        // Track visited nodes and their parents for path reconstruction
        Map<String, String> parent = new HashMap<>();
        
        // Start from source
        queue.add(source);
        parent.put(source, null);  // Source has no parent
        
        // ========== BFS TRAVERSAL ==========
        
        while (!queue.isEmpty()) {
            // Dequeue front node
            String current = queue.poll();
            
            // Explore all neighbors
            for (String neighbor : graph.getNeighbors(current)) {
                
                // Skip if already visited
                if (parent.containsKey(neighbor)) {
                    continue;
                }
                
                // Mark as visited with parent
                parent.put(neighbor, current);
                
                // *** FOUND TARGET! ***
                if (neighbor.equals(target)) {
                    return reconstructPath(target, parent);
                }
                
                // Add to queue for later exploration
                queue.add(neighbor);
            }
        }
        
        // Queue empty, target never found
        System.out.println("No path exists between '" + source + "' and '" + target + "'");
        return Collections.emptyList();
    }
    
    /**
     * Reconstructs the path by following parent pointers.
     * 
     * @param target  The destination node
     * @param parent  Map of node -> parent
     * @return Path from source to target
     */
    private static List<String> reconstructPath(
            String target, 
            Map<String, String> parent) {
        
        LinkedList<String> path = new LinkedList<>();
        String current = target;
        
        // Trace back from target to source
        while (current != null) {
            path.addFirst(current);  // Prepend to maintain order
            current = parent.get(current);
        }
        
        System.out.println("Shortest path found! Length: " + (path.size() - 1) + " edges");
        return path;
    }
    
    /**
     * Finds shortest distance (number of edges) without full path.
     * More efficient when you only need the distance.
     */
    public static int findShortestDistance(Graph graph, String source, String target) {
        if (graph == null || !graph.hasNode(source) || !graph.hasNode(target)) {
            return -1;
        }
        
        if (source.equals(target)) {
            return 0;
        }
        
        Queue<String> queue = new LinkedList<>();
        Map<String, Integer> distance = new HashMap<>();
        
        queue.add(source);
        distance.put(source, 0);
        
        while (!queue.isEmpty()) {
            String current = queue.poll();
            int currentDist = distance.get(current);
            
            for (String neighbor : graph.getNeighbors(current)) {
                if (!distance.containsKey(neighbor)) {
                    int neighborDist = currentDist + 1;
                    distance.put(neighbor, neighborDist);
                    
                    if (neighbor.equals(target)) {
                        return neighborDist;
                    }
                    
                    queue.add(neighbor);
                }
            }
        }
        
        return -1;  // No path exists
    }
}`,

  'Main.java': `/**
 * Main.java - Demo and Test Runner
 * 
 * This file demonstrates all the graph algorithms with example graphs.
 * Run this to see the algorithms in action!
 * 
 * @author Algorithm Visualizer
 */

public class Main {
    
    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════════════════════╗");
        System.out.println("║          GRAPH ALGORITHMS DEMONSTRATION                   ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝\\n");
        
        // Create sample undirected graph
        // 
        //     A ------- B
        //     |\\       /|
        //     | \\     / |
        //     |  \\   /  |
        //     |   \\ /   |
        //     C----D----E
        //     
        Graph undirectedGraph = new Graph(false);
        undirectedGraph.addEdge("A", "B");
        undirectedGraph.addEdge("A", "C");
        undirectedGraph.addEdge("A", "D");
        undirectedGraph.addEdge("B", "D");
        undirectedGraph.addEdge("B", "E");
        undirectedGraph.addEdge("C", "D");
        undirectedGraph.addEdge("D", "E");
        
        System.out.println("Sample Undirected Graph:");
        System.out.println(undirectedGraph);
        
        // ========== TEST BIDIRECTIONAL SEARCH ==========
        System.out.println("\\n--- BIDIRECTIONAL BFS ---");
        System.out.println("Finding path from A to E:");
        java.util.List<String> biPath = BidirectionalSearch.findPath(undirectedGraph, "A", "E");
        System.out.println("Result: " + biPath);
        
        // ========== TEST BFS SHORTEST PATH ==========
        System.out.println("\\n--- BFS SHORTEST PATH ---");
        System.out.println("Finding shortest path from A to E:");
        java.util.List<String> bfsPath = ShortestPathBFS.findShortestPath(undirectedGraph, "A", "E");
        System.out.println("Result: " + bfsPath);
        
        // ========== TEST DFS ==========
        System.out.println("\\n--- DEPTH-FIRST SEARCH ---");
        System.out.println("Finding path from A to E (may not be shortest):");
        java.util.List<String> dfsPath = DepthFirstSearch.findPath(undirectedGraph, "A", "E");
        System.out.println("Result: " + dfsPath);
        
        // ========== TEST DIJKSTRA ==========
        System.out.println("\\n--- DIJKSTRA'S ALGORITHM ---");
        
        // Create weighted graph
        WeightedGraph weightedGraph = new WeightedGraph(false);
        weightedGraph.addEdge("A", "B", 4);
        weightedGraph.addEdge("A", "C", 2);
        weightedGraph.addEdge("B", "C", 1);
        weightedGraph.addEdge("B", "D", 5);
        weightedGraph.addEdge("C", "D", 8);
        weightedGraph.addEdge("C", "E", 10);
        weightedGraph.addEdge("D", "E", 2);
        
        System.out.println("Weighted Graph (edge weights shown):");
        System.out.println("A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2");
        System.out.println("\\nFinding shortest weighted path from A to E:");
        java.util.List<String> dijkstraPath = DijkstraAlgorithm.findShortestPath(weightedGraph, "A", "E");
        System.out.println("Result: " + dijkstraPath);
        
        // ========== TEST PAGERANK ==========
        System.out.println("\\n--- PAGERANK ALGORITHM ---");
        
        // Create directed graph (like web pages)
        Graph webGraph = new Graph(true);
        webGraph.addEdge("Home", "About");
        webGraph.addEdge("Home", "Products");
        webGraph.addEdge("Home", "Blog");
        webGraph.addEdge("About", "Home");
        webGraph.addEdge("About", "Contact");
        webGraph.addEdge("Products", "Home");
        webGraph.addEdge("Products", "Contact");
        webGraph.addEdge("Blog", "Home");
        webGraph.addEdge("Blog", "Products");
        webGraph.addEdge("Contact", "Home");
        
        System.out.println("Web-like Directed Graph:");
        System.out.println(webGraph);
        System.out.println("Computing PageRank...");
        java.util.Map<String, Double> ranks = PageRank.compute(webGraph, 20);
        PageRank.printRanks(ranks);
        
        // ========== TEST EDGE CASES ==========
        System.out.println("\\n--- EDGE CASE TESTS ---");
        
        // Test: Node not found
        System.out.println("\\nTest: Source not in graph");
        BidirectionalSearch.findPath(undirectedGraph, "X", "E");
        
        // Test: Same source and target
        System.out.println("\\nTest: Source equals target");
        java.util.List<String> samePath = BidirectionalSearch.findPath(undirectedGraph, "A", "A");
        System.out.println("Result: " + samePath);
        
        // Test: Disconnected graph
        System.out.println("\\nTest: Disconnected graph (no path)");
        Graph disconnected = new Graph(false);
        disconnected.addEdge("A", "B");
        disconnected.addEdge("C", "D");
        BidirectionalSearch.findPath(disconnected, "A", "D");
        
        System.out.println("\\n╔══════════════════════════════════════════════════════════╗");
        System.out.println("║                   ALL TESTS COMPLETE!                      ║");
        System.out.println("╚══════════════════════════════════════════════════════════╝");
    }
}`,

  'README.md': `# Graph Algorithms in Java

A comprehensive, well-documented implementation of fundamental graph algorithms designed for learning and understanding.

## 📚 What's Included

| Algorithm | Purpose | Time Complexity |
|-----------|---------|-----------------|
| **Bidirectional BFS** | Fastest shortest path for unweighted graphs | O(b^(d/2)) |
| **Dijkstra's Algorithm** | Shortest path for weighted graphs | O((V+E) log V) |
| **Depth-First Search** | Path finding, traversal | O(V + E) |
| **BFS Shortest Path** | Shortest path in unweighted graphs | O(V + E) |
| **PageRank** | Node importance ranking | O(E × iterations) |

---

## 🧠 Understanding Bidirectional Search

### What Is It?

Bidirectional Search finds the shortest path by **searching from both ends simultaneously**:
- One search starts at the **source** and expands outward
- Another search starts at the **target** and expands backward
- When the two frontiers **meet in the middle**, the path is found

### Why Is It Faster?

Regular BFS explores nodes in expanding circles. With branching factor \`b\` and path length \`d\`:
- **Regular BFS**: ~O(b^d) nodes explored
- **Bidirectional**: ~O(2 × b^(d/2)) nodes explored

**Example**: If each node has 10 neighbors and path length is 6:
- Regular: 10^6 = 1,000,000 nodes
- Bidirectional: 2 × 10^3 = 2,000 nodes (**500x faster!**)

### Step-by-Step Process

\`\`\`
STEP 1: Initialize
  - Create forward queue with source
  - Create backward queue with target
  - Create visited sets for each direction

STEP 2: Alternate Expansion
  - Expand forward frontier by one BFS level
  - Check if any forward node appears in backward visited
  - Expand backward frontier by one BFS level
  - Check if any backward node appears in forward visited

STEP 3: Intersection Found!
  - Trace path from source → meeting point (using forward parents)
  - Trace path from meeting point → target (using backward parents)
  - Combine into complete path
\`\`\`

---

## 📁 File Structure

\`\`\`
├── Graph.java              # Basic adjacency list representation
├── WeightedGraph.java      # Graph with edge weights
├── BidirectionalSearch.java # Bidirectional BFS implementation
├── DijkstraAlgorithm.java  # Weighted shortest path
├── DepthFirstSearch.java   # DFS with backtracking
├── ShortestPathBFS.java    # Standard BFS shortest path
├── PageRank.java           # Node importance ranking
├── Main.java               # Demo and test runner
└── README.md               # This documentation
\`\`\`

---

## ⚙️ Compilation & Execution

### Prerequisites
- Java 8 or higher
- Any terminal or IDE

### Compile All Files
\`\`\`bash
javac *.java
\`\`\`

### Run the Demo
\`\`\`bash
java Main
\`\`\`

---

## 📊 Input/Output Format

### Creating a Graph

\`\`\`java
// Undirected graph
Graph g = new Graph(false);
g.addEdge("A", "B");  // Automatically creates nodes

// Directed graph
Graph dg = new Graph(true);
dg.addEdge("Home", "About");  // One-way edge

// Weighted graph
WeightedGraph wg = new WeightedGraph(false);
wg.addEdge("A", "B", 5);  // Edge with weight 5
\`\`\`

### Finding Paths

\`\`\`java
// Returns: ["A", "D", "E"] or empty list if no path
List<String> path = BidirectionalSearch.findPath(graph, "A", "E");

// With Dijkstra (weighted)
List<String> shortest = DijkstraAlgorithm.findShortestPath(wgraph, "S", "T");
\`\`\`

### PageRank

\`\`\`java
Map<String, Double> ranks = PageRank.compute(graph, 20);
PageRank.printRanks(ranks);  // Pretty-prints sorted results
\`\`\`

---

## 🛡️ Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Null graph | Returns empty list with error message |
| Empty graph | Returns empty list with error message |
| Source not found | Returns empty list with error message |
| Target not found | Returns empty list with error message |
| Source = Target | Returns single-element list \`[source]\` |
| No path exists | Returns empty list (handles disconnected graphs) |

---

## 📈 Complexity Analysis

### Space Complexity

| Algorithm | Space |
|-----------|-------|
| Bidirectional BFS | O(V) - two visited sets |
| Dijkstra | O(V) - distances + priority queue |
| DFS | O(V) - recursion stack |
| PageRank | O(V) - rank values |

### When to Use Each

- **Bidirectional BFS**: Large unweighted graphs where you know the target
- **Dijkstra**: Weighted graphs (road networks, cost optimization)
- **DFS**: When any path works, memory is limited, or exploring all possibilities
- **PageRank**: Ranking nodes by importance/influence

---

## 🎓 Learning Path

1. **Start with \`Graph.java\`** - Understand how graphs are represented
2. **Read \`ShortestPathBFS.java\`** - Basic BFS traversal
3. **Study \`BidirectionalSearch.java\`** - The main algorithm
4. **Explore \`DijkstraAlgorithm.java\`** - Add weights
5. **Finish with \`PageRank.java\`** - Advanced ranking

Each file is thoroughly commented for beginners!

---

## 📝 License

MIT License - Free to use, modify, and distribute.

---

*Built with ❤️ by Algorithm Visualizer*
`
};
