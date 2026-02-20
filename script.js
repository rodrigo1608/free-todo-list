
const openCreateTodoModalButton = document.querySelector('.button--new-todo');
const newTodoModalElement = document.getElementById('create-todo-modal');
const newTodoInput = document.getElementById('new-todo-input');
const todoAppContainer = document.querySelector('.todo-app');
const todoList = todoAppContainer.querySelector('.todo-list');
const emptyNotice = todoAppContainer.querySelector('.todo-app__empty-notice');
const newTodoForm = document.getElementById('new-todo-form');

const today = new Date();
const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

const todos = JSON.parse(localStorage.getItem('todoData')) || [];

const setTodoStorage = () => localStorage.setItem('todoData', JSON.stringify(todos));

const createTodoObject = text => {

    const todoObject = {
        id: Date.now(),
        text: text.trim(),
        isDone: false,
        createdAt: new Date()
    };

    todos.push(todoObject);

    setTodoStorage();

    return todoObject;

}


const toggleElement = (element, forceValue) => element.classList.toggle('is-hidden', forceValue);

const updateContentVisibility = () => {

    const hasItems = todoList.childElementCount > 0;

    toggleElement(emptyNotice, hasItems);
    toggleElement(todoList, !hasItems);
}

const renderSavedTodos = () => {
    // Percorre o array que veio do LocalStorage
    todos.forEach(todoObject => {
        // Cria o elemento li usando sua função buildTodo
        const todoElement = buildTodo(todoObject);

        // Verifica se o dado diz que está pronto e marca o checkbox
        if (todoObject.isDone) {
            const checkbox = todoElement.querySelector('.todo-list__checkbox');
            if (checkbox) checkbox.checked = true;
        }

        // Adiciona na lista física (DOM)
        todoList.append(todoElement);
    });

    // Atualiza se mostra a mensagem de "vazio" ou a lista
    updateContentVisibility();
};


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
        dataId,
        classNamesIcon,
        classNamesButton,
        labelText,
        labelClasses
    } = buttonAttributes;

    const actionButton = buildElement('button', classNamesButton, { 'data-action': dataId });

    if (classNamesIcon) {
        const svgElement = buildSVGIncon(classNamesIcon, dataId);
        actionButton.appendChild(svgElement);
    }

    if (labelText) {
        const actionButtonLabel = buildElement('span', labelClasses, { content: labelText });
        actionButton.append(actionButtonLabel);
    }

    return actionButton;

}

const buildDropDownOption = (iconId, labelText) => {

    const iconStyle = iconId === 'delete' ? 'icon--danger' : 'icon--secondary';

    const actionButtonAttributes = {
        dataId: iconId,
        classNamesIcon: [iconStyle, 'icon-sm'],
        classNamesButton: ['button', 'button--secondary', 'button--dropdown'],
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
        dataId: 'more',
        classNamesIcon: ['icon--secondary', 'icon-sm'],
        classNamesButton: ['button', 'button--secondary']
    };

    const todoOptionsButton = buildButton(todoOptionsButtonAttributes);
    const dropDownOptions = buildDropDownOptions();
    todo.append(checkboxContent, todoOptionsButton, dropDownOptions);

    return todo;
}

const buildTodoEditor = currentTodo => {

    const editInputAttributes = {
        content: currentTodo.text,
        type: 'text',
        id: "edit-todo-input",
        name: 'editTodoInput',
        autocomplete: 'off'
    }

    const editorcontainer = buildElement('form', ['todo-list__edit-container'], { id: "edit-todo-form" });
    const editInput = buildElement('input', ['todo-list__edit-input'], editInputAttributes);
    const editButtonsContainer = buildElement('div', ['todo-list__edit-buttons-container']);

    const editButtonAttributes = {

        cancel: {
            classNamesButton:
                ['button', 'button--secondary', 'button--edit-option'],
            labelText: 'Cancelar',
            labelClasses: ['label'],
            dataId: 'cancel'
        },

        confirm: {
            classNamesButton: ['button', 'button--primary', 'button--edit-option'],
            labelText: 'Salvar',
            labelClasses: ['label', 'label--primary'],
            dataId: 'confirm',
            type: 'submit',
        }
    }

    const editButtonCancel = buildButton(editButtonAttributes.cancel);
    const editButtonConfirm = buildButton(editButtonAttributes.confirm);

    editButtonsContainer.prepend(editButtonCancel, editButtonConfirm);
    editorcontainer.prepend(editInput, editButtonsContainer);

    return editorcontainer;
}

const openNewTodoModal = () => {
    toggleElement(newTodoModalElement, false);
    newTodoInput.focus();
    closeEditors();
}

const closeDropDowns = () => {
    todoList.querySelectorAll('.todo-list__dropdown').forEach(dropdown => {
        toggleElement(dropdown, true);
    });
}

const closeEditors = () => {
    todoList.querySelectorAll('.todo-list__item').forEach(todo => {
        const isEditing = todo.querySelector('.todo-list__edit-container');

        if (isEditing) {
            finalizeTodoEdit(todo, false);
        }
    });
}

const findTodoByElement = ({ dataset }) => todos.find(todo => todo.id === Number(dataset.id));

const updateTodoData = (todoElement, changes = {}) => {

    const todoToUpdate = findTodoByElement(todoElement);

    if (!todoToUpdate) return;

    let finalChanges = changes;

    if (changes.text !== undefined && changes.text.trim() === "") {
        const { text, ...rest } = changes;
        finalChanges = rest;
    }

    if (!Object.keys(finalChanges).length) return todoToUpdate;

    Object.assign(todoToUpdate, finalChanges);
    setTodoStorage();

    return todoToUpdate;

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

const finalizeTodoEdit = (todoElement, shouldSave = true) => {

    const todoEditor = todoElement.querySelector('.todo-list__edit-container');
    const editInput = todoEditor.querySelector('.todo-list__edit-input');

    let displayText = findTodoByElement(todoElement).text;
    const shouldUpdate = shouldSave || editInput.value.trim() !== "";

    if (shouldUpdate) {
        const updatedTodoData = updateTodoData(todoElement, { text: editInput.value });
        displayText = updatedTodoData.text;
        setTodoStorage();
    }

    const newTodoTextElement = buildElement('span', ['todo-list__text'], { content: displayText });

    const checkboxContentWrapper = todoElement.querySelector('.todo-list__checkbox-content-wrapper');

    const currentCheckbox = todoElement.querySelector('.todo-list__checkbox');

    checkboxContentWrapper.replaceChild(newTodoTextElement, todoEditor);

    const moreButton = todoElement.querySelector('[data-action="more"]');
    moreButton.classList.remove('is-hidden');
    currentCheckbox.classList.remove('is-hidden');
}

const enableTodoEdit = todoElement => {

    closeDropDowns();
    closeEditors();

    const currentTodo = todos.find(todo => todo.id === Number(todoElement.dataset.id));

    if (!currentTodo) return;

    const todoEditor = buildTodoEditor(currentTodo);

    const editInput = todoEditor.querySelector('.todo-list__edit-input');
    const checkboxContentWrapper = todoElement.querySelector('.todo-list__checkbox-content-wrapper');
    const todoTextElement = todoElement.querySelector('.todo-list__text');
    const currentCheckbox = todoElement.querySelector('.todo-list__checkbox');

    currentCheckbox.classList.add('is-hidden');
    checkboxContentWrapper.replaceChild(todoEditor, todoTextElement);

    editInput.focus();

    const moreButton = todoElement.querySelector('[data-action="more"]');
    moreButton.classList.add('is-hidden');

}

const deleteTodo = currentTodo => {

    const indexOfTodoData = todos.findIndex(todo => todo.id === Number(currentTodo.dataset.id));

    if (indexOfTodoData !== -1) todos.splice(indexOfTodoData, 1);
    currentTodo.remove();
    setTodoStorage();
    updateContentVisibility();
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

        case 'confirm':
            finalizeTodoEdit(currentTodo);
            break;

        case 'cancel':
            finalizeTodoEdit(currentTodo, false);
            break;

        case 'delete':
            deleteTodo(currentTodo);
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
        closeEditors();
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

renderSavedTodos();