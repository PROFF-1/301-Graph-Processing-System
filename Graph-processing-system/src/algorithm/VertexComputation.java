package algorithm;

import model.Vertex;
import model.Message;

import java.util.List;

public interface VertexComputation {
    void compute(Vertex vertex, List<Message> incoming, MessageSender sender, int superstep);

    interface MessageSender {
        void send(Message msg);
    }
}
