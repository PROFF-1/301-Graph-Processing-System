package gui;

import model.Graph;

public class Utils {
    public static Graph createSampleGraph() {
        Graph g = new Graph();
        // Example: 6-node directed graph
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        g.addEdge(3, 4);
        g.addEdge(4, 5);
        g.addEdge(5, 0); // cycle
        return g;
    }
}
