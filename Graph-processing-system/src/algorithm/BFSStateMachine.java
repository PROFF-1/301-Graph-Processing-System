package algorithm;

import model.Graph;
import model.Vertex;
import java.util.*;

/**
 * Step-driven BFS state machine for animation and visualization.
 */
public class BFSStateMachine {
    private final Graph graph;
    private final int sourceId;
    private final int destId;
    private final Queue<Integer> queue = new LinkedList<>();
    private final Set<Integer> visited = new HashSet<>();
    private final Map<Integer, Integer> parent = new HashMap<>();
    private Integer current = null;
    private boolean finished = false;
    private final List<String> log = new ArrayList<>();

    public BFSStateMachine(Graph graph, int sourceId, int destId) {
        this.graph = graph;
        this.sourceId = sourceId;
        this.destId = destId;
        reset();
    }

    public void reset() {
        queue.clear();
        visited.clear();
        parent.clear();
        log.clear();
        current = null;
        finished = false;
        if (graph.getVertex(sourceId) != null) {
            queue.add(sourceId);
            visited.add(sourceId);
            log.add("Starting BFS from: " + label(sourceId));
        }
    }

    public boolean isFinished() { return finished; }
    public Integer getCurrent() { return current; }
    public Set<Integer> getVisited() { return visited; }
    public Queue<Integer> getQueue() { return queue; }
    public List<String> getLog() { return log; }
    public Map<Integer, Integer> getParent() { return parent; }

    /**
     * Perform one BFS step. Returns true if a step was performed, false if finished.
     */
    public boolean step() {
        if (finished || queue.isEmpty()) {
            finished = true;
            return false;
        }
        current = queue.poll();
        log.add("Dequeued " + label(current));
        log.add("Visiting neighbors of " + label(current) + ": " + neighborLabels(current));
        Vertex v = graph.getVertex(current);
        if (v != null) {
            for (int neighbor : v.getNeighbors()) {
                if (!visited.contains(neighbor)) {
                    queue.add(neighbor);
                    visited.add(neighbor);
                    parent.put(neighbor, current);
                    log.add("Enqueued " + label(neighbor));
                    if (neighbor == destId) {
                        log.add("Destination " + label(destId) + " found!");
                        finished = true;
                        return false;
                    }
                }
            }
        }
        if (queue.isEmpty()) finished = true;
        return true;
    }

    private String label(int id) {
        return String.valueOf((char)('A' + id));
    }
    private String neighborLabels(int id) {
        Vertex v = graph.getVertex(id);
        if (v == null) return "-";
        List<String> labels = new ArrayList<>();
        for (int n : v.getNeighbors()) labels.add(label(n));
        return String.join(", ", labels);
    }
}
