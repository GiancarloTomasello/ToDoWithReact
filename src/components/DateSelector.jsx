import { useState } from "react";

//Move Date selector here to be reuseable
function DateSelector(){
    const[selectedDate, setSelectedDate] = useState("");

    function getCurrentDate(){
        const date = new Date();
        const currentDate = date.toJSON();
        console.log(currentDate.slice(0,10));
        return currentDate.slice(0,10);
    }

    function handleDateChange(event){
        setSelectedDate(event.target.value);
    }

    return(
        <div>
        <label>
            Due Date: 
        </label>
        <input
            type="date"
            id="new-todo-due-date"
            className="input input_lg"
            name="dueDate"
            value={selectedDate}
            min={getCurrentDate()}
            onChange={handleDateChange}
            required
        />
        </div>
    );
}
export default DateSelector;