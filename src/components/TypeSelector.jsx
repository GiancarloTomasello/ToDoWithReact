//move task selection logic here to be reuseable 
function TypeSelector(){

    return(
        <div>
            <label>
                Task Type: 
            </label>
            <select className="input input__md" name="taskType" required>
                <option value="None">None</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="Hobby">Hobby</option>
            </select>
        </div>
    );
}
export default TypeSelector;