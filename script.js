const newTaskButton = document.querySelector('.new-task-button');
const createModal = document.getElementById('create-modal');
const newTodoInput = document.getElementById('new-todo-input');

const togleModal = modal => modal.classList.toggle('toggle-modal');

newTaskButton.addEventListener('click', () => {    
    togleModal(createModal);
    newTodoInput.focus();
})

const modalButtonClose = document.getElementById('close-create-todo');

modalButtonClose.addEventListener('click',() => togleModal(createModal));

createModal.addEventListener('click', event => {
    const shouldCloseModal = event.target.id === "create-modal";
    if(shouldCloseModal){
        togleModal(createModal);
    }
})

// const closeCreateTodo = document.getElementById('close-create-todo');

const appMain = document.querySelector('.todo-app');
const today = new Date();

const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

const todoAppHeading = document.createElement('h2');
todoAppHeading.classList.add('todo-app__heading');
todoAppHeading.textContent = todayShortFormat;

appMain.prepend(todoAppHeading);

const todoList = appMain.querySelector('.todo-list');

if (!todoList.childElementCount) {

    const emptyNotice = document.createElement('span');
    emptyNotice.classList.add('todo-list__empty-notice');
    emptyNotice.textContent = "🚀 Nenhuma tarefa encontrada. Hora de adicionar algo novo!";

    todoList.prepend(emptyNotice);

}




