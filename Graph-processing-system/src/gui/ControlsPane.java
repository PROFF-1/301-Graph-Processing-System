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
    public Slider speedSlider = new Slider(100, 2000, 500);

    public ControlsPane() {
        setSpacing(10);
        setPadding(new Insets(10));
        algoBox.getItems().addAll("BFS", "PageRank");
        algoBox.setValue("BFS");
        speedSlider.setShowTickLabels(true);
        speedSlider.setShowTickMarks(true);
        speedSlider.setMajorTickUnit(500);
        speedSlider.setMinorTickCount(4);
        speedSlider.setBlockIncrement(100);
        getChildren().addAll(startBtn, pauseBtn, resetBtn, new Label("Algorithm:"), algoBox, new Label("Speed:"), speedSlider);
    }
}
