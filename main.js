const addbtn = document.getElementById('add');
const ul = document.getElementById('lists');
const inputs = document.getElementById('inputs')
const prefix = "shang-";
const idGenPrefix = "id-generator";
const addTaskForm = document.querySelector(".add-task-form");
const tasksArray = "tasks-array";
const countText = document.querySelector(".items-count");
const tasksLI = document.querySelectorAll("li");


//check if the array for task exists

let checkTaskArray = ()=>{
    return (localStorage.getItem(tasksArray) != null)? true: false;
}

//get the array of tasks in local storage

let getTaskArray = ()=> {
    return JSON.parse(localStorage.getItem(tasksArray));
}

//store the array of tasks to the local storage

let storeTaskArray = (TaskArray)=> {
    localStorage.setItem(tasksArray,JSON.stringify(TaskArray));
}

//count items left

let count = () => {
    let taskArray = getTaskArray();
    let count = 0;
    taskArray.forEach(elem => {
        count += (elem.isCompleted == 0)? 1: 0;
    });

    countText.innerText = `${count} Items left`;
}

//insert function

let insertFunc = ()=>{
    if(inputs.value != ''){
        localStorageSetItem(inputs.value);
        check();
        updateUI();
        inputs.value = "";
    }
}

//add task using mouse click

addbtn.addEventListener('click', function () {
    // console.log('add');
    if (!inputs.value) {
        return;
    }

    if (isDuplicate(inputs.value)) {
        alert('already exist')
        return;
    }

    insertFunc();

});

// add task using keyboard

addTaskForm.addEventListener("submit",(e) => {
    e.preventDefault();

    insertFunc();
    
});



//delete tasks buttons with delete functionality

let deleteTask = () => {
    document.querySelectorAll(".delete").forEach( (elem,index) => {
        elem.addEventListener("click", ()=>{
            let taskArray = getTaskArray();
            taskArray.splice(index,1);
            storeTaskArray(taskArray);
            updateUI();
        });
    });
}

//edit functionality

let editFunction = () => {
    let taskArray = getTaskArray();
    let inputs = document.querySelector(".edit-input");
    if(document.querySelector(".edit-form")){
        document.querySelector(".edit-form").addEventListener("submit", (e) => {
            e.preventDefault();
            let index = document.querySelector(".edit-index").value;
            taskArray[index].task = inputs.value;
            storeTaskArray(taskArray);
            updateUI();
        });
    }
}



// edit task buttons

let editTask = ()=>{
    let taskArray = getTaskArray();
    document.querySelectorAll(".edit").forEach((elem,index)=>{
        elem.addEventListener("click", ()=>{
            let textElement = document.querySelectorAll("li span");
            textElement.forEach( (elem,index) => {
                elem.innerText = taskArray[index].task;
            });

            let text = textElement[index].innerText;
            textElement[index].innerHTML = `<form action ='' class='edit-form'>
                <input type='text' class='edit-input' value='${text}'>
                <input type='hidden' value='${index}' class='edit-index'>
                <button type='submit' class='edit-submit'><i class="fas fa-edit"></i></button>
            </form>`;
            editFunction();
        });
    });
}

//call the functionalities for buttons

let callButtonFunctions = () =>{
    deleteTask();
    editTask();
    editFunction();
}

//check completed buttons

let check = () => {
    document.querySelectorAll(".complete").forEach( (elem,index) => {
        elem.addEventListener("click", ()=>{
            
            let tasks = getTaskArray();
    
            elem.style.color = (tasks[index].isCompleted != 0)? "#c7bebe": "#18be09";
            tasks[index].isCompleted = (tasks[index].isCompleted == 0)? 1: 0;
            storeTaskArray(tasks);

            count();
        });
    });    
}

//clear all completed tasks functionality

let clear = ()=> {
    let taskArray = getTaskArray();
    let clearedTasks = taskArray.filter(task => {
        return task.isCompleted == 0;
    });
    storeTaskArray(clearedTasks);
}

//filter all

document.querySelector(".all-items").addEventListener("click", ()=> {
    updateUI();
});

//filter active

document.querySelector(".active-items").addEventListener("click", ()=> {
    let taskArray = getTaskArray();
    let count = 0;
    document.querySelectorAll("li").forEach( (elem,index) => {
        elem.style.display = (taskArray[index].isCompleted == 0)? "flex": "none";
        elem.style.backgroundColor = (count % 2 != 0)? "white": "#ececec";
        count += (taskArray[index].isCompleted == 0)? 1 : 0;
    });
});

//filter completed

document.querySelector(".completed-items").addEventListener("click", ()=> {
    let taskArray = getTaskArray();
    let count = 0;
    document.querySelectorAll("li").forEach( (elem,index) => {
        elem.style.display = (taskArray[index].isCompleted == 1)? "flex": "none";
        elem.style.backgroundColor = (count % 2 != 0)? "white": "#ececec";
        count += (taskArray[index].isCompleted == 1)? 1 : 0;
    });
});

//functionality to clear every completed task added to clear completed button

document.querySelector(".clear-completed").addEventListener("click", ()=>{
    clear();
    updateUI();
});

//drop event

let drop = () => {
    console.log(5);
}



// update the lists in the to do list, call everytime to update

let updateUI = ()=>{
    ul.innerHTML = '';
    //const entryKeys = Object.keys(localStorage);
    //const storageKeys = entryKeys.filter(key => key.includes(prefix)).sort();

    let tasks = getTaskArray();
    if(tasks){
        tasks.forEach(elem => {
            const value = elem.task;
            let li = document.createElement('li');
            let lisettings = document.createElement('div');
            let icheck = document.createElement('i');
            let iopt = document.createElement('i');
            let iconoptions = document.createElement('div');
            let edit = document.createElement('a');
            let del = document.createElement('a');
            let span = document.createElement('span');
    
    
            lisettings.classList.add('lists-settings');
            icheck.classList.add('fa', 'fa-check', 'complete');
            icheck.style.color = (elem.isCompleted == 0)? "#c7bebe": "#18be09";
            iopt.classList.add('fas', 'fa-ellipsis-v', 'option-icon');
            iconoptions.classList.add('options');
            edit.classList.add('edit', 'fas', 'fa-pen-square');
            del.classList.add('delete', 'fas', 'fa-trash');
    
            var id;

            span.innerText = value;
    
            iconoptions.appendChild(edit);
            iconoptions.appendChild(del);
            iopt.appendChild(iconoptions);
            lisettings.appendChild(icheck);
            lisettings.appendChild(iopt);
            li.appendChild(span);
            li.appendChild(lisettings);
            li.setAttribute("draggable",true);
            li.setAttribute("id",elem.id);
            li.addEventListener("dragstart",(e)=>{
                e.dataTransfer.setData("text",e.target.id);
            });
            li.addEventListener("drop",(e)=>{
                e.preventDefault();
                let droptarget = document.querySelector(`#${e.target.id}`);
                let dragtarget = document.querySelector(`#${e.dataTransfer.getData("text")}`);
                droptarget.parentNode.insertBefore(dragtarget, droptarget.nextSibling);
            });
            li.addEventListener("dragleave",(e)=>{
                e.preventDefault();
                e.target.style.backgroundColor = "inherit";
            });
            li.addEventListener("dragover",(e)=>{
                e.preventDefault();
                e.target.style.backgroundColor = "#cecece";
            });
            ul.appendChild(li);
    
        });
        callButtonFunctions();
        check();
    }
}

updateUI();

// local storage

function localStorageSetItem(item) {
    const newId = idGenerator();

    let array = (checkTaskArray())? getTaskArray(): [];
    let taskObj = {
        id: prefix + newId,
        task: item,
        isCompleted: 0
    }

    array.push(taskObj);

    storeTaskArray(array);
}

//generates random id

function idGenerator() {
    if (!localStorage.getItem(idGenPrefix)) {
        localStorage.setItem(idGenPrefix, 0);
        return localStorage.getItem(idGenPrefix);
    }
    let latestId = localStorage.getItem(idGenPrefix);
    latestId = Number(latestId) + 1;
    localStorage.setItem(idGenPrefix, latestId);
    return latestId;
}

//check if the added task is already existing in the array of tasks
function isDuplicate(value) {
    const items = Object.entries(localStorage);
    for (let i = 0; i < items.length; i++) {
        if (items[i][1].toLowerCase().replace(/ /ig, '') === value.toLowerCase().replace(/ /ig, '')) {
            return true;
        }
    }
    return false;
}



