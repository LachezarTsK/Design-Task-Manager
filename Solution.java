
import java.util.List;
import java.util.PriorityQueue;

public class TaskManager {

    private record Task(int userID, int taskID, int priority) {}

    private static final int[] USER_ID_RANGE = {1, (int) Math.pow(10, 5)};
    private static final int[] TASK_ID_RANGE = {1, (int) Math.pow(10, 5)};
    private static final int[] PRIORITY_RANGE = {1, (int) Math.pow(10, 9)};

    private static final int NOT_FOUND = -1;
    private static final int REMOVED = -2;
    private static final Task REMOVED_TASK = new Task(REMOVED, REMOVED, REMOVED);

    private final Task[] tasks = new Task[TASK_ID_RANGE[1] + 1];
    private final PriorityQueue<Task> maxHeap = new PriorityQueue<>((first, second) -> comparator(first, second));

    public TaskManager(List<List<Integer>> initialTasks) {
        for (List<Integer> current : initialTasks) {
            int userID = current.get(0);
            int taskID = current.get(1);
            int priority = current.get(2);

            tasks[taskID] = new Task(userID, taskID, priority);
            maxHeap.add(new Task(userID, taskID, priority));
        }
    }

    private int comparator(Task first, Task second) {
        return (first.priority == second.priority) ? (second.taskID - first.taskID) : (second.priority - first.priority);
    }

    public void add(int userID, int taskID, int priority) {
        tasks[taskID] = new Task(userID, taskID, priority);
        maxHeap.add(new Task(userID, taskID, priority));
    }

    public void edit(int taskID, int newPriority) {
        int userID = tasks[taskID].userID;
        tasks[taskID] = new Task(userID, taskID, newPriority);
        maxHeap.add(new Task(userID, taskID, newPriority));
    }

    public void rmv(int taskID) {
        tasks[taskID] = REMOVED_TASK;
    }

    public int execTop() {
        int userID = NOT_FOUND;

        while (!maxHeap.isEmpty() && userID == NOT_FOUND) {
            Task current = maxHeap.poll();
            if (taskFound(current)) {
                userID = current.userID;
                tasks[current.taskID] = REMOVED_TASK;
            }
        }
        return userID;
    }

    private boolean taskFound(Task current) {
        int taskID = current.taskID;
        return current.userID == tasks[taskID].userID
                && current.taskID == tasks[taskID].taskID
                && current.priority == tasks[taskID].priority;
    }
}
