
using System;
using System.Collections.Generic;

public class TaskManager
{
    private record Task(int userID, int taskID, int priority) { }

    private static readonly int[] USER_ID_RANGE = { 1, (int)Math.Pow(10, 5) };
    private static readonly int[] TASK_ID_RANGE = { 1, (int)Math.Pow(10, 5) };
    private static readonly int[] PRIORITY_RANGE = { 1, (int)Math.Pow(10, 9) };

    private static readonly int NOT_FOUND = -1;
    private static readonly int REMOVED = -2;
    private static readonly Task REMOVED_TASK = new Task(REMOVED, REMOVED, REMOVED);

    private readonly Task[] tasks = new Task[TASK_ID_RANGE[1] + 1];
    private static Comparer<Task> comparator = Comparer<Task>.Create((first, second) => (first.priority == second.priority) ? (second.taskID - first.taskID) : (second.priority - first.priority));
    private readonly PriorityQueue<Task, Task> maxHeap = new PriorityQueue<Task, Task>(comparator);


    public TaskManager(IList<IList<int>> initialTasks)
    {
        foreach (var current in initialTasks)
        {
            int userID = current[0];
            int taskID = current[1];
            int priority = current[2];

            tasks[taskID] = new Task(userID, taskID, priority);
            maxHeap.Enqueue(new Task(userID, taskID, priority), new Task(userID, taskID, priority));
        }
    }

    public void Add(int userID, int taskID, int priority)
    {
        tasks[taskID] = new Task(userID, taskID, priority);
        maxHeap.Enqueue(new Task(userID, taskID, priority), new Task(userID, taskID, priority));
    }

    public void Edit(int taskID, int newPriority)
    {
        int userID = tasks[taskID].userID;
        tasks[taskID] = new Task(userID, taskID, newPriority);
        maxHeap.Enqueue(new Task(userID, taskID, newPriority), new Task(userID, taskID, newPriority));
    }

    public void Rmv(int taskID)
    {
        tasks[taskID] = REMOVED_TASK;
    }

    public int ExecTop()
    {
        int userID = NOT_FOUND;

        while (maxHeap.Count > 0 && userID == NOT_FOUND)
        {
            Task current = maxHeap.Dequeue();
            if (TaskFound(current))
            {
                userID = current.userID;
                tasks[current.taskID] = REMOVED_TASK;
            }
        }
        return userID;
    }

    private bool TaskFound(Task current)
    {
        int taskID = current.taskID;
        return current.userID == tasks[taskID].userID
                && current.taskID == tasks[taskID].taskID
                && current.priority == tasks[taskID].priority;
    }
}
