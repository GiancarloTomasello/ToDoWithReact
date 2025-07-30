import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import ToDoForm from "./components/ToDoForm";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import * as db from "./utils/dbInteraction" 

//Note to self: google "set inital use state with an async function"


function usePrevious(value){
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

const FILTER_MAP  = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);



function App(){
    const [tasks, setTasks] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [filter, setFilter] = useState("All");
    
    //Use Effect with no dependnecies run once after initial render
    useEffect(() => {
        const loadDBTasks = async () => {
            //axios get
            const data = await db.getTasks();
            const savedTaskList = data.map(dbTask => {
                const task = {
                    id: dbTask.component_id,
                    databaseId: dbTask.todo_id,
                    name: dbTask.task,
                    dueDate: dbTask.due_date ? dbTask.due_date.slice(0,10) : dbTask.due_date,
                    taskType: dbTask.task_type,
                    completed: dbTask.completed
                }
                return task;
            })
            // console.log("taskList");
            // console.log(savedTaskList);
            setTasks(savedTaskList);
        }
        loadDBTasks();
    }, []);
    
    async function addTask(taskData){
        const newTask = {...taskData, id: `todo-${nanoid()}`};
        //Axios post
        await db.SaveNewTask(newTask)
        setTasks([...tasks, newTask]);        
    }

    //everytime the task list changes filter the list
    //Moved useEffect dependent functions inside to avoid error
    //Ways to improve, useCallback() or custom hook?
    useEffect(() => {
        function toggleTaskCompleted(id){
            const updatedTasks = tasks.map((task) => {
                if(id===task.id){
                    //Update DB
                    db.completeTaskInDB(task);
                    //Update UI
                    return {...task, completed: !task.completed};
                }
                return task;
            });
            setTasks(updatedTasks);
        }
        
        function deleteTask(id){
            const remainingTasks = tasks.filter((task) =>{
                if(id === task.databaseId){
                    console.log("Print databaseId: "+ task.databaseId);
                   //db delete
                   db.deleteTaskInDB(task);
                }else{
                    return task;
                }
            });
            setTasks(remainingTasks);
        }
        
        function editTask(taskData){
            const updatedTasks = tasks.map((task) => {
                if(taskData.id === task.id){
                    //db updateTask
                    task.name = taskData.name;
                    task.taskType = taskData.taskType;
                    task.dueDate = taskData.dueDate;
                    db.updateTaskInDB(task);
                    return task;
                }
                return task;
            })
            setTasks(updatedTasks);
        }

        const List = tasks
        .filter(FILTER_MAP[filter])
        .map((task) =>  (
            <Todo 
            id={task.id} 
            name={task.name}
            dueDate={task.dueDate}
            taskType={task.taskType} 
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            deleteTask={deleteTask}
            editTask={editTask}
            databaseId={task.databaseId}
            />
        ));
        setTaskList(List);
    },[tasks, filter])  
    

    const filterList = FILTER_NAMES.map((name) => {
        return <FilterButton key={name} name={name} isPressed={name == filter} setFilter={setFilter}/>
    })

    const taskNoun = taskList !==1 ? "tasks" : "task";
    const headingText = `${taskList.length} ${taskNoun} remaining`;

    const listHeadingRef = useRef(null);
    const prevTaskLength = usePrevious(tasks.length);
    useEffect(() => {
        if(tasks.length < prevTaskLength){
            listHeadingRef.current.focus();
        }
    }, [tasks.length, prevTaskLength]);

    return (
        <>
            <div className="Todoapp stack-large">
                <h1>TO DO App</h1>
                <ToDoForm addTask={addTask}/>
                <div className="filters btn-group stack-exception">{filterList}</div>
                <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText}</h2>
                <ul
                role="list"
                className="todo-list stack-large stack-exception"
                aria-labelledby="list-heading">
                {taskList}
                </ul>
            </div>
        </>
    )
}

export default App;