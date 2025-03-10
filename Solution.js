
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 It is just for information. When running the application on leetcode, 
 it should stay commented out. 
 */

class TaskManager {

    #USER_ID_RANGE = [1, Math.pow(10, 5)];
    #TASK_ID_RANGE = [1, Math.pow(10, 5)];
    #PRIORITY_RANGE = [1, Math.pow(10, 9)];

    #NOT_FOUND = -1;
    #REMOVED = -2;
    #REMOVED_TASK = new Task(this.#REMOVED, this.#REMOVED, this.#REMOVED);

    #tasks = new Array(this.#TASK_ID_RANGE[1] + 1);
    #maxHeap = new PriorityQueue((first, second) => this.#comparator(first, second));

    /**
     * @param {number[][]} initialTasks
     */
    constructor(initialTasks) {
        for (let [userID, taskID, priority] of initialTasks) {
            this.#tasks[taskID] = new Task(userID, taskID, priority);
            this.#maxHeap.enqueue(new Task(userID, taskID, priority));
        }
    }

    /** 
     * @param {Task} first
     * @param {Task} second 
     * @return {number}
     */
    #comparator(first, second) {
        return (first.priority === second.priority) ? (second.taskID - first.taskID) : (second.priority - first.priority);
    }

    /** 
     * @param {number} userID 
     * @param {number} taskID 
     * @param {number} priority
     * @return {void}
     */
    add(userID, taskID, priority) {
        this.#tasks[taskID] = new Task(userID, taskID, priority);
        this.#maxHeap.enqueue(new Task(userID, taskID, priority));
    }

    /** 
     * @param {number} taskID 
     * @param {number} newPriority
     * @return {void}
     */
    edit(taskID, newPriority) {
        const userID = this.#tasks[taskID].userID;
        this.#tasks[taskID] = new Task(userID, taskID, newPriority);
        this.#maxHeap.enqueue(new Task(userID, taskID, newPriority));
    }

    /** 
     * @param {number} taskID
     * @return {void}
     */
    rmv(taskID) {
        this.#tasks[taskID] = this.#REMOVED_TASK;
    }

    /**
     * @return {number}
     */
    execTop() {
        let userID = this.#NOT_FOUND;

        while (!this.#maxHeap.isEmpty() && userID === this.#NOT_FOUND) {
            const current = this.#maxHeap.dequeue();
            if (this.#taskFound(current)) {
                userID = current.userID;
                this.#tasks[current.taskID] = this.#REMOVED_TASK;
            }
        }
        return userID;
    }

    /** 
     * @param {Task} current
     * @return {number}
     */
    #taskFound(current) {
        const taskID = current.taskID;
        return current.userID === this.#tasks[taskID].userID
                && current.taskID === this.#tasks[taskID].taskID
                && current.priority === this.#tasks[taskID].priority;
    }

}

class Task {

    /** 
     * @param {number} userID
     * @param {number} taskID 
     * @param {number} priority
     */
    constructor(userID, taskID, priority) {
        this.userID = userID;
        this.taskID = taskID;
        this.priority = priority;
    }
}
