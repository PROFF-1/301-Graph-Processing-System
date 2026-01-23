package engine;

import model.*;
import algorithm.VertexComputation;
import java.util.*;

public class GraphProcessingEngine {
    private final Graph graph;
    private final VertexComputation algorithm;
    private int superstep = 0;
    private boolean running = false;
    private final List<Map<Integer, List<Message>>> messageHistory = new ArrayList<>();

    public GraphProcessingEngine(Graph graph, VertexComputation algorithm) {
        this.graph = graph;
        this.algorithm = algorithm;
    }

    public void step() {
        Map<Integer, List<Message>> messages = new HashMap<>();
        for (Vertex v : graph.getVertices()) {
            List<Message> incoming = v.drainInbox();
            algorithm.compute(v, incoming, (msg) -> {
                messages.computeIfAbsent(msg.getTargetVertexId(), k -> new ArrayList<>()).add(msg);
            }, superstep);
        }
        for (Map.Entry<Integer, List<Message>> entry : messages.entrySet()) {
            Vertex target = graph.getVertex(entry.getKey());
            if (target != null) target.receiveMessages(entry.getValue());
        }
        messageHistory.add(messages);
        superstep++;
    }

    public void reset() {
        superstep = 0;
        messageHistory.clear();
        for (Vertex v : graph.getVertices()) {
            v.setValue(Double.POSITIVE_INFINITY);
            v.drainInbox();
            v.setActive(true);
        }
    }

    public int getSuperstep() { return superstep; }
    public boolean isRunning() { return running; }
    public void setRunning(boolean running) { this.running = running; }
    public Graph getGraph() { return graph; }
    public List<Map<Integer, List<Message>>> getMessageHistory() { return messageHistory; }
}
