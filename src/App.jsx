import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import ToDoForm from "./components/ToDoForm";
import { useState } from "react";
import { nanoid } from "nanoid";

function App(props){
    const [tasks, setTasks] = useState(props.tasks);

    function addTask(name){
        const newTask = {id: `todo-${nanoid()}`, name, completed:false};
        setTasks([...tasks, newTask]);
    }
    
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
    
    const taskList = tasks?.map((task) =>  (
        <Todo 
        id={task.id} 
        name={task.name} 
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        />
    ));

    const taskNoun = taskList !==1 ? "tasks" : "task";
    const headingText = `${taskList.length} ${taskNoun} remaining`;

    return (
        <>
            <div className="Todoapp stack-large">
                <h1>TO DO App</h1>
                <ToDoForm addTask={addTask}/>
                <div className="filters btn-group stack-exception">
                    <FilterButton fltrType="All" pressed/>
                    <FilterButton fltrType="Active"/>
                    <FilterButton fltrType="Completed"/>
                </div>
                <h2 id="list-heading">{headingText}</h2>
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