import algorithm.BidirectionalSearch;
import java.util.*;

public class TestBidirectionalSearch {
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D"));
        graph.put("C", Arrays.asList("A", "D"));
        graph.put("D", Arrays.asList("B", "C", "E"));
        graph.put("E", Arrays.asList("D"));

        // Example 1: Path exists
        List<String> path = BidirectionalSearch.findShortestPath(graph, "A", "E");
        System.out.println("Path from A to E: " + path); // Output: [A, B, D, E]

        // Example 2: Source equals target
        List<String> path2 = BidirectionalSearch.findShortestPath(graph, "A", "A");
        System.out.println("Path from A to A: " + path2); // Output: [A]

        // Example 3: No path exists
        List<String> path3 = BidirectionalSearch.findShortestPath(graph, "A", "Z");
        System.out.println("Path from A to Z: " + path3); // Output: [] (with error message)
    }
}
