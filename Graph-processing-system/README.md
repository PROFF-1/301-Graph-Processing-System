
# Bidirectional Search and Graph Algorithms in Java

## What is Bidirectional Search?
Bidirectional Search is an efficient algorithm for finding the shortest path between two nodes in an unweighted graph. Instead of searching from the source to the target in one direction, it simultaneously searches from both the source and the target. The two searches meet in the middle, which can significantly reduce the number of nodes explored compared to a standard Breadth-First Search (BFS).

## How the Algorithm Works (Step-by-Step)
1. **Initialization**: Start two BFS traversals—one from the source node and one from the target node.
2. **Alternate Expansion**: At each step, expand one level from the source side, then one from the target side.
3. **Intersection Detection**: If a node is visited by both searches, the searches have met. This node is the intersection point.
4. **Path Reconstruction**: Trace back from the intersection node to both the source and the target using parent pointers, then combine the two paths to get the full shortest path.
5. **Edge Cases**: If the source or target does not exist, or if no path exists, the algorithm returns an empty path and prints an error message.

## Implementation Design
- **Graph Representation**: The graph is represented as an adjacency list (`Map<String, List<String>>`).
- **BidirectionalSearch**: Contains the static method `findShortestPath` for bidirectional BFS.
- **Other Algorithms**: Classic implementations of PageRank, Dijkstra, DFS, and a BFS-based shortest path utility are also provided for educational purposes.
- **Edge Case Handling**: All algorithms check for null/empty graphs, missing nodes, and disconnected graphs, and provide meaningful error messages.

## Input Format and Example Inputs
- **Graph**: Adjacency list, e.g.:
	```java
	Map<String, List<String>> graph = new HashMap<>();
	graph.put("A", Arrays.asList("B", "C"));
	graph.put("B", Arrays.asList("A", "D"));
	graph.put("C", Arrays.asList("A", "D"));
	graph.put("D", Arrays.asList("B", "C", "E"));
	graph.put("E", Arrays.asList("D"));
	```
- **Source/Target**: Node labels as strings, e.g., `"A"`, `"E"`.

## Output Format and Example Outputs
- **Output**: List of node labels representing the shortest path, e.g.:
	```java
	[A, B, D, E]
	```
- **No Path**: Returns an empty list and prints an error message.

## Example Test Cases
```java
// Example 1: Path exists
List<String> path = BidirectionalSearch.findShortestPath(graph, "A", "E");
System.out.println(path); // Output: [A, B, D, E]

// Example 2: Source equals target
List<String> path2 = BidirectionalSearch.findShortestPath(graph, "A", "A");
System.out.println(path2); // Output: [A]

// Example 3: No path exists
List<String> path3 = BidirectionalSearch.findShortestPath(graph, "A", "Z");
System.out.println(path3); // Output: [] (with error message)
```

## Time and Space Complexity Analysis
- **Time Complexity**: O(b^(d/2)), where b is the branching factor and d is the shortest path length. This is much faster than O(b^d) for standard BFS in large graphs.
- **Space Complexity**: O(b^(d/2)), for storing visited nodes and parent pointers from both directions.

## How Invalid Inputs and Edge Cases are Handled
- **Null or Empty Graph**: Returns empty path, prints error.
- **Missing Source/Target**: Returns empty path, prints error.
- **Source Equals Target**: Returns a single-node path.
- **No Path Exists**: Returns empty path, prints error.

## How to Compile and Run the Program
1. **Compile**:
	 ```sh
	 javac -d bin src/algorithm/*.java
	 ```
2. **Run**:
	 Create a test class (e.g., `TestBidirectionalSearch.java`) in the `src` folder:
	 ```java
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
					 System.out.println(BidirectionalSearch.findShortestPath(graph, "A", "E"));
			 }
	 }
	 ```
	 Compile and run:
	 ```sh
	 javac -d bin src/TestBidirectionalSearch.java
	 java -cp bin TestBidirectionalSearch
	 ```

## Additional Algorithms Included
- **PageRankAlgorithm**: Computes PageRank scores for all nodes.
- **DijkstraAlgorithm**: Finds shortest paths in weighted graphs.
- **DFSAlgorithm**: Performs depth-first traversal.
- **ShortestPath**: Utility for BFS-based shortest path in unweighted graphs.

---

For questions or improvements, see the code comments for guidance. All algorithms are designed for clarity and educational value.
