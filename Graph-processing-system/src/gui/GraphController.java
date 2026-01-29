package gui;

import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.scene.control.Label;
import model.*;
import algorithm.*;
import engine.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import engine.BFSAnimationEngine;

public class GraphController {
    private final BorderPane rootPane = new BorderPane();
    private final ControlsPane controls = new ControlsPane();
    private final VBox rightPane = new VBox();
    private final Label algoDescriptionLabel = new Label();
    private Graph graph;
    private GraphView graphView;
    private BFSAnimationEngine bfsEngine;
    private int sourceId = 0;
    private int destId = 0;

    public GraphController() {
        graph = Utils.createGraphByName(controls.graphBox.getValue());
        graphView = new GraphView(graph);
        rootPane.setCenter(graphView);
        setupRightPane();
        rootPane.setRight(rightPane);
        rootPane.setLeft(controls);
        setupListeners();
        updateAlgorithmDescription();
        updateNodeAndEdgeBoxes();
        setupBFS();
    }

    private void setupRightPane() {
        rightPane.setSpacing(10);
        rightPane.setPadding(new javafx.geometry.Insets(10));
        rightPane.getChildren().addAll(new Label("Algorithm Description:"), algoDescriptionLabel);
        algoDescriptionLabel.setWrapText(true);
        algoDescriptionLabel.setMaxWidth(200);
    }

    private void setupListeners() {
        controls.runBtn.setOnAction(e -> startBFSAnimation());
        controls.pauseBtn.setOnAction(e -> { if (bfsEngine != null) bfsEngine.pause(); });
        controls.resetBtn.setOnAction(e -> resetSimulation());
        controls.algoBox.setOnAction(e -> switchAlgorithm());
        controls.graphBox.setOnAction(e -> switchGraph());
        controls.speedSlider.valueProperty().addListener((obs, oldVal, newVal) -> {
            if (bfsEngine != null) bfsEngine.setSpeed(newVal.intValue());
        });

        controls.addNodeBtn.setOnAction(e -> {
            String name = controls.nodeNameField.getText();
            if (name != null && !name.isEmpty()) {
                name = name.trim().toUpperCase();
                if (name.length() == 1 && name.charAt(0) >= 'A' && name.charAt(0) <= 'Z') {
                    int id = name.charAt(0) - 'A';
                    graph.addVertex(id);
                    updateNodeAndEdgeBoxes();
                    controls.nodeNameField.clear();
                }
            }
        });
        controls.removeNodeBtn.setOnAction(e -> {
            String name = controls.nodeNameField.getText();
            if (name != null && !name.isEmpty()) {
                name = name.trim().toUpperCase();
                if (name.length() == 1 && name.charAt(0) >= 'A' && name.charAt(0) <= 'Z') {
                    int id = name.charAt(0) - 'A';
                    graph.removeVertex(id);
                    updateNodeAndEdgeBoxes();
                    graphView.setGraph(graph);
                    controls.nodeNameField.clear();
                }
            }
        });
        controls.addEdgeBtn.setOnAction(e -> {
            String from = controls.edgeFromField.getText();
            String to = controls.edgeToField.getText();
            if (from != null && to != null && !from.isEmpty() && !to.isEmpty()) {
                from = from.trim().toUpperCase();
                to = to.trim().toUpperCase();
                if (from.length() == 1 && to.length() == 1 && from.charAt(0) >= 'A' && from.charAt(0) <= 'Z' && to.charAt(0) >= 'A' && to.charAt(0) <= 'Z') {
                    int fromId = from.charAt(0) - 'A';
                    int toId = to.charAt(0) - 'A';
                    graph.addEdge(fromId, toId);
                    updateNodeAndEdgeBoxes();
                    controls.edgeFromField.clear();
                    controls.edgeToField.clear();
                }
            }
        });
        controls.removeEdgeBtn.setOnAction(e -> {
            String from = controls.edgeFromField.getText();
            String to = controls.edgeToField.getText();
            if (from != null && to != null && !from.isEmpty() && !to.isEmpty()) {
                from = from.trim().toUpperCase();
                to = to.trim().toUpperCase();
                if (from.length() == 1 && to.length() == 1 && from.charAt(0) >= 'A' && from.charAt(0) <= 'Z' && to.charAt(0) >= 'A' && to.charAt(0) <= 'Z') {
                    int fromId = from.charAt(0) - 'A';
                    int toId = to.charAt(0) - 'A';
                    graph.removeEdge(fromId, toId);
                    updateNodeAndEdgeBoxes();
                    graphView.setGraph(graph);
                    controls.edgeFromField.clear();
                    controls.edgeToField.clear();
                }
            }
        });
        controls.sourceBox.setOnAction(e -> {
            String val = controls.sourceBox.getValue();
            if (val != null) {
                try { sourceId = Integer.parseInt(val); } catch (NumberFormatException ex) {}
            }
        });
        controls.destBox.setOnAction(e -> {
            String val = controls.destBox.getValue();
            if (val != null) {
                try { destId = Integer.parseInt(val); } catch (NumberFormatException ex) {}
            }
        });
    }

    private void startBFSAnimation() {
        if (bfsEngine == null) setupBFS();
        controls.logArea.clear();
        bfsEngine.reset();
        graphView.setBFSStateMachine(bfsEngine.getBFS());
        bfsEngine.setSpeed((int) controls.speedSlider.getValue());
        bfsEngine.setOnStep(v -> {
            graphView.updateBFSHighlight();
            updateLog();
        });
        bfsEngine.setOnFinish(v -> {
            graphView.updateBFSHighlight();
            updateLog();
        });
        bfsEngine.start();
    }

    private void resetSimulation() {
        graph = Utils.createGraphByName(controls.graphBox.getValue());
        graphView.setGraph(graph);
        updateAlgorithmDescription();
        updateNodeAndEdgeBoxes();
        controls.logArea.clear();
        setupBFS();
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

    private void updateNodeAndEdgeBoxes() {
        controls.sourceBox.getItems().clear();
        controls.destBox.getItems().clear();
        Map<String, Integer> labelToId = new HashMap<>();
        for (Vertex v : graph.getVertices()) {
            String label = String.valueOf((char)('A' + v.getId()));
            controls.sourceBox.getItems().add(label);
            controls.destBox.getItems().add(label);
            labelToId.put(label, v.getId());
        }
        if (!controls.sourceBox.getItems().isEmpty()) controls.sourceBox.setValue(controls.sourceBox.getItems().get(0));
        if (!controls.destBox.getItems().isEmpty()) controls.destBox.setValue(controls.destBox.getItems().get(0));
        controls.sourceBox.setUserData(labelToId);
        controls.destBox.setUserData(labelToId);
        try {
            Map<String, Integer> map = (Map<String, Integer>) controls.sourceBox.getUserData();
            sourceId = map.getOrDefault(controls.sourceBox.getValue(), 0);
            destId = map.getOrDefault(controls.destBox.getValue(), 0);
        } catch (Exception ignored) {}
    }

    private void setupBFS() {
        bfsEngine = new BFSAnimationEngine(graph, sourceId, destId);
        graphView.setBFSStateMachine(bfsEngine.getBFS());
        controls.sourceBox.setOnAction(e -> {
            String label = controls.sourceBox.getValue();
            Map<String, Integer> map = (Map<String, Integer>) controls.sourceBox.getUserData();
            if (label != null && map != null) sourceId = map.getOrDefault(label, 0);
        });
        controls.destBox.setOnAction(e -> {
            String label = controls.destBox.getValue();
            Map<String, Integer> map = (Map<String, Integer>) controls.destBox.getUserData();
            if (label != null && map != null) destId = map.getOrDefault(label, 0);
        });
    }

    private void updateLog() {
        List<String> log = bfsEngine.getBFS().getLog();
        controls.logArea.clear();
        for (String line : log) controls.logArea.appendText(line + "\n");
    }

    public BorderPane getRootPane() { return rootPane; }
}
