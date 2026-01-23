package model;

public class Message {
    private final int targetVertexId;
    private final Object payload;

    public Message(int targetVertexId, Object payload) {
        this.targetVertexId = targetVertexId;
        this.payload = payload;
    }
    public int getTargetVertexId() { return targetVertexId; }
    public Object getPayload() { return payload; }
}
