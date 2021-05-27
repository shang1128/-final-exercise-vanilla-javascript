const darkmode = document.getElementById('darkmode');
const darkicon = document.querySelector('.fa-moon');
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
    if(taskArray){
        taskArray.forEach(elem => {
            count += (elem.isCompleted == 0)? 1: 0;
        });
    }

    countText.innerText = `${count} Items left`;
}

count();

//insert function

let insertFunc = ()=>{
    if(inputs.value != ''){
        localStorageSetItem(inputs.value);
        check();
        updateUI();
        inputs.value = "";
        count();
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

    if (isDuplicate(inputs.value)) {
        alert('already exist')
        return;
    }

    insertFunc();
    
});



//delete tasks buttons with delete functionality

let deleteTask = () => {
    document.querySelectorAll(".delete").forEach( (elem,index) => {
        elem.addEventListener("click", (e)=>{
            e.preventDefault();
            let taskArray = getTaskArray();
            let deleteIndex = pos = taskArray.map((elem) => { return elem.id; }).indexOf(e.target.id.split("_")[0]);
            taskArray.splice(deleteIndex,1);
            console.log(taskArray);
            storeTaskArray(taskArray);
            document.querySelector(`#${e.target.id.split("_")[0]}`).style.display = "none";
        });
    });
}

//swap display

let swapDisplay = (element1,element2) => {
    element1.style.display = (element1.style.display == "none")? "flex": "none";
    element2.style.display = (element2.style.display == "none")? "flex": "none";
}

//edit functionality

let editFunction = (index) => {
    let taskArray = getTaskArray();
    if(document.querySelector(`#${index}-input`)){
        document.querySelector(`#${index}-form`).addEventListener("submit", (e) => {
            e.preventDefault();
            let textvalue = document.querySelector(`#${index}-input`).value;
            if(isDuplicate(textvalue)) return;
            taskArray = taskArray.map( elem=> {
                return (elem.id == index)? {id:elem.id, task:textvalue, isCompleted: elem.isCompleted}: elem;
            });
            document.querySelector(`#${index}-span`).innerText = textvalue;
            swapDisplay(document.querySelector(`#${index}-form`),document.querySelector(`#${index}-span`));
            storeTaskArray(taskArray);
        });
    }
    
}



// edit task buttons

let editTask = ()=>{
    document.querySelectorAll(".edit").forEach((elem)=>{
        elem.addEventListener("click", (e)=>{
            let index = e.target.id;
            let textElement = document.querySelector(`#${index}-span`);
            let formElement = document.querySelector(`#${index}-form`);
            
            let forms = document.querySelectorAll("li form");
            let span = document.querySelectorAll("li span");
            forms.forEach( (elem,index) => {
                elem.style.display = "none";
                span[index].style.display = "flex";
            });

            swapDisplay(textElement,formElement);
            editFunction(index);
            
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

// update the lists in the to do list, call everytime to update

let updateUI = ()=>{
    ul.innerHTML = '';
    //const entryKeys = Object.keys(localStorage);
    //const storageKeys = entryKeys.filter(key => key.includes(prefix)).sort();

    let tasks = getTaskArray();
    if(tasks){
        let count = 0;
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
            span.setAttribute("id",`${elem.id}-span`);

            let editform = document.createElement('form');
            let editinput = document.createElement('input');
            let hiddeninput = document.createElement('input');
            let editbutton = document.createElement('button');
            let cancelbutton = document.createElement('button');
            let editicon = document.createElement('i');
            let cancelicon = document.createElement('i');
            editform.className = "edit-form";
            editform.setAttribute("id",`${elem.id}-form`);
            editform.style.display = "none";
            editicon.classList.add('fas','fa-edit');
            cancelicon.classList.add('far','fa-window-close');
            editinput.className = "edit-input";
            hiddeninput.setAttribute("type","hidden");
            hiddeninput.setAttribute("value",elem.id);
            hiddeninput.className = "edit-index";
            editinput.setAttribute("type","text");
            editinput.setAttribute("id",`${elem.id}-input`);
            editinput.setAttribute("value",elem.task);
            editbutton.setAttribute("type","submit");
            editbutton.className = "edit-submit";
            cancelbutton.className = "cancel-submit";
            editbutton.appendChild(editicon);
            cancelbutton.appendChild(cancelicon);
            editform.appendChild(editinput);
            editform.appendChild(hiddeninput);
            editform.appendChild(editbutton);
            editform.appendChild(cancelbutton);
    
    
            lisettings.classList.add('lists-settings');
            icheck.classList.add('fa', 'fa-check', 'complete');
            icheck.style.color = (elem.isCompleted == 0)? "#c7bebe": "#18be09";
            iopt.classList.add('fas', 'fa-ellipsis-v', 'option-icon');
            iconoptions.classList.add('options');
            edit.classList.add('edit', 'fas', 'fa-pen-square');
            edit.setAttribute("id",elem.id);
            del.classList.add('delete', 'fas', 'fa-trash');
            del.setAttribute("id",`${elem.id}_delete`);

            span.innerText = value;
    
            iconoptions.appendChild(edit);
            iconoptions.appendChild(del);
            iopt.appendChild(iconoptions);
            lisettings.appendChild(iopt);
            lisettings.appendChild(icheck); 
            li.appendChild(span);
            li.appendChild(editform);
            li.appendChild(lisettings);
            li.setAttribute("draggable",true);
            li.setAttribute("id",elem.id);


            cancelbutton.addEventListener('click', function(){
                // console.log('cancel');
                swapDisplay(editform,span);
            })
            //when the user starts dragging the task

            li.addEventListener("dragstart",(e)=>{
                e.dataTransfer.setData("text",e.target.id);
            });

            //when the user drops the task

            li.addEventListener("drop",(e)=>{
                e.preventDefault();
                let droptarget = document.querySelector(`#${e.target.id}`);
                let dragtarget = document.querySelector(`#${e.dataTransfer.getData("text")}`);
                let droptargetid = e.target.id;
                let dragtargetid = e.dataTransfer.getData("text");

                let taskArray = getTaskArray();

                let dropindex = taskArray.map( elem => {return elem.id}).indexOf(droptargetid);
                let dragindex = taskArray.map( elem => {return elem.id}).indexOf(dragtargetid);
                console.log(taskArray);
                let target = taskArray[dragindex];
                taskArray.splice(dragindex, 1);
                taskArray.splice(dropindex,0, target);

                console.log(taskArray);
                //droptarget.parentNode.insertBefore(dragtarget, droptarget);
                storeTaskArray(taskArray);
                updateUI();
            });

            //when the dragging leaves a task item li

            li.addEventListener("dragleave",(e)=>{
                e.preventDefault();
                document.querySelectorAll("li").forEach((elem,index) => {
                    elem.style.backgroundColor = (index % 2 == 0)? "#ececec": "white";
                });
            });

            //when the user drags over a task item li

            li.addEventListener("dragover",(e)=>{
                e.preventDefault();
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
    const items = JSON.parse(localStorage.getItem('tasks-array'));
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
        if (items[i].task.toLowerCase().replace(/ /ig, '') === value.toLowerCase().replace(/ /ig, '')) {
            return true;
        }
    }
    return false;
}

//darkmode
darkmode.addEventListener('click', function(){
    const bodydm = document.querySelector('.bodydm');
    bodydm.classList.toggle('bodydarkmode');
    darkicon.classList.toggle('dmode');
})


document.body.addEventListener('keydown', function(e){
    // console.log(e.keyCode);
        if(e.keyCode===46){
    
           localStorage.removeItem('tasks-array');
           updateUI();
            }
    
        });