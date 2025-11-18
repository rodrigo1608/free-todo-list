
const openCreateTodoModalButton = document.querySelector('.button--new-todo');
const newTodoModalElement = document.getElementById('create-todo-modal');
const newTodoInput = document.getElementById('new-todo-input');
const closeCreateTodoModalButton = document.getElementById('close-create-todo');
const todoAppContainer = document.querySelector('.todo-app');
const todoAppHeading = document.createElement('h2');
const todoList = todoAppContainer.querySelector('.todo-list');
const emptyNotice = todoAppContainer.querySelector('.todo-app__empty-notice');
const newTodoForm = document.getElementById('new-todo-form');

const today = new Date();

const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

todoAppHeading.classList.add('todo-app__heading');
todoAppHeading.textContent = todayShortFormat;

todoAppContainer.prepend(todoAppHeading);

const toggleElement = element => element.classList.toggle('hidden');

const closeModalFromOutsideClick = event => {

    const shouldCloseModal = event.target.id === "create-todo-modal";

    if (shouldCloseModal) {
        toggleElement(newTodoModalElement);
    }

}

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

const buildElement = (elementName, classNames, content = null) => {

    const element = document.createElement(elementName);
    element.classList.add(...classNames);

    if (content) {
        element.textContent = content;
    }

    return element;
}

const buildCheckboxContent = () => {

    const checkboxContentWrapper = buildElement('div', ['todo-list__checkbox-content-wrapper']);
    const checkboxInput = buildElement('input', ['todo-list__checkbox']);

    checkboxInput.setAttribute('type', 'checkbox');

    const todo = buildElement('span', ['todo-list__text'], newTodoInput.value.trim());
    checkboxContentWrapper.append(checkboxInput, todo);

    return checkboxContentWrapper;
}

const buildButton = (buttonAttributes) => {

    const {
        iconID,
        classNamesIcon,
        classNamesButton,
        labelText,
        labelClasses
    } = buttonAttributes;

    const actionButton = buildElement('button', classNamesButton);
    actionButton.setAttribute('data-action', iconID);

    actionButton.innerHTML =
        `<svg class='${classNamesIcon.join(' ')}'>
    <use href="/icons.svg#${iconID}"></use>
    </svg>`

    if (labelText) {
        const actionButtonLabel = buildElement('span', labelClasses);
        actionButtonLabel.textContent = labelText;
        actionButton.append(actionButtonLabel);
    }

    return actionButton;

}

const openNewTodoModal = () => {
    toggleElement(newTodoModalElement);
    newTodoInput.focus();
}

const handleNewItemSubmit = event => {

    event.preventDefault();

    const newItem = buildElement('li', ['todo-list__item']);

    if (!newTodoInput.value.trim()) {
        toggleElement(newTodoModalElement);
        return
    }

    const checkboxContent = buildCheckboxContent();

    const todoOptionsButtonAttributes = {
        iconID: 'more',
        classNamesIcon: ['icon--secondary', 'icon-sm'],
        classNamesButton: ['button', 'button--secondary']
    };

    const todoOptionsButton = buildButton(todoOptionsButtonAttributes);

    newItem.append(checkboxContent, todoOptionsButton);

    todoList.append(newItem);

    updateContentVisibility();

    toggleElement(newTodoModalElement);

    newTodoInput.value = "";

}

updateContentVisibility();

openCreateTodoModalButton.addEventListener('click', openNewTodoModal);

closeCreateTodoModalButton.addEventListener('click', () => toggleElement(newTodoModalElement));

newTodoModalElement.addEventListener('click', closeModalFromOutsideClick);

newTodoForm.addEventListener('submit', handleNewItemSubmit);

const buildDropDownOption = (iconID, labelText) => {

    const iconStyle = iconID === 'delete' ? 'icon--danger' : 'icon--secondary';

    const actionButtonAttributes = {
        iconID: iconID,
        classNamesIcon:  [iconStyle, 'icon-sm'],
        classNamesButton: ['button', 'todo-list__action-option','todo-list__dropdown-option'],
        labelText: labelText,
        labelClasses: ['todo-list__action-option-label']
    };

    const actionButton = buildButton(actionButtonAttributes);

    return actionButton;
}

const buildDropDownOptions = () => {

    const dropDownContainer = buildElement('div', ['todo-list__dropdown', 'hidden']);

    const dropDownEditOption = buildDropDownOption('edit', 'Editar');
    const dropDownRemoveOption = buildDropDownOption('delete', 'Remover');

    dropDownContainer.append(dropDownEditOption, dropDownRemoveOption);

    return dropDownContainer;
}

const closeDropDowns = () => {

    todoList.querySelectorAll('.todo-list__dropdown').forEach(dropdown => {

        const isDropdownOpen = !dropdown.classList.contains('hidden');

        if (isDropdownOpen) {
            dropdown.classList.add('hidden');
        }

    });

}

const handleDropDown = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');

    const wasOpen = dropDownOptions && !dropDownOptions.classList.contains('hidden');

    closeDropDowns();

    if (!dropDownOptions) {

        dropDownOptions = buildDropDownOptions();
        currentTodo.append(dropDownOptions);

    }

    if (!wasOpen) dropDownOptions.classList.remove('hidden');

}

todoList.addEventListener('click', event => {

    const currentTodoActionOption = event.target.closest('[data-action="more"]');

    if (currentTodoActionOption) {
        const currentTodo = event.target.closest('.todo-list__item');
        handleDropDown(currentTodo);
    }

});

document.addEventListener('click', event => {

    const isClickOnMoreButton = event.target.closest('[data-action="more"]');

    if (isClickOnMoreButton) return;

    const isClickInsideDropdown = event.target.closest('.todo-list__dropdown');

    if (!isClickInsideDropdown) {
        closeDropDowns();
    }

});
