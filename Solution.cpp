
#include <queue>
#include <array>
#include <vector>
using namespace std;

class TaskManager {

    struct Task {
        int userID{};
        int taskID{};
        int priority{};

        Task() = default;
        Task(int userID, int taskID, int priority) :userID{ userID }, taskID{ taskID }, priority{ priority } {};
    };

    struct Comparator {
        auto operator()(const Task& first, const Task& second) const {
            if (first.priority == second.priority) {
                return second.taskID > first.taskID;
            }
            return second.priority > first.priority;
        }
    };

    /*
    The definitions for 'one_hundred_thousand' and 'one_billion' are for the sake of legibility
    and clarity of intended value. These are used instead of pow(10, 5) and pow(10, 9)
    because 'pow(...)' is not a compile time constant.

    We need 'TASK_ID_RANGE' to be a constexpr in order to initialize array 'tasks' in the following way:
    array<Task, TASK_ID_RANGE[1] + 1> tasks

    As for the arrays 'USER_ID_RANGE' and 'PRIORITY_RANGE': these arrays are included for the sake of completeness
    and their values are not actually used in the solution.
    */
    static const int one_hundred_thousand = 100000;
    static const int one_billion = 1000000000;

    inline static constexpr array<int, 2> USER_ID_RANGE = { 1, one_hundred_thousand };
    inline static constexpr array<int, 2> TASK_ID_RANGE = { 1, one_hundred_thousand };
    inline static constexpr array<int, 2> PRIORITY_RANGE = { 1, one_billion };

    static const int NOT_FOUND = -1;
    static const int REMOVED = -2;
    inline static const Task REMOVED_TASK{ REMOVED, REMOVED, REMOVED };

    array<Task, TASK_ID_RANGE[1] + 1> tasks;
    priority_queue<Task, vector<Task>, Comparator> maxHeap;

public:
    TaskManager(vector<vector<int>>& initialTasks) {

        for (const auto& current : initialTasks) {
            int userID = current[0];
            int taskID = current[1];
            int priority = current[2];

            tasks[taskID].userID = userID;
            tasks[taskID].taskID = taskID;
            tasks[taskID].priority = priority;

            maxHeap.emplace(userID, taskID, priority);
        }
    }

    void add(int userID, int taskID, int priority) {
        tasks[taskID].userID = userID;
        tasks[taskID].taskID = taskID;
        tasks[taskID].priority = priority;;
        maxHeap.emplace(userID, taskID, priority);
    }

    void edit(int taskID, int newPriority) {
        int userID = tasks[taskID].userID;
        tasks[taskID].priority = newPriority;
        maxHeap.emplace(userID, taskID, newPriority);
    }

    void rmv(int taskID) {
        tasks[taskID] = REMOVED_TASK;
    }

    int execTop() {
        int userID = NOT_FOUND;

        while (!maxHeap.empty() && userID == NOT_FOUND) {
            Task current = maxHeap.top();
            maxHeap.pop();

            if (taskFound(current)) {
                userID = current.userID;
                tasks[current.taskID] = REMOVED_TASK;
            }
        }
        return userID;
    }

private:
    bool taskFound(const Task& current) const {
        int taskID = current.taskID;
        return current.userID == tasks[taskID].userID
                && current.taskID == tasks[taskID].taskID
                && current.priority == tasks[taskID].priority;
    }
};
