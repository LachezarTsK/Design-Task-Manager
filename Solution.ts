
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 It is just for information. When running the application on leetcode, 
 it should stay commented out. 
 */


class TaskManager {

    private USER_ID_RANGE = [1, Math.pow(10, 5)];
    private TASK_ID_RANGE = [1, Math.pow(10, 5)];
    private PRIORITY_RANGE = [1, Math.pow(10, 9)];

    private NOT_FOUND = -1;
    private REMOVED = -2;
    private REMOVED_TASK = new Task(this.REMOVED, this.REMOVED, this.REMOVED);

    private tasks = new Array(this.TASK_ID_RANGE[1] + 1);
    private maxHeap = new PriorityQueue((first, second) => this.comparator(first, second));

    constructor(initialTasks: number[][]) {
        for (let [userID, taskID, priority] of initialTasks) {
            this.tasks[taskID] = new Task(userID, taskID, priority);
            this.maxHeap.enqueue(new Task(userID, taskID, priority));
        }
    }

    private comparator(first: Task, second: Task): number {
        return (first.priority === second.priority) ? (second.taskID - first.taskID) : (second.priority - first.priority);
    }

    add(userID: number, taskID: number, priority: number): void {
        this.tasks[taskID] = new Task(userID, taskID, priority);
        this.maxHeap.enqueue(new Task(userID, taskID, priority));
    }

    edit(taskID: number, newPriority: number): void {
        const userID = this.tasks[taskID].userID;
        this.tasks[taskID] = new Task(userID, taskID, newPriority);
        this.maxHeap.enqueue(new Task(userID, taskID, newPriority));
    }

    rmv(taskID: number): void {
        this.tasks[taskID] = this.REMOVED_TASK;
    }

    execTop(): number {
        let userID = this.NOT_FOUND;

        while (!this.maxHeap.isEmpty() && userID === this.NOT_FOUND) {
            const current = this.maxHeap.dequeue();
            if (this.taskFound(current)) {
                userID = current.userID;
                this.tasks[current.taskID] = this.REMOVED_TASK;
            }
        }
        return userID;
    }

    private taskFound(current) {
        const taskID = current.taskID;
        return current.userID === this.tasks[taskID].userID
            && current.taskID === this.tasks[taskID].taskID
            && current.priority === this.tasks[taskID].priority;
    }
}

class Task {

    userID: number;
    taskID: number;
    priority: number;

    constructor(userID: number, taskID: number, priority: number) {
        this.userID = userID;
        this.taskID = taskID;
        this.priority = priority;
    }
}
