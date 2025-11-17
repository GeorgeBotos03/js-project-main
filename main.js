const API = 'http://localhost:3000/todos';
const itemForm = document.getElementById('user-form');
const itemInput = document.getElementById('username')
const listElement = document.getElementById('item-list')
const clearBtn = document.getElementById('clear-item');

function renderList(todos) {
  listElement.innerHTML = todos.map(t => `
    <li data-id="${t.id}">
      ${t.title}
      <button class="remove-item" title="Remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </li>
  `).join('');
  checkUI();
}


async function fetchingData() {
    const response = await fetch(API);
    const todos = await response.json();
    renderList(todos);
};


async function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if(newItem === ''){
        alert('Please enter an item.')
        return;
    }

    const data = { title: newItem, completed: false,};
    const res = await fetch(API, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
    });
    if(!res.ok){
        alert('Eroare');
        return;
  }

    
    
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem))

    const button = createButton ('remove-item')
    li.appendChild(button);

    listElement.appendChild(li);

    
    checkUI();
    itemInput.value = '';
  

};


function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon ('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

async function removeItem(e){
  
  if(e.target.parentElement.classList.contains('remove-item')) {
    if(confirm('Are you sure?')){
      
      const li = e.target.parentElement.parentElement;
      const id = li.dataset.id;

     
      if (id) {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if(!res.ok){
          alert('Eroare la ștergere din server!');
          return;
        }
      }

     
      li.remove();
      checkUI();
    }
  }
}


function clearItems(){
    if(confirm('Are you sure?')){

        listElement.innerHTML = "";
    }
    checkUI();
}

function checkUI(){
    const items = listElement.querySelectorAll('li');
    if(items.length === 0) {
        clearBtn.style.display = 'none';
    }else{
        clearBtn.style.display = 'block'
    }
}

itemForm.addEventListener('submit', addItem);
listElement.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItems);

// fetchingData();
checkUI();