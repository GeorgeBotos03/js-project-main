const API = 'http://localhost:3000/todos';
const itemForm = document.getElementById('user-form');
const itemInput = document.getElementById('username')
const listElement = document.getElementById('item-list')
const clearBtn = document.getElementById('clear-item');

function renderList(todos) {
  listElement.innerHTML = todos.map(t => `
    <li data-id="${t.id}">
      ${t.title}
      <button class="edit-item" title="Edit" >
        <i class="fa-solid fa-pen"></i>
        </button>
      <button class="remove-item" title="Remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </li>
  `).join('');
  checkUI();
}


async function fetchingData() {
    try {
        const response = await fetch(API);
        const todos = await response.json();
        renderList(todos);
        
    } catch (error) {
        console.log('error')
    }
};


async function addItem(e){
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if(newItem === ''){
        alert('Please enter an item.')
        return;
    }

    const data = { title: newItem, completed: false,};
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(!res.ok){
            throw new Error('Error');
        
      } 
        const todo = await res.json();
    
        
        
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(todo))
    
        const button = createButton ('remove-item')
        li.appendChild(button);
    
        listElement.appendChild(li);
    
        
        checkUI();
        itemInput.value = '';
      
        
    } catch (error) {
        console.log(error)
    }

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
  
    try {
     if(e.target.parentElement.classList.contains('remove-item')) {
      if(confirm('Are you sure?')){
        
        const li = e.target.parentElement.parentElement;
        const id = li.dataset.id;
  
       
        if (id) {
          const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
          if(!res.ok){
            alert('Error deleting from server!');
            return;
          }
        }
  
       
        li.remove();
        checkUI();
      }
    }
    
    } catch (error) {
    console.log(error);
    }

}

async function editItem(e){
    if(e.target.closest('.edit-item')){
        const li = e.target.closest('li')
        const id = li.dataset.id
        const currentTitle = li.querySelector('.title');
        const newTitle = prompt('Edit task:', currentTitle);
         if(newTitle === '') return;

         try{
            const res = await fetch(`${API}/${id}`, {
                method: 'PATCH',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({ title: newTitle.trim() })
            })

            if(!res.ok) {
                throw new Error('Server error');
            }
            li.querySelector('.title').textContent = newTitle.trim();
         }catch(error){
            console.log(error);

         };
    };
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
listElement.addEventListener('click',editItem);

fetchingData();
checkUI();