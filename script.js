
const openCreateTodoModalButton = document.querySelector('.button--new-todo');
const newTodoModalElement = document.getElementById('create-todo-modal');
const newTodoInput = document.getElementById('new-todo-input');
const todoAppContainer = document.querySelector('.todo-app');
const todoList = todoAppContainer.querySelector('.todo-list');
const emptyNotice = todoAppContainer.querySelector('.todo-app__empty-notice');
const newTodoForm = document.getElementById('new-todo-form');

const today = new Date();
const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

const todos = [];

const createTodoObject = text => {

    const todoObject = {
        id: Date.now(),
        text: text.trim(),
        isDone: false,
        createdAt: new Date()
    };

    todos.push(todoObject);

    return todoObject;

}

const updateTodoData = (todoElement, changes = {}) => {

    id = Number(todoElement.dataset.id);
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) return;

    if (changes.text !== undefined && changes.text.trim() === "") {
        delete changes.text;
    }

    if (!Object.keys(changes).length) return todoToUpdate;

    Object.assign(todoToUpdate, changes);

    return todoToUpdate;

}

const toggleElement = (element, forceValue) => element.classList.toggle('is-hidden', forceValue);

const updateContentVisibility = () => {

    const hasItems = todoList.childElementCount > 0;

    toggleElement(emptyNotice, hasItems);
    toggleElement(todoList, !hasItems);
}

const buildElement = (elementName, classNames = [], options = {}) => {

    const element = document.createElement(elementName);
    const safeOptions = options || {};
    const { content, ...attributes } = safeOptions;

    if (classNames.length) element.classList.add(...classNames);

    if (content !== undefined) {
        const tagName = element.tagName.toLowerCase();
        tagName === 'input' || tagName === 'textarea' ?
            element.value = content :
            element.textContent = content;
    }

    Object.entries(attributes).forEach(([key, value]) => {

        if (typeof value === 'boolean') {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    });

    return element;
}

const buildCheckboxContent = text => {

    const checkboxContentWrapper = buildElement('div', ['todo-list__checkbox-content-wrapper']);
    const checkboxInput = buildElement('input', ['todo-list__checkbox'], { type: 'checkbox', 'data-action': 'check' });
    const todo = buildElement('span', ['todo-list__text'], { content: text });

    checkboxContentWrapper.append(checkboxInput, todo);

    return checkboxContentWrapper;
}

const buildSVGIncon = (classNames, id) => {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');

    svg.classList.add(...classNames);

    const useElement = document.createElementNS(svgNS, 'use');
    useElement.setAttribute('href', `/icons.svg#${id}`);

    svg.appendChild(useElement);

    return svg;
}

const buildButton = buttonAttributes => {

    const {
        iconId,
        classNamesIcon,
        classNamesButton,
        labelText,
        labelClasses
    } = buttonAttributes;

    const actionButton = buildElement('button', classNamesButton, { 'data-action': iconId });
    const svgElement = buildSVGIncon(classNamesIcon, iconId);

    actionButton.appendChild(svgElement);

    if (labelText) {
        const actionButtonLabel = buildElement('span', labelClasses, { content: labelText });
        actionButton.append(actionButtonLabel);
    }

    return actionButton;

}

const buildDropDownOption = (iconId, labelText) => {

    const iconStyle = iconId === 'delete' ? 'icon--danger' : 'icon--secondary';

    const actionButtonAttributes = {
        iconId: iconId,
        classNamesIcon: [iconStyle, 'icon-sm'],
        classNamesButton: ['button', 'todo-list__dropdown-option'],
        labelText: labelText,
        labelClasses: ['todo-list__action-option-label']
    };

    const actionButton = buildButton(actionButtonAttributes);

    return actionButton;
}

const buildDropDownOptions = () => {

    const dropDownContainer = buildElement('div', ['todo-list__dropdown', 'is-hidden']);

    const dropDownEditOption = buildDropDownOption('edit', 'Editar');
    const dropDownRemoveOption = buildDropDownOption('delete', 'Remover');

    dropDownContainer.append(dropDownEditOption, dropDownRemoveOption);

    return dropDownContainer;
}

const buildTodo = ({ id, text }) => {

    const todo = buildElement('li', ['todo-list__item'], { 'data-id': id });
    const checkboxContent = buildCheckboxContent(text);

    const todoOptionsButtonAttributes = {
        iconId: 'more',
        classNamesIcon: ['icon--secondary', 'icon-sm'],
        classNamesButton: ['button', 'button--secondary']
    };

    const todoOptionsButton = buildButton(todoOptionsButtonAttributes);
    const dropDownOptions = buildDropDownOptions();
    todo.append(checkboxContent, todoOptionsButton, dropDownOptions);

    return todo;
}

const openNewTodoModal = () => {
    toggleElement(newTodoModalElement, false);
    newTodoInput.focus();
}

const closeDropDowns = () => {
    todoList.querySelectorAll('.todo-list__dropdown').forEach(dropdown => {
        toggleElement(dropdown, true);
    });
}

const updateEditOptionVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');
    const currentCheckbox = currentTodo.querySelector('.todo-list__checkbox');
    const dropDownEditButton = dropDownOptions.querySelector('[data-action="edit"]');

    toggleElement(dropDownEditButton, currentCheckbox.checked);

}

const updateDropDownVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');

    const wasOpen = !dropDownOptions.classList.contains('is-hidden');

    closeDropDowns();

    toggleElement(dropDownOptions, wasOpen);

    updateEditOptionVisibility(currentTodo);

}

const finalizeTodoEdit = (currentTodo, editInput) => {

    const updatedTodoData = updateTodoData(currentTodo, {text:editInput.value});
    const newText = updatedTodoData.text;

    const newTodoTextElement = buildElement('span', ['todo-list__text'], { content: newText });
    const checkboxContentWrapper = currentTodo.querySelector('.todo-list__checkbox-content-wrapper');

    checkboxContentWrapper.replaceChild(newTodoTextElement, editInput);

    const moreButton = currentTodo.querySelector('[data-action="more"]');
    moreButton.classList.remove('is-hidden');
}

const enableTodoEdit = todoElement => {

    closeDropDowns();

    const currentTodo = todos.find(todo => todo.id === Number(todoElement.dataset.id));

    if (!currentTodo) return;

    const editInputAttributes = { content: currentTodo.text, type: 'text' }

    const editInput = buildElement('input', ['todo-list__edit-input'], editInputAttributes);

    const checkboxContentWrapper = todoElement.querySelector('.todo-list__checkbox-content-wrapper');
    const todoTextElement = todoElement.querySelector('.todo-list__text');
    checkboxContentWrapper.replaceChild(editInput, todoTextElement);

    editInput.focus();

    editInput.addEventListener('keypress', event => {

        if (event.key === 'Enter') {
            event.preventDefault();

            editInput.blur();
        }
    });

    editInput.addEventListener('blur', () => {
        setTimeout(() => finalizeTodoEdit(todoElement, editInput), 0);
    });


    const moreButton = todoElement.querySelector('[data-action="more"]');
    moreButton.classList.add('is-hidden');
}

const handleNewTodoSubmit = event => {

    event.preventDefault();

    const todoText = newTodoInput.value;

    if (!todoText) {
        toggleElement(newTodoModalElement, true);
        newTodoInput.value = "";
        return
    }

    const todoObject = createTodoObject(todoText);

    const newTodo = buildTodo(todoObject);

    todoList.append(newTodo);

    updateContentVisibility();

    toggleElement(newTodoModalElement);

    newTodoInput.value = "";

}

const handleClickToCloseModal = event => {

    const closeCreateTodoModalButton = event.target.closest('#close-create-todo');
    const outside = event.target.id === "create-todo-modal";
    const shouldCloseModal = outside || closeCreateTodoModalButton;

    toggleElement(newTodoModalElement, shouldCloseModal);
}

const handleDropdownVisibility = event => {

    const currentTodoOptionsButton = event.target.closest('[data-action="more"]');

    if (currentTodoOptionsButton) {
        const currentTodo = event.target.closest('.todo-list__item');
        updateDropDownVisibility(currentTodo);

        return
    }

    const isClickInsideDropdown = event.target.closest('.todo-list__dropdown');
    if (!isClickInsideDropdown) {
        closeDropDowns();
    }
}

const handleTodoActionClick = event => {

    const currentTodo = event.target.closest('.todo-list__item');
    if (!currentTodo) return;

    const actionElement = event.target.closest('[data-action]');

    if (!actionElement) return;

    const action = actionElement.getAttribute('data-action');

    switch (action) {
        case 'check':
            updateTodoData(currentTodo, { isDone: actionElement.checked })
            break;

        case 'edit':
            enableTodoEdit(currentTodo);
            break;

        case 'delete':
            const indexOfTodoData = todos.findIndex(todo => todo.id === Number(currentTodo.dataset.id));
            if (indexOfTodoData !== -1) todos.splice(indexOfTodoData, 1);
            currentTodo.remove();
            updateContentVisibility();
            break;

        default:
            return;
    }
};

const handleGlobalKeyDown = event => {
    if (event.key === 'Escape') {

        if (!newTodoModalElement.classList.contains('is-hidden')) {
            toggleElement(newTodoModalElement, true);
            newTodoInput.value = "";
            return
        }

        closeDropDowns();

        const activeEditInput = todoList.querySelector('.todo-list__edit-input');
        if (activeEditInput) {
            activeEditInput.value = "";
            activeEditInput.blur();
        }
    }
};

const todoAppHeading = buildElement('h2', ['todo-app__heading'], { content: todayShortFormat });
todoAppContainer.prepend(todoAppHeading);

updateContentVisibility();

todoList.addEventListener('click', handleTodoActionClick);

openCreateTodoModalButton.addEventListener('click', openNewTodoModal);

newTodoModalElement.addEventListener('click', handleClickToCloseModal);

newTodoForm.addEventListener('submit', handleNewTodoSubmit);

document.addEventListener('click', handleDropdownVisibility);

document.addEventListener('keydown', handleGlobalKeyDown);