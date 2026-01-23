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
    private final GraphView graphView;
    private Graph graph;
    private GraphProcessingEngine engine;
    private VertexComputation algorithm;
    private int sourceId = 0;

    public GraphController() {
        graph = Utils.createSampleGraph();
        algorithm = new BFSAlgorithm(sourceId);
        engine = new GraphProcessingEngine(graph, algorithm);
        graphView = new GraphView(graph, engine);
        rootPane.setCenter(graphView);
        rootPane.setBottom(controls);
        setupListeners();
    }

    private void setupListeners() {
        controls.startBtn.setOnAction(e -> startSimulation());
        controls.pauseBtn.setOnAction(e -> pauseSimulation());
        controls.resetBtn.setOnAction(e -> resetSimulation());
        controls.algoBox.setOnAction(e -> switchAlgorithm());
        controls.speedSlider.valueProperty().addListener((obs, oldVal, newVal) -> graphView.setSpeed(newVal.intValue()));
    }

    private void startSimulation() { graphView.startAnimation(); }
    private void pauseSimulation() { graphView.pauseAnimation(); }
    private void resetSimulation() {
        graph = Utils.createSampleGraph();
        String algo = controls.algoBox.getValue();
        if ("BFS".equals(algo)) algorithm = new BFSAlgorithm(sourceId);
        else algorithm = new PageRankAlgorithm(graph.getVertices().size());
        engine = new GraphProcessingEngine(graph, algorithm);
        graphView.setGraphAndEngine(graph, engine);
        graphView.reset();
    }
    private void switchAlgorithm() { resetSimulation(); }
    public BorderPane getRootPane() { return rootPane; }
}
