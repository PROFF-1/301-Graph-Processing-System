package algorithm;

import model.Vertex;
import model.Message;
import java.util.List;

public class DijkstraAlgorithm implements VertexComputation {
    private final int sourceId;

    public DijkstraAlgorithm(int sourceId) {
        this.sourceId = sourceId;
    }

    @Override
    public void compute(Vertex vertex, List<Message> incoming, MessageSender sender, int superstep) {
        // Placeholder: Dijkstra's algorithm is not message-passing friendly, but for demo, mark source as 0 and neighbors as 1
        if (superstep == 0 && vertex.getId() == sourceId) {
            vertex.setValue(0);
            for (int neighbor : vertex.getNeighbors()) {
                sender.send(new Message(neighbor, 1));
            }
        } else {
            for (Message msg : incoming) {
                int dist = (int) msg.getPayload();
                if (dist < vertex.getValue()) {
                    vertex.setValue(dist);
                    for (int neighbor : vertex.getNeighbors()) {
                        sender.send(new Message(neighbor, dist + 1));
                    }
                }
            }
        }
    }

    public String getName() {
        return "Dijkstra's Algorithm";
    }

    public String getDescription() {
        return "Dijkstra's algorithm finds the shortest path from a starting vertex to all other vertices in a weighted graph. (Note: This is a simplified demo for message-passing systems.)";
    }
}
