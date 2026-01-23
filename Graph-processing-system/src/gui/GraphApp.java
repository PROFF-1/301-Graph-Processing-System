package gui;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class GraphApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        GraphController controller = new GraphController();
        Scene scene = new Scene(controller.getRootPane(), 900, 700);
        primaryStage.setTitle("Graph Processing System Simulation");
        primaryStage.setScene(scene);
        primaryStage.show();
    }
    public static void main(String[] args) { launch(args); }
}
