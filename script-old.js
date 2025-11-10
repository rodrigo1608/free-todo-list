const todoForm = document.querySelector('.todo-form');

const newTaskInput = todoForm.querySelector('.todo-form__input');
const todoList = document.querySelector('.todo-list');



const appHeading = document.createElement('h1');
appHeading.classList.add('todo-app__heading');
console.log(appHeading);

const date = new Date();
const shortDate = date.toLocaleDateString('pt-BR', { dateStyle: 'short' });
appHeading.textContent = shortDate;

headerTodo.prepend(appHeading);

const buildTodo = (text) => {

    const newLabel = document.createElement('span');

    newLabel.textContent = text;
    newLabel.classList.add('todo-list__item-content');

    return newLabel
}

const buildActionButton = (iconID) => {

    const actionButton = document.createElement('button');
    actionButton.classList.add("todo-form__action-btn");
    actionButton.setAttribute('data-action', iconID)

    const editOrDeleteClass = iconID === 'edit' ? 'fill-edit' : 'fill-delete';   

    actionButton.innerHTML = `
        <svg class="todo-list__item-icon ${editOrDeleteClass}">
            <use href="icons.svg#${iconID}"></use>
        </svg>
        `;

    return actionButton;
}

const buildActionsContainer = () => {
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('todo-list__item-actions');

    const editButton = buildActionButton('edit');
    const deleteButton = buildActionButton('delete');

    actionContainer.append(editButton, deleteButton);
    return actionContainer;
}

const buildListItem = (textContent) =>{
    const item = document.createElement('li');
    item.classList.add('todo-list__item');

    const todo =  buildTodo(textContent);
    
    todo.classList.add('todo-list__item-todo');

    const actions = buildActionsContainer();

    item.append(todo, actions);
    return item;
} 

todoForm.addEventListener('submit', event => {

    event.preventDefault();
    const todo = newTaskInput.value.trim();
    
    if(!todo) return

    const newItem = buildListItem(todo);  

    todoList.appendChild(newItem);

    newTaskInput.value = '';  

});

todoList.addEventListener('click', event =>{

    const actionButton = event.target.closest('.todo-form__action-btn');

    if(actionButton){

        const action = actionButton.dataset.action;
        const listItem = actionButton.closest('.todo-list__item');        

        if (!listItem) return;

        if(action ==='delete'){
           listItem.remove();
        }

    }

    
})

