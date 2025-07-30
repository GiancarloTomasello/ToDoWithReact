import { useState } from "react";
import DateSelector from "./dateSelector";
import TypeSelector from "./TypeSelector";

function ToDoForm(props){
    const [name, setName] = useState("");

    //Get todays date and initialized selected date of form

    function handleSubmit(event){
        event.preventDefault();

        const formData = new FormData(event.target);
        const taskData = {
            name: formData.get("text").toString(),
            taskType: formData.get("taskType").toString(),
            dueDate: formData.get("dueDate").toString(),
        }
        console.log(taskData);

        props.addTask(taskData);
        setName("");
    }

    function handleChange(event){
        setName(event.target.value);
    }

    return(
        <form onSubmit={handleSubmit} id="newTaskForm">
            <h2 className="label-wrapper">
                <label htmlFor="new-todo-input" className="label__lg">
                    What needs to be done?
                </label>
            </h2>
            <input
                type="text"
                id="new-todo-input"
                className="input input__lg"
                name="text"
                autoComplete="off"
                value={name}
                onChange={handleChange}
                required
            />
            <div className="flexbxMd">
                <div>
                    <DateSelector/>
                </div>
                <div>
                    <TypeSelector/>
                </div>
            </div>
            <button type="submit" className="btn btn_primary btn__lg">
                Add
            </button>
        </form>
    );
} 

export default ToDoForm;