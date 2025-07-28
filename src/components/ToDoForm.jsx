import { useState } from "react";

function ToDoForm(props){
    const [name, setName] = useState("");

    //Get todays date and initialized selected date of form

    const [selectedDate, setSelectedDate] = useState("");

    function getCurrentDate(){
        const date = new Date();
        let currentDate = date.toJSON();
        console.log(currentDate.slice(0,10));
        return currentDate.slice(0,10);
    }

    function handleSubmit(event){
        event.preventDefault();
        props.addTask(name);
        setName("");
    }

    function handleChange(event){
        setName(event.target.value);
    }

    function handleDateChange(event){
        setSelectedDate(event.target.value);
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
                required
            />
            <div className="flexbxMd">
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        id="new-todo-due-date"
                        className="input input_lg"
                        name="due-date"
                        value={selectedDate}
                        min={getCurrentDate()}
                        onChange={handleDateChange}
                        required
                />
                </div>
                <div>
                <label>Task Type: </label>
                <select className="input input__md" required>
                    <option value="None">None</option>
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