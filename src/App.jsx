import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import ToDoForm from "./components/ToDoForm";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import { getItem, setItem} from "./utils/localStorage"
import axios from 'axios';

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
    const [tasks, setTasks] = useState( () => {
        const item = getItem("taskList");
        return item || [];
    });
    const [filter, setFilter] = useState("All");
    
    function addTask(name){
        const newTask = {id: `todo-${nanoid()}`, name, completed:false};
        setTasks([...tasks, newTask]);
        const {data} = axios.post('http://localhost:3000/addTask', {
            Task: newTask.name,
            Task_Type: "None", 
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }).then(function (response){
            console.log(response);
        })
    }

    //Runs everyime a change has been made to its dependents (tasks)
    useEffect(() => {
        setItem("taskList", tasks);
    },[tasks])
    
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
        const remainingTasks = tasks.filter((task) => id !== task.id);
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
    
    const taskList = tasks
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
        />
    ));


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