package algorithm;

import model.Vertex;
import model.Message;
import java.util.List;

public class PageRankAlgorithm implements VertexComputation {
    private static final double DAMPING = 0.85;
    private static final double EPSILON = 1e-6;
    private final int totalVertices;
    public PageRankAlgorithm(int totalVertices) { this.totalVertices = totalVertices; }

    @Override
    public void compute(Vertex vertex, List<Message> incoming, MessageSender sender, int superstep) {
        double sum = 0.0;
        if (superstep == 0) {
            vertex.setValue(1.0 / totalVertices);
        } else {
            for (Message msg : incoming)
                sum += (double) msg.getPayload();
            double newRank = (1 - DAMPING) / totalVertices + DAMPING * sum;
            if (Math.abs(newRank - vertex.getValue()) > EPSILON)
                vertex.setValue(newRank);
        }
        double outValue = vertex.getValue() / (vertex.getNeighbors().isEmpty() ? 1 : vertex.getNeighbors().size());
        for (int neighbor : vertex.getNeighbors())
            sender.send(new Message(neighbor, outValue));
    }
}
