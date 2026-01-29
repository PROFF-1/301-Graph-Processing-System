package gui;

import javafx.animation.*;
import javafx.scene.layout.Pane;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Line;
import javafx.scene.text.Text;
import model.*;
import engine.*;
import java.util.*;

public class GraphView extends Pane {
    private Graph graph;
    private GraphProcessingEngine engine;
    private int speed = 500;
    private Timeline timeline;
    private final Map<Integer, Circle> vertexNodes = new HashMap<>();
    private final Map<Integer, Text> vertexLabels = new HashMap<>();
    private final List<Line> edgeLines = new ArrayList<>();
    private final double RADIUS = 32;
    private final double CENTER_X = 500, CENTER_Y = 350, CIRCLE_RADIUS = 260;

    public GraphView(Graph graph, GraphProcessingEngine engine) {
        setPrefSize(1000, 700);
        setStyle("-fx-background-color: #18191c;");
        setGraphAndEngine(graph, engine);
    }

    public void setGraphAndEngine(Graph graph, GraphProcessingEngine engine) {
        this.graph = graph;
        this.engine = engine;
        drawGraph();
    }

    public void setSpeed(int speed) { this.speed = speed; if (timeline != null) timeline.setRate(500.0 / speed); }

    public void startAnimation() {
        if (timeline != null) timeline.stop();
        timeline = new Timeline(new KeyFrame(javafx.util.Duration.millis(speed), e -> {
            engine.step();
            updateGraph();
        }));
        timeline.setCycleCount(Animation.INDEFINITE);
        timeline.play();
    }

    public void pauseAnimation() { if (timeline != null) timeline.pause(); }
    public void reset() { drawGraph(); }

    private void drawGraph() {
        getChildren().clear();
        vertexNodes.clear();
        vertexLabels.clear();
        edgeLines.clear();
        int n = graph.getVertices().size();
        List<Vertex> vertices = new ArrayList<>(graph.getVertices());
        for (int i = 0; i < n; i++) {
            double angle = 2 * Math.PI * i / n;
            double x = CENTER_X + CIRCLE_RADIUS * Math.cos(angle);
            double y = CENTER_Y + CIRCLE_RADIUS * Math.sin(angle);
            Vertex v = vertices.get(i);
            Circle circle = new Circle(x, y, RADIUS, Color.web("#23242a"));
            circle.setStroke(Color.web("#e0c28c"));
            circle.setStrokeWidth(3);
            circle.setEffect(new javafx.scene.effect.DropShadow(18, Color.web("#e0c28c")));
            // Use single-letter labels (A, B, ...)
            String labelStr = String.valueOf((char)('A' + v.getId()));
            Text label = new Text(x - 10, y + 5, labelStr);
            label.setFill(Color.web("#e0c28c"));
            label.setStyle("-fx-font-size: 22px; -fx-font-weight: bold;");
            vertexNodes.put(v.getId(), circle);
            vertexLabels.put(v.getId(), label);
            getChildren().addAll(circle, label);
        }
        for (Edge e : graph.getEdges()) {
            Circle from = vertexNodes.get(e.getFrom());
            Circle to = vertexNodes.get(e.getTo());
            if (from != null && to != null) {
                Line line = new Line(from.getCenterX(), from.getCenterY(), to.getCenterX(), to.getCenterY());
                line.setStroke(Color.web("#e0c28c"));
                line.setStrokeWidth(2.5);
                edgeLines.add(line);
                getChildren().add(0, line);
            }
        }
    }

    private void updateGraph() {
        for (Vertex v : graph.getVertices()) {
            Circle circle = vertexNodes.get(v.getId());
            if (circle != null) {
                // Highlight active node with glow
                if (v.isActive()) {
                    circle.setFill(Color.web("#e0c28c"));
                    circle.setEffect(new javafx.scene.effect.DropShadow(32, Color.web("#ffe7b0")));
                } else {
                    circle.setFill(Color.web("#23242a"));
                    circle.setEffect(new javafx.scene.effect.DropShadow(18, Color.web("#e0c28c")));
                }
            }
        }
    }
}
