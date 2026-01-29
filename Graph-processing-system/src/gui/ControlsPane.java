package gui;

import javafx.animation.*;
import javafx.geometry.Insets;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.util.Duration;
import model.*;
import algorithm.*;
import engine.*;

public class ControlsPane extends VBox {
    // Node controls
    public TextField nodeNameField = new TextField();
    public Button addNodeBtn = new Button("Add");
    public Button removeNodeBtn = new Button("Remove");
    // Edge controls
    public TextField edgeFromField = new TextField();
    public TextField edgeToField = new TextField();
    public Button addEdgeBtn = new Button("Add");
    public Button removeEdgeBtn = new Button("Remove");
    // Source/Destination
    public ComboBox<String> sourceBox = new ComboBox<>();
    public ComboBox<String> destBox = new ComboBox<>();
    // Algorithm/Graph selection
    public ComboBox<String> algoBox = new ComboBox<>();
    public ComboBox<String> graphBox = new ComboBox<>();
    // Control buttons
    public Button runBtn = new Button("Run BFS");
    public Button pauseBtn = new Button("Pause");
    public Button resetBtn = new Button("Reset");
    public Slider speedSlider = new Slider(100, 2000, 500);
    // Log area
    public TextArea logArea = new TextArea();
    private final Label instructions = new Label();

    public ControlsPane() {
        setSpacing(18);
        setPadding(new Insets(18));
        setStyle("-fx-background-color: #18191c; -fx-border-radius: 18; -fx-background-radius: 18;");

        // Node controls
        nodeNameField.setPromptText("Node name");
        nodeNameField.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #f8f5e3;");
        addNodeBtn.setStyle("-fx-background-color: linear-gradient(to right, #e0c28c, #bfa76a); -fx-background-radius: 8; -fx-font-weight: bold;");
        removeNodeBtn.setStyle("-fx-background-color: linear-gradient(to right, #e0c28c, #bfa76a); -fx-background-radius: 8; -fx-font-weight: bold;");
        HBox nodeBox = new HBox(8, nodeNameField, addNodeBtn, removeNodeBtn);
        nodeBox.setStyle("-fx-padding: 4;");

        // Edge controls
        edgeFromField.setPromptText("From node");
        edgeToField.setPromptText("To node");
        edgeFromField.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #f8f5e3;");
        edgeToField.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #f8f5e3;");
        addEdgeBtn.setStyle("-fx-background-color: linear-gradient(to right, #e0c28c, #bfa76a); -fx-background-radius: 8; -fx-font-weight: bold;");
        removeEdgeBtn.setStyle("-fx-background-color: linear-gradient(to right, #e0c28c, #bfa76a); -fx-background-radius: 8; -fx-font-weight: bold;");
        HBox edgeBox = new HBox(8, edgeFromField, edgeToField, addEdgeBtn, removeEdgeBtn);
        edgeBox.setStyle("-fx-padding: 4;");

        // Source/Destination
        sourceBox.setPromptText("Source");
        destBox.setPromptText("Destination");
        sourceBox.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #e0c28c;");
        destBox.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #e0c28c;");
        HBox srcDestBox = new HBox(16, new Label("Source"), sourceBox, new Label("Destination"), destBox);
        srcDestBox.setStyle("-fx-padding: 4;");

        // Algorithm/Graph selection
        algoBox.getItems().addAll("BFS", "DFS", "Dijkstra", "PageRank");
        algoBox.setValue("BFS");
        graphBox.getItems().addAll("Simple", "Tree", "Cycle", "Maze");
        graphBox.setValue("Simple");
        algoBox.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #e0c28c;");
        graphBox.setStyle("-fx-background-radius: 8; -fx-background-color: #23242a; -fx-text-fill: #e0c28c;");
        HBox selectBox = new HBox(16, new Label("Algorithm:"), algoBox, new Label("Graph:"), graphBox);
        selectBox.setStyle("-fx-padding: 4;");

        // Control buttons
        runBtn.setStyle("-fx-background-color: linear-gradient(to right, #e0c28c, #bfa76a); -fx-background-radius: 12; -fx-font-weight: bold; -fx-font-size: 18px; -fx-padding: 8 32 8 32;");
        pauseBtn.setStyle("-fx-background-color: #23242a; -fx-background-radius: 8; -fx-text-fill: #e0c28c; -fx-font-weight: bold;");
        resetBtn.setStyle("-fx-background-color: #23242a; -fx-background-radius: 8; -fx-text-fill: #e0c28c; -fx-font-weight: bold;");
        HBox controlBox = new HBox(16, runBtn, pauseBtn, resetBtn);
        controlBox.setStyle("-fx-padding: 4;");

        // Log area
        logArea.setEditable(false);
        logArea.setPrefRowCount(10);
        logArea.setStyle("-fx-control-inner-background: #f8f5e3; -fx-font-family: 'Consolas'; -fx-background-radius: 8; -fx-border-color: #e0c28c; -fx-border-width: 2; -fx-border-radius: 8;");
        Label logLabel = new Label("BFS Log:");
        logLabel.setStyle("-fx-text-fill: #e0c28c; -fx-font-weight: bold; -fx-font-size: 16px;");
        VBox logBox = new VBox(logLabel, logArea);
        logBox.setStyle("-fx-padding: 4; -fx-background-color: #23242a; -fx-border-color: #e0c28c; -fx-border-radius: 8; -fx-background-radius: 8;");

        // Instructions
        instructions.setText(
            "Instructions:\n" +
            "- Add/remove nodes and edges.\n" +
            "- Select source/destination.\n" +
            "- Choose algorithm and graph.\n" +
            "- Click Run to visualize.\n" +
            "- View step-by-step log below."
        );
        instructions.setStyle("-fx-font-size: 12px; -fx-padding: 6 0 0 0; -fx-text-fill: #e0c28c;");
        instructions.setWrapText(true);
        instructions.setMaxWidth(350);

        getChildren().addAll(
            nodeBox,
            edgeBox,
            srcDestBox,
            selectBox,
            controlBox,
            logBox,
            instructions
        );
    }
}
