package gui;

import model.Graph;

public class Utils {
    public static Graph createSampleGraph() {
        return createGraphByName("Simple");
    }

    public static Graph createGraphByName(String name) {
        switch (name) {
            case "Simple":
                return createSimpleGraph();
            case "Tree":
                return createTreeGraph();
            case "Cycle":
                return createCycleGraph();
            case "Maze":
                return createMazeGraph();
            default:
                return createSimpleGraph();
        }
    }

    private static Graph createSimpleGraph() {
        Graph g = new Graph();
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(2, 3);
        g.addEdge(3, 4);
        g.addEdge(4, 5);
        g.addEdge(5, 0); // cycle
        return g;
    }

    private static Graph createTreeGraph() {
        Graph g = new Graph();
        g.addEdge(0, 1);
        g.addEdge(0, 2);
        g.addEdge(1, 3);
        g.addEdge(1, 4);
        g.addEdge(2, 5);
        g.addEdge(2, 6);
        return g;
    }

    private static Graph createCycleGraph() {
        Graph g = new Graph();
        g.addEdge(0, 1);
        g.addEdge(1, 2);
        g.addEdge(2, 3);
        g.addEdge(3, 4);
        g.addEdge(4, 0);
        return g;
    }

    private static Graph createMazeGraph() {
        Graph g = new Graph();
        // 3x3 maze (0-8), edges only where path exists
        g.addEdge(0, 1);
        g.addEdge(1, 2);
        g.addEdge(0, 3);
        g.addEdge(3, 4);
        g.addEdge(4, 5);
        g.addEdge(5, 8);
        g.addEdge(2, 5);
        g.addEdge(3, 6);
        g.addEdge(6, 7);
        g.addEdge(7, 8);
        return g;
    }
}
