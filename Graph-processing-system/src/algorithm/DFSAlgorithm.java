package algorithm;

import model.Vertex;
import model.Message;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

public class DFSAlgorithm implements VertexComputation {
    private final int sourceId;

    public DFSAlgorithm(int sourceId) {
        this.sourceId = sourceId;
    }

    @Override
    public void compute(Vertex vertex, List<Message> incoming, MessageSender sender, int superstep) {
        // Only start DFS from the source vertex at superstep 0
        if (superstep == 0 && vertex.getId() == sourceId) {
            dfs(vertex, sender, new HashSet<>());
        }
    }

    private void dfs(Vertex vertex, MessageSender sender, Set<Integer> visited) {
        if (visited.contains(vertex.getId())) return;
        visited.add(vertex.getId());
        vertex.setValue(1); // Mark as visited
        for (int neighborId : vertex.getNeighbors()) {
            sender.send(new Message(neighborId, 1));
        }
    }

    public String getName() {
        return "Depth-First Search (DFS)";
    }

    public String getDescription() {
        return "DFS explores as far as possible along each branch before backtracking. Useful for pathfinding and maze solving.";
    }
}
