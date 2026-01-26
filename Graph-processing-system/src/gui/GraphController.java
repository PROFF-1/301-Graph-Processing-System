package gui;

import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.scene.control.Label;
import model.*;
import algorithm.*;
import engine.*;

public class GraphController {
    private final BorderPane rootPane = new BorderPane();
    private final ControlsPane controls = new ControlsPane();
    private final VBox rightPane = new VBox();
    private final Label algoDescriptionLabel = new Label();
    private final GraphView graphView;
    private Graph graph;
    private GraphProcessingEngine engine;
    private VertexComputation algorithm;
    private int sourceId = 0;

    public GraphController() {
        graph = Utils.createGraphByName(controls.graphBox.getValue());
        algorithm = getAlgorithmByName(controls.algoBox.getValue());
        engine = new GraphProcessingEngine(graph, algorithm);
        graphView = new GraphView(graph, engine);
        rootPane.setCenter(graphView);
        setupRightPane();
        rootPane.setRight(rightPane);
        rootPane.setBottom(controls);
        setupListeners();
        updateAlgorithmDescription();
    }

    private void setupRightPane() {
        rightPane.setSpacing(10);
        rightPane.setPadding(new javafx.geometry.Insets(10));
        rightPane.getChildren().addAll(new Label("Algorithm Description:"), algoDescriptionLabel);
        algoDescriptionLabel.setWrapText(true);
        algoDescriptionLabel.setMaxWidth(200);
    }

    private void setupListeners() {
        controls.startBtn.setOnAction(e -> startSimulation());
        controls.pauseBtn.setOnAction(e -> pauseSimulation());
        controls.resetBtn.setOnAction(e -> resetSimulation());
        controls.algoBox.setOnAction(e -> switchAlgorithm());
        controls.graphBox.setOnAction(e -> switchGraph());
        controls.speedSlider.valueProperty().addListener((obs, oldVal, newVal) -> graphView.setSpeed(newVal.intValue()));
    }

    private void startSimulation() { graphView.startAnimation(); }
    private void pauseSimulation() { graphView.pauseAnimation(); }

    private void resetSimulation() {
        graph = Utils.createGraphByName(controls.graphBox.getValue());
        algorithm = getAlgorithmByName(controls.algoBox.getValue());
        engine = new GraphProcessingEngine(graph, algorithm);
        graphView.setGraphAndEngine(graph, engine);
        graphView.reset();
        updateAlgorithmDescription();
    }

    private void switchAlgorithm() { resetSimulation(); }
    private void switchGraph() { resetSimulation(); }

    private VertexComputation getAlgorithmByName(String name) {
        switch (name) {
            case "BFS":
                return new BFSAlgorithm(sourceId);
            case "DFS":
                return new DFSAlgorithm(sourceId);
            case "Dijkstra":
                return new DijkstraAlgorithm(sourceId);
            case "PageRank":
                return new PageRankAlgorithm(graph.getVertices().size());
            default:
                return new BFSAlgorithm(sourceId);
        }
    }

    private void updateAlgorithmDescription() {
        String algo = controls.algoBox.getValue();
        String desc = "";
        switch (algo) {
            case "BFS":
                desc = "Breadth-First Search (BFS) explores the graph level by level, useful for finding shortest paths in unweighted graphs.";
                break;
            case "DFS":
                desc = "Depth-First Search (DFS) explores as far as possible along each branch before backtracking. Useful for pathfinding and maze solving.";
                break;
            case "Dijkstra":
                desc = "Dijkstra's algorithm finds the shortest path from a starting vertex to all other vertices in a weighted graph.";
                break;
            case "PageRank":
                desc = "PageRank measures the importance of each node in a graph, originally used by Google Search.";
                break;
        }
        algoDescriptionLabel.setText(desc);
    }

    public BorderPane getRootPane() { return rootPane; }
}
