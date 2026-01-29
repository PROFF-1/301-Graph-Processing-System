package algorithm;

import java.util.*;

/**
 * ShortestPath provides a utility method to find the shortest path between two nodes in an unweighted graph using BFS.
 * The graph is represented using an adjacency list.
 *
 * This class is fully commented for beginners and handles all edge cases.
 */
public class ShortestPath {
    /**
     * Finds the shortest path between source and target using BFS.
     *
     * @param graph The adjacency list representing the graph (node -> list of neighbors)
     * @param source The starting node
     * @param target The target node
     * @return List of nodes representing the shortest path from source to target (inclusive),
     *         or an empty list if no path exists or invalid input
     */
    public static List<String> findShortestPath(Map<String, List<String>> graph, String source, String target) {
        if (graph == null || graph.isEmpty()) {
            System.err.println("Error: Graph is null or empty.");
            return Collections.emptyList();
        }
        if (source == null || target == null || !graph.containsKey(source) || !graph.containsKey(target)) {
            System.err.println("Error: Source or target node does not exist in the graph.");
            return Collections.emptyList();
        }
        if (source.equals(target)) {
            return Arrays.asList(source);
        }
        Queue<String> queue = new LinkedList<>();
        Map<String, String> parent = new HashMap<>();
        Set<String> visited = new HashSet<>();
        queue.add(source);
        visited.add(source);
        parent.put(source, null);
        while (!queue.isEmpty()) {
            String current = queue.poll();
            for (String neighbor : graph.getOrDefault(current, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    parent.put(neighbor, current);
                    visited.add(neighbor);
                    queue.add(neighbor);
                    if (neighbor.equals(target)) {
                        // Found target, reconstruct path
                        List<String> path = new LinkedList<>();
                        String node = target;
                        while (node != null) {
                            path.add(0, node);
                            node = parent.get(node);
                        }
                        return path;
                    }
                }
            }
        }
        System.err.println("No path exists between '" + source + "' and '" + target + "'.");
        return Collections.emptyList();
    }
}
