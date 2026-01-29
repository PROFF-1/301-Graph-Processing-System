package engine;

import algorithm.BFSStateMachine;
import model.Graph;
import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.util.Duration;
import java.util.function.Consumer;

/**
 * Orchestrates step-by-step BFS animation and exposes state for UI.
 */
public class BFSAnimationEngine {
    private final BFSStateMachine bfs;
    private Timeline timeline;
    private int speed = 500;
    private Consumer<Void> onStep;
    private Consumer<Void> onFinish;

    public BFSAnimationEngine(Graph graph, int sourceId, int destId) {
        this.bfs = new BFSStateMachine(graph, sourceId, destId);
    }

    public void setOnStep(Consumer<Void> onStep) { this.onStep = onStep; }
    public void setOnFinish(Consumer<Void> onFinish) { this.onFinish = onFinish; }
    public BFSStateMachine getBFS() { return bfs; }
    public void setSpeed(int ms) { this.speed = ms; if (timeline != null) timeline.setRate(500.0 / ms); }

    public void start() {
        if (timeline != null) timeline.stop();
        timeline = new Timeline(new KeyFrame(Duration.millis(speed), e -> step()));
        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.play();
    }
    public void pause() { if (timeline != null) timeline.pause(); }
    public void resume() { if (timeline != null) timeline.play(); }
    public void reset() { bfs.reset(); if (timeline != null) timeline.stop(); }

    private void step() {
        boolean more = bfs.step();
        if (onStep != null) onStep.accept(null);
        if (!more) {
            if (timeline != null) timeline.stop();
            if (onFinish != null) onFinish.accept(null);
        }
    }
}
