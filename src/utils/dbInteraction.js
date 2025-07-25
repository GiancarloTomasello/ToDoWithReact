import axios from 'axios';

export async function getTasks(){
    try{
        const test = await axios.get(`http://localhost:3000/getTasks`)
        //console.log(test.data);
        return test.data;
    }catch(error){
        console.log(error);
    }
}

export async function SaveNewTask(newTask){
    axios.post('http://localhost:3000/addTask', {
            component_id: newTask.id,
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
        })
}

export async function completeTaskInDB(task) {
    axios.put('http://localhost:3000/completeTask', {
        databaseId: task.databaseId,
        completed: !task.completed
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }).then((response) => {
        console.log("Post request finished");
        console.log(response);
    }).catch((error) =>{
        console.log(error);
    })
}

export async function deleteTaskInDB(task) {
    axios.delete(`http://localhost:3000/deleteTask:${task.databaseId}`)
    .then(response => {
        console.log("Resource deleted succesfully", response);
    }).catch(error =>{
        console.log("error deleting resource ", error);
        return task;
    })
}