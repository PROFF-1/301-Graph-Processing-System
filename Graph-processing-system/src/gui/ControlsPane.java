package gui;

import javafx.animation.*;
import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.util.Duration;
import model.*;
import algorithm.*;
import engine.*;

public class ControlsPane extends HBox {
    public Button startBtn = new Button("Start");
    public Button pauseBtn = new Button("Pause");
    public Button resetBtn = new Button("Reset");
    public ComboBox<String> algoBox = new ComboBox<>();
    public ComboBox<String> graphBox = new ComboBox<>();
    public Slider speedSlider = new Slider(100, 2000, 500);
    private final Label instructions = new Label();

    public ControlsPane() {
        setSpacing(10);
        setPadding(new Insets(10));
        algoBox.getItems().addAll("BFS", "DFS", "Dijkstra", "PageRank");
        algoBox.setValue("BFS");
        graphBox.getItems().addAll("Simple", "Tree", "Cycle", "Maze");
        graphBox.setValue("Simple");
        speedSlider.setShowTickLabels(true);
        speedSlider.setShowTickMarks(true);
        speedSlider.setMajorTickUnit(500);
        speedSlider.setMinorTickCount(4);
        speedSlider.setBlockIncrement(100);

        // Tooltips for beginners
        startBtn.setTooltip(new Tooltip("Start the algorithm animation."));
        pauseBtn.setTooltip(new Tooltip("Pause the animation."));
        resetBtn.setTooltip(new Tooltip("Reset the graph and algorithm."));
        algoBox.setTooltip(new Tooltip("Select the graph algorithm to visualize."));
        graphBox.setTooltip(new Tooltip("Select a sample graph or maze to test algorithms."));
        speedSlider.setTooltip(new Tooltip("Adjust the speed of the animation."));

        // Instructions for beginners
        instructions.setText(
            "Instructions:\n" +
            "1. Select a graph and algorithm.\n" +
            "2. Click Start to run the algorithm.\n" +
            "3. Use Pause/Reset as needed.\n" +
            "4. Adjust speed for step-by-step view.\n" +
            "5. Read the algorithm description on the right."
        );
        instructions.setStyle("-fx-font-size: 12px; -fx-padding: 0 0 0 10px;");
        instructions.setWrapText(true);
        instructions.setMaxWidth(350);

        getChildren().addAll(
            startBtn, pauseBtn, resetBtn,
            new Label("Algorithm:"), algoBox,
            new Label("Graph:"), graphBox,
            new Label("Speed:"), speedSlider,
            instructions
        );
    }
}
