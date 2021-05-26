
const darkmode = document.getElementById('darkmode');
const darkicon = document.querySelector('.fa-moon');
const addbtn = document.getElementById('add');
const ul = document.getElementById('lists');
const inputs = document.getElementById('inputs')
const prefix = "shang-";
const idGenPrefix = "id-generator";

addbtn.addEventListener('click', AddItem);
inputs.addEventListener('keydown', AddItemEnter);

document.body.addEventListener('keydown', function(e){
// console.log(e.keyCode);
    if(e.keyCode===46){

        const keys = Object.keys(localStorage);

        const filter = keys.filter(key => key.includes(prefix));
        for(let i = 0; i<filter.length; i++){

            localStorage.removeItem(filter[i]);

        }
        updateUI();

    }

})


function AddItem() {
    if (!inputs.value) {
        return;
    }

    if (isDuplicate(inputs.value)) {
        alert('already exist')
        return;
    }

    localStorageSetItem(inputs.value);
    updateUI();
    inputs.value = "";
}

function AddItemEnter(e) {
    if (e.keyCode === 13) {
        AddItem();
        e.preventDefault();
    }
}



// ui
function updateUI() {
    ul.innerHTML = '';
    const entryKeys = Object.keys(localStorage);
    const storageKeys = entryKeys.filter(key => key.includes(prefix)).sort();
    storageKeys.forEach(key => {
        const value = localStorage.getItem(key);
        let li = document.createElement('li');
        let lisettings = document.createElement('div');

        let iopt = document.createElement('i');
        let iconoptions = document.createElement('div');
        let edit = document.createElement('a');
        let del = document.createElement('a');

        let icheck = document.createElement('i');
        let labelcheck = document.createElement('label')
        let inputcheck = document.createElement('input')

        


        lisettings.classList.add('lists-settings');

        icheck.classList.add('fa', 'fa-check', 'complete');
        labelcheck.classList.add('checklabel');
        inputcheck.classList.add('check');
        inputcheck.setAttribute('type', 'checkbox');

        iopt.classList.add('fas', 'fa-ellipsis-v', 'option-icon');
        iconoptions.classList.add('options');
        edit.classList.add('edit', 'fas', 'fa-pen-square');
        del.classList.add('delete', 'fas', 'fa-trash');


        li.innerText = value;

        del.addEventListener('click', function () {
            const answ = confirm('do you want to delete ? ');
            if (answ) {
                localStorage.removeItem(key);
                updateUI();
            }
            return;
        })
        inputcheck.addEventListener('click', function(){
            // console.log('ok')
            li.classList.toggle('complete');
        })

        edit.addEventListener('click', function () {
            const newText = prompt(`Update ${value}`);
            if (newText === '' || newText == null) {
                return;
            }
            localStorage.setItem(key, newText);
            updateUI();
            return;
        })

        labelcheck.appendChild(inputcheck)
        icheck.appendChild(labelcheck);
        iconoptions.appendChild(edit);
        iconoptions.appendChild(del);
        iopt.appendChild(iconoptions);
        lisettings.appendChild(iopt);
        lisettings.appendChild(icheck);
        li.appendChild(lisettings);
        ul.appendChild(li);

    })
}

// local storage
function localStorageSetItem(item) {
    const newId = idGenerator();
    console.log(newId);
    localStorage.setItem(prefix + newId, item);
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

//darkmode
darkmode.addEventListener('click', function(){
    document.body.classList.toggle('bodydarkmode');
    darkicon.classList.toggle('dmode');
})