import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import ToDoForm from "./components/ToDoForm";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { getItem, setItem} from "./utils/localStorage"
import axios from 'axios';

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

 async function getTasks(){
    try{
        const test = await axios.get(`http://localhost:3000/getTasks`)
        //console.log(test.data);
        return test.data;
    }catch(error){
        console.log(error);
    }
}

function App(){
    const [tasks, setTasks] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [filter, setFilter] = useState("All");
    
    //Use Effect with no dependnecies run once after initial render
    useEffect(() => {
        const loadDBTasks = async () => {
            const data = await getTasks();
            const savedTaskList = data.map(dbTask => {
                const task = {
                    id: dbTask.component_id,
                    databaseId: dbTask.todo_id,
                    name: dbTask.task,
                    task_type: dbTask.task_type,
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
    
    function addTask(name){
        const newTask = {id: `todo-${nanoid()}`, name, completed:false};
        axios.post('http://localhost:3000/addTask', {
            Task: newTask.name,
            Task_Type: "None", 
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (response){
            console.log(response.data.insertId);
            //console.log("New id is= "+response.insertedId);
            newTask.databaseId=response.data.insertId;
            //console.log("test dbID " + newTask.databaseId);
            setTasks([...tasks, newTask]);
        })
    }

    //everytime the task list changes filter the list
    //Moved useEffect dependent functions inside to avoid error
    //Ways to improve, useCallback() or custom hook?
    useEffect(() => {
        function toggleTaskCompleted(id){
            const updatedTasks = tasks.map((task) => {
                if(id===task.id){
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
                    axios.delete(`http://localhost:3000/deleteTask:${task.databaseId}`)
                        .then(response => {
                            console.log("Resource deleted succesfully", response);
                        }).catch(error =>{
                            console.log("error deleting resource ", error);
                            return task;
                        })
                }else{
                    return task;
                }
            });
            setTasks(remainingTasks);
        }
        
        function editTask(id, newName){
            const updatedTasks = tasks.map((task) => {
                if(id === task.id){
                    return {...task, name: newName}
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