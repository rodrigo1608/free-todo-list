const newTaskButton = document.querySelector('.new-task-button');

newTaskButton.addEventListener('click',() => {
    console.log('open create new task modal');
})

const appMain = document.querySelector('.todo-app');
const today = new Date();

const todayShortFormat = today.toLocaleString('pt-BR',{dateStyle:'short'});

const todoAppHeading = document.createElement('h2');
todoAppHeading.classList.add('todo-app__heading');
todoAppHeading.textContent = todayShortFormat;

appMain.prepend(todoAppHeading);

const todoList = appMain.querySelector('.todo-list');

if(!todoList.childElementCount){

 const emptyNotice = document.createElement('span');
 emptyNotice.classList.add('todo-list__empty-notice');
 emptyNotice.textContent = "🚀 Nenhuma tarefa encontrada. Hora de adicionar algo novo!";

 todoList.prepend(emptyNotice);

}




