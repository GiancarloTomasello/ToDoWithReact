import { useState } from "react";

function ToDoForm(props){
    const [name, setName] = useState("");

    function handleSubmit(event){
        event.preventDefault();
        props.addTask(name);
        setName("");
    }

    function handleChange(event){
        setName(event.target.value);
    }

    return(
        <form onSubmit={handleSubmit}>
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
            />
            <div className="flexbxMd">
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        id="new-todo-due-date"
                        className="input input_lg"
                        name="due-date"
                        value={"2025-07-28"}
                        min={"2025-07-28"}
                />
                </div>
                <div>
                <label>Task Type: </label>
                <select className="input input__md">
                    <option value="">None</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="Hobby">Hobby</option>
                </select>
                </div>
            </div>
            <button type="submit" className="btn btn_primary btn__lg">
                Add
            </button>
        </form>
    );
} 

export default ToDoForm;