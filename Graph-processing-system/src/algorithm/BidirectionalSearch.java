package algorithm;

import java.util.*;

/**
 * BidirectionalSearch implements the Bidirectional Breadth-First Search (BFS) algorithm
 * to find the shortest path between a source and a target node in an unweighted graph.
 * The graph is represented using an adjacency list.
 *
 * This class is fully commented for beginners and handles all edge cases.
 */
public class BidirectionalSearch {
    /**
     * Finds the shortest path between source and target using Bidirectional BFS.
     *
     * @param graph The adjacency list representing the graph (node -> list of neighbors)
     * @param source The starting node
     * @param target The target node
     * @return List of nodes representing the shortest path from source to target (inclusive),
     *         or an empty list if no path exists or invalid input
     */
    public static List<String> findShortestPath(Map<String, List<String>> graph, String source, String target) {
        // Handle null or empty graph
        if (graph == null || graph.isEmpty()) {
            System.err.println("Error: Graph is null or empty.");
            return Collections.emptyList();
        }
        // Handle null or missing nodes
        if (source == null || target == null || !graph.containsKey(source) || !graph.containsKey(target)) {
            System.err.println("Error: Source or target node does not exist in the graph.");
            return Collections.emptyList();
        }
        // Handle source equals target
        if (source.equals(target)) {
            return Arrays.asList(source);
        }

        // Initialize visited and parent maps for both searches
        Set<String> visitedFromSource = new HashSet<>();
        Set<String> visitedFromTarget = new HashSet<>();
        Map<String, String> parentFromSource = new HashMap<>();
        Map<String, String> parentFromTarget = new HashMap<>();

        Queue<String> queueSource = new LinkedList<>();
        Queue<String> queueTarget = new LinkedList<>();

        queueSource.add(source);
        visitedFromSource.add(source);
        parentFromSource.put(source, null);

        queueTarget.add(target);
        visitedFromTarget.add(target);
        parentFromTarget.put(target, null);

        // Perform BFS from both ends
        while (!queueSource.isEmpty() && !queueTarget.isEmpty()) {
            // Expand from source side
            String meetNode = bfsStep(graph, queueSource, visitedFromSource, visitedFromTarget, parentFromSource);
            if (meetNode != null) {
                return buildPath(meetNode, parentFromSource, parentFromTarget);
            }
            // Expand from target side
            meetNode = bfsStep(graph, queueTarget, visitedFromTarget, visitedFromSource, parentFromTarget);
            if (meetNode != null) {
                return buildPath(meetNode, parentFromSource, parentFromTarget);
            }
        }
        // No path found
        System.err.println("No path exists between '" + source + "' and '" + target + "'.");
        return Collections.emptyList();
    }

    /**
     * Performs one step of BFS from one side.
     * @return The meeting node if found, otherwise null.
     */
    private static String bfsStep(Map<String, List<String>> graph, Queue<String> queue,
                                 Set<String> thisVisited, Set<String> otherVisited,
                                 Map<String, String> parent) {
        if (queue.isEmpty()) return null;
        String current = queue.poll();
        for (String neighbor : graph.getOrDefault(current, Collections.emptyList())) {
            if (!thisVisited.contains(neighbor)) {
                parent.put(neighbor, current);
                thisVisited.add(neighbor);
                queue.add(neighbor);
                if (otherVisited.contains(neighbor)) {
                    // Searches meet at neighbor
                    return neighbor;
                }
            }
        }
        return null;
    }

    /**
     * Builds the shortest path from source to target using parent maps.
     */
    private static List<String> buildPath(String meetNode, Map<String, String> parentFromSource, Map<String, String> parentFromTarget) {
        LinkedList<String> path = new LinkedList<>();
        // Trace path from source to meeting node
        String node = meetNode;
        while (node != null) {
            path.addFirst(node);
            node = parentFromSource.get(node);
        }
        // Trace path from meeting node to target (skip meetNode to avoid duplicate)
        node = parentFromTarget.get(meetNode);
        while (node != null) {
            path.addLast(node);
            node = parentFromTarget.get(node);
        }
        return path;
    }
}
