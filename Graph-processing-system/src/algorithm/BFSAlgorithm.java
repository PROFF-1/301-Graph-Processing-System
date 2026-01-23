package algorithm;

import model.Vertex;
import model.Message;
import java.util.List;

public class BFSAlgorithm implements VertexComputation {
    private final int sourceId;
    public BFSAlgorithm(int sourceId) { this.sourceId = sourceId; }

    @Override
    public void compute(Vertex vertex, List<Message> incoming, MessageSender sender, int superstep) {
        if (superstep == 0 && vertex.getId() == sourceId) {
            vertex.setValue(0);
            for (int neighbor : vertex.getNeighbors())
                sender.send(new Message(neighbor, 1));
        } else {
            for (Message msg : incoming) {
                int dist = (int) msg.getPayload();
                if (dist < vertex.getValue()) {
                    vertex.setValue(dist);
                    for (int neighbor : vertex.getNeighbors())
                        sender.send(new Message(neighbor, dist + 1));
                }
            }
        }
    }
}
