document.addEventListener('DOMContentLoaded', () => {

    const openCreateTodoModalButton = document.querySelector('.new-todo-button');
    const newTodoModalElement = document.getElementById('create-modal');
    const newTodoInput = document.getElementById('new-todo-input');

    const toggleElement = element => element.classList.toggle('hidden');

    openCreateTodoModalButton.addEventListener('click', () => {
        toggleElement(newTodoModalElement);
        newTodoInput.focus();
    })

    const closeCreateTodoModalButton = document.getElementById('close-create-todo');

    closeCreateTodoModalButton.addEventListener('click', () => toggleElement(newTodoModalElement));

    const closeModalFromOutsideClick = event => {

        const shouldCloseModal = event.target.id === "create-modal";

        if (shouldCloseModal) {
            toggleElement(newTodoModalElement);
        }

    }

    newTodoModalElement.addEventListener('click', closeModalFromOutsideClick);

    const todoAppContainer = document.querySelector('.todo-app');

    const today = new Date();

    const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

    const todoAppHeading = document.createElement('h2');

    todoAppHeading.classList.add('todo-app__heading');
    todoAppHeading.textContent = todayShortFormat;

    todoAppContainer.prepend(todoAppHeading);

    const todoList = todoAppContainer.querySelector('.todo-list');
    const emptyNotice = todoAppContainer.querySelector('.todo-app__empty-notice');


    const updateContentVisibility = () => {

        if (todoList.childElementCount > 0) {
            emptyNotice.classList.add('hidden');
            todoList.classList.remove('hidden');
        }

        else {
            emptyNotice.classList.remove('hidden');
            todoList.classList.add('hidden');
        }
    }

    updateContentVisibility();

    // const registerTodoButton = document.querySelector('.new-todo-form__submit-button');

    const buildElement = (elementName, className, content = null) => {

        const element = document.createElement(elementName);

        element.classList.add(className);

        if (content) {
            element.textContent = content;
        }

        return element;
    }

    const buildCheckboxContent = () => {

        const checkboxContentWrapper = buildElement('div', 'todo-list__checkbox-content-wrapper');
        const checkboxInput = buildElement('input', 'todo-list__checkbox');
        checkboxInput.setAttribute('type', 'checkbox');

        const todo = buildElement('span', 'todo-list__todo', newTodoInput.value.trim());
        checkboxContentWrapper.append(checkboxInput, todo);

        return checkboxContentWrapper;
    }

    const buildActionsButton = (iconID, style = 'primary', additionalClass = null) => {

        styleButtonClass = style === 'primary' ? 'bg-blue' : 'bg-gray';
        styleIconClass = style === 'primary' ? 'button-icon' : 'button-icon--secondary';

        const classesToAdd = [styleButtonClass, additionalClass].filter(Boolean);

        const actionButton = buildElement('button', 'button');
        actionButton.classList.add(...classesToAdd);
        actionButton.setAttribute('data-action', iconID);

        actionButton.innerHTML =
            `<svg class='${styleIconClass} action-modal-icon'>
                <use href="/icons.svg#${iconID}"></use>
          </svg>`

        return actionButton;

    }

    const newTodoForm = document.getElementById('new-todo-form');

    newTodoForm.addEventListener('submit', event => {

        event.preventDefault();

        const newItem = buildElement('li', 'todo-list__item');

        if (!newTodoInput.value.trim()) {
            toggleElement(newTodoModalElement);
            return
        }

        const checkboxContent = buildCheckboxContent(newTodoForm);

        const checkboxWrapper = buildElement('div', 'todo-list__checkbox-input-wrapper');

        checkboxWrapper.append(checkboxContent);

        optionActionButton = buildActionsButton('more', 'secondary', 'relative');

        newItem.append(checkboxContent, optionActionButton);

        todoList.append(newItem);

        updateContentVisibility();

        toggleElement(newTodoModalElement);

        newTodoInput.value = "";

    });

    const buildDropDownOptions = () => {
        const dropDownContainer = buildElement('div', 'todo-list__action-options');
        return dropDownContainer;

    }

    todoList.addEventListener('click', event => {

        const currentTodoActionOption = event.target.closest('[data-action="more"]');


        if (currentTodoActionOption) {

            const deleteActionButton = buildActionsButton('delete', 'secondary', 'relative');
            const editActionButton = buildActionsButton('edit', 'secondary', 'relative');

            console.log(currentTodoActionOption);
            const dropDownOptions = buildDropDownOptions();

            currentTodoActionOption.append(dropDownOptions);

        }

    });

});