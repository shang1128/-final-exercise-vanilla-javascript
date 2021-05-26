const addbtn = document.getElementById('add');
const ul = document.getElementById('lists');
const inputs = document.getElementById('inputs')
const prefix = "shang-";
const idGenPrefix = "id-generator";
const addTaskForm = document.querySelector(".add-task-form");
const tasksArray = "tasks-array";


//check if the array for task exists

let checkTaskArray = ()=>{
    return (localStorage.getItem(tasksArray) != null)? true: false;
}

let getTaskArray = ()=> {
    return JSON.parse(localStorage.getItem(tasksArray));
}

let storeTaskArray = (TaskArray)=> {
    localStorage.setItem(tasksArray,JSON.stringify(TaskArray));
}

//insert function

let insertFunc = ()=>{
    localStorageSetItem(inputs.value);
    updateUI();
    inputs.value = "";
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



//delete tasks buttons

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

// edit task buttons

let editTask = ()=>{
    document.querySelectorAll(".edit").forEach((elem,index)=>{
        elem.addEventListener("click", ()=>{
            document.querySelectorAll("li span")[index].innerHTML = `<input type='text' class='edit-input' value='${elem.innerText}'>`;
        });
    });
}

let callButtonFunctions = () =>{
    deleteTask();
    editTask();
}



// ui
function updateUI() {
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
    
    
            span.innerText = value;
    
            iconoptions.appendChild(edit);
            iconoptions.appendChild(del);
            iopt.appendChild(iconoptions);
            lisettings.appendChild(icheck);
            lisettings.appendChild(iopt);
            li.appendChild(span);
            li.appendChild(lisettings);
            ul.appendChild(li);
    
        });
        callButtonFunctions();
    }
}

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

function isDuplicate(value) {
    const items = Object.entries(localStorage);
    for (let i = 0; i < items.length; i++) {
        if (items[i][1].toLowerCase().replace(/ /ig, '') === value.toLowerCase().replace(/ /ig, '')) {
            return true;
        }
    }
    return false;
}

updateUI();

document.querySelectorAll(".edit-input").forEach( (elem,index) => {
    elem.addEventListener("keypress", (e) => {
        alert(5);
    }); 
});

//check completed buttons

document.querySelectorAll(".complete").forEach( (elem,index) => {
    elem.addEventListener("click", ()=>{
        
        let tasks = getTaskArray();

        elem.style.color = (tasks[index].isCompleted != 0)? "#c7bebe": "#18be09";
        tasks[index].isCompleted = (tasks[index].isCompleted == 0)? 1: 0;
        storeTaskArray(tasks);
    });
});

