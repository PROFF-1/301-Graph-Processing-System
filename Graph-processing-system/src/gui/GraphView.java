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

import algorithm.BFSStateMachine;

public class GraphView extends Pane {
    private Graph graph;
    private BFSStateMachine bfs;
    private final Map<Integer, Circle> vertexNodes = new HashMap<>();
    private final Map<Integer, Text> vertexLabels = new HashMap<>();
    private final List<Line> edgeLines = new ArrayList<>();
    private final double RADIUS = 32;
    private final double CENTER_X = 500, CENTER_Y = 350, CIRCLE_RADIUS = 260;

    public GraphView(Graph graph) {
        setPrefSize(1000, 700);
        setStyle("-fx-background-color: #18191c;");
        setGraph(graph);
    }

    public void setGraph(Graph graph) {
        this.graph = graph;
        drawGraph();
    }

    public void setBFSStateMachine(BFSStateMachine bfs) {
        this.bfs = bfs;
        updateBFSHighlight();
    }

    public void updateBFSHighlight() {
        drawGraph();
        if (bfs == null) return;
        // Highlight visited nodes
        for (Integer id : bfs.getVisited()) {
            Circle c = vertexNodes.get(id);
            if (c != null) {
                c.setFill(Color.web("#e0c28c"));
                c.setEffect(new javafx.scene.effect.DropShadow(32, Color.web("#ffe7b0")));
            }
        }
        // Highlight current node
        Integer curr = bfs.getCurrent();
        if (curr != null) {
            Circle c = vertexNodes.get(curr);
            if (c != null) {
                c.setFill(Color.web("#fff2c2"));
                c.setEffect(new javafx.scene.effect.DropShadow(48, Color.web("#fff2c2")));
            }
        }
        // Optionally highlight queue nodes differently
        for (Integer id : bfs.getQueue()) {
            if (id.equals(bfs.getCurrent())) continue;
            Circle c = vertexNodes.get(id);
            if (c != null) {
                c.setFill(Color.web("#bfa76a"));
                c.setEffect(new javafx.scene.effect.DropShadow(32, Color.web("#e0c28c")));
            }
        }
    }

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
}
