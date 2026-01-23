package model;

import java.util.*;

public class Graph {
    private final Map<Integer, Vertex> vertices = new HashMap<>();
    private final List<Edge> edges = new ArrayList<>();

    public void addVertex(int id) {
        vertices.putIfAbsent(id, new Vertex(id));
    }
    public void addEdge(int from, int to) {
        addVertex(from);
        addVertex(to);
        edges.add(new Edge(from, to));
        vertices.get(from).addNeighbor(to);
    }
    public Vertex getVertex(int id) { return vertices.get(id); }
    public Collection<Vertex> getVertices() { return vertices.values(); }
    public List<Edge> getEdges() { return edges; }
    public void resetValues(double value) {
        for (Vertex v : vertices.values()) v.setValue(value);
    }
}
