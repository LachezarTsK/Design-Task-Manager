
package main

import (
    "container/heap"
    "math"
)

var USER_ID_RANGE = [2]int{1, int(math.Pow(10.0, 5.0))}
var TASK_ID_RANGE = [2]int{1, int(math.Pow(10.0, 5.0))}
var PRIORITY_RANGE = [2]int{1, int(math.Pow(10.0, 9.0))}

const NOT_FOUND = -1
const REMOVED = -2

var REMOVED_TASK = NewTask(REMOVED, REMOVED, REMOVED)

type TaskManager struct {
    tasks   []*Task
    maxHeap PriorityQueue
}

func Constructor(initialTasks [][]int) TaskManager {
    taskManager := TaskManager{
        tasks:   make([]*Task, TASK_ID_RANGE[1] + 1),
        maxHeap: make(PriorityQueue, 0),
    }

    for _, current := range initialTasks {
        userID := current[0]
        taskID := current[1]
        priority := current[2]

        taskManager.tasks[taskID] = NewTask(userID, taskID, priority)
        heap.Push(&taskManager.maxHeap, NewTask(userID, taskID, priority))
    }
    return taskManager
}

func (this *TaskManager) Add(userID int, taskID int, priority int) {
    this.tasks[taskID] = NewTask(userID, taskID, priority)
    heap.Push(&this.maxHeap, NewTask(userID, taskID, priority))
}

func (this *TaskManager) Edit(taskID int, newPriority int) {
    userID := this.tasks[taskID].userID
    this.tasks[taskID] = NewTask(userID, taskID, newPriority)
    heap.Push(&this.maxHeap, NewTask(userID, taskID, newPriority))
}

func (this *TaskManager) Rmv(taskID int) {
    this.tasks[taskID] = REMOVED_TASK
}

func (this *TaskManager) ExecTop() int {
    userID := NOT_FOUND

    for this.maxHeap.Len() > 0 && userID == NOT_FOUND {
        current := heap.Pop(&this.maxHeap).(*Task)
        if this.taskFound(current) {
            userID = current.userID
            this.tasks[current.taskID] = REMOVED_TASK
        }
    }
    return userID
}

func (this *TaskManager) taskFound(current *Task) bool {
    taskID := current.taskID
    return current.userID == this.tasks[taskID].userID &&
            current.taskID == this.tasks[taskID].taskID &&
            current.priority == this.tasks[taskID].priority
}

type Task struct {
    userID   int
    taskID   int
    priority int
}

func NewTask(userID int, taskID int, priority int) *Task {
    task := &Task{
        userID:   userID,
        taskID:   taskID,
        priority: priority,
    }
    return task
}

type PriorityQueue []*Task

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    if pq[first].priority == pq[second].priority {
        return pq[first].taskID > pq[second].taskID
    }
    return pq[first].priority > pq[second].priority
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    task := object.(*Task)
    *pq = append(*pq, task)
}

func (pq *PriorityQueue) Pop() any {
    task := (*pq)[pq.Len() - 1]
    (*pq)[pq.Len() - 1] = nil
    *pq = (*pq)[0 : pq.Len() - 1]
    return task
}
