package model;

import java.util.*;

public class Vertex {
    private final int id;
    private double value;
    private final List<Integer> neighbors = new ArrayList<>();
    private final Queue<Message> inbox = new LinkedList<>();
    private boolean active = true;

    public Vertex(int id) {
        this.id = id;
        this.value = Double.POSITIVE_INFINITY;
    }

    public int getId() { return id; }
    public double getValue() { return value; }
    public void setValue(double value) { this.value = value; }
    public List<Integer> getNeighbors() { return neighbors; }
    public void addNeighbor(int neighborId) { neighbors.add(neighborId); }
    public void receiveMessage(Message msg) { inbox.add(msg); }
    public void receiveMessages(List<Message> msgs) { inbox.addAll(msgs); }
    public List<Message> drainInbox() {
        List<Message> msgs = new ArrayList<>(inbox);
        inbox.clear();
        return msgs;
    }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
