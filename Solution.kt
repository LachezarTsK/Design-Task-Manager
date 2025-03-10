
import kotlin.math.pow

class TaskManager(initialTasks: List<List<Int>>) {

    private data class Task(val userID: Int, val taskID: Int, val priority: Int) {}

    private companion object {
        val USER_ID_RANGE = intArrayOf(1, (10.0).pow(5).toInt())
        val TASK_ID_RANGE = intArrayOf(1, (10.0).pow(5).toInt())
        val PRIORITY_RANGE = intArrayOf(1, (10.0).pow(9).toInt())

        const val NOT_FOUND = -1
        const val REMOVED = -2
        val REMOVED_TASK = Task(REMOVED, REMOVED, REMOVED)
    }

    private val tasks = arrayOfNulls<Task>(TASK_ID_RANGE[1] + 1)
    private val maxHeap = java.util.PriorityQueue<Task> { first, second -> comparator(first, second) }

    init {
        for (current in initialTasks) {
            val userID = current[0]
            val taskID = current[1]
            val priority = current[2]

            tasks[taskID] = Task(userID, taskID, priority)
            maxHeap.add(Task(userID, taskID, priority))
        }
    }


    private fun comparator(first: Task, second: Task): Int {
        if (first.priority == second.priority) {
            return second.taskID - first.taskID
        }
        return second.priority - first.priority
    }

    fun add(userID: Int, taskID: Int, priority: Int) {
        tasks[taskID] = Task(userID, taskID, priority)
        maxHeap.add(Task(userID, taskID, priority))
    }

    fun edit(taskID: Int, newPriority: Int) {
        val userID = tasks[taskID]!!.userID
        tasks[taskID] = Task(userID, taskID, newPriority)
        maxHeap.add(Task(userID, taskID, newPriority))
    }

    fun rmv(taskID: Int) {
        tasks[taskID] = REMOVED_TASK
    }

    fun execTop(): Int {
        var userID = NOT_FOUND

        while (!maxHeap.isEmpty() && userID == NOT_FOUND) {
            val current = maxHeap.poll()
            if (taskFound(current)) {
                userID = current.userID
                tasks[current.taskID] = REMOVED_TASK
            }
        }
        return userID
    }

    private fun taskFound(current: Task): Boolean {
        val taskID = current.taskID
        return current.userID == tasks[taskID]!!.userID
                && current.taskID == tasks[taskID]!!.taskID
                && current.priority == tasks[taskID]!!.priority
    }
}
