
const openCreateTodoModalButton = document.querySelector('.button--new-todo');
const newTodoModalElement = document.getElementById('create-todo-modal');
const newTodoInput = document.getElementById('new-todo-input');
const todoAppContainer = document.querySelector('.todo-app');
const todoList = todoAppContainer.querySelector('.todo-list');
const emptyNotice = todoAppContainer.querySelector('.todo-app__empty-notice');
const newTodoForm = document.getElementById('new-todo-form');

const today = new Date();
const todayShortFormat = today.toLocaleString('pt-BR', { dateStyle: 'short' });

const toggleElement = (element, forceValue) => element.classList.toggle('is-hidden', forceValue);

const updateContentVisibility = () => {

    const hasItems = todoList.childElementCount > 0;

    toggleElement(emptyNotice, hasItems);
    toggleElement(todoList, !hasItems);
}

const buildElement = (elementName, classNames, content) => {

    const element = document.createElement(elementName);
    element.classList.add(...classNames);

    if (content) {
        const tagName = element.tagName.toLowerCase();
        tagName === 'input' || tagName === 'textarea' ?
            element.value = content :
            element.textContent = content;
    }

    return element;
}

const buildCheckboxContent = text => {

    const checkboxContentWrapper = buildElement('div', ['todo-list__checkbox-content-wrapper']);
    const checkboxInput = buildElement('input', ['todo-list__checkbox']);

    checkboxInput.setAttribute('type', 'checkbox');

    const todo = buildElement('span', ['todo-list__text'], text);
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

    const actionButton = buildElement('button', classNamesButton);
    actionButton.setAttribute('data-action', iconId);

    const svgElement = buildSVGIncon(classNamesIcon, iconId);

    actionButton.appendChild(svgElement);

    if (labelText) {
        const actionButtonLabel = buildElement('span', labelClasses, labelText);
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

const buildTodo = text => {
    const todo = buildElement('li', ['todo-list__item']);
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

const handleClickToCloseModal = event => {

    const closeCreateTodoModalButton = event.target.closest('#close-create-todo');
    const outside = event.target.id === "create-todo-modal";
    const shouldCloseModal = outside || closeCreateTodoModalButton;

    toggleElement(newTodoModalElement, shouldCloseModal);
}

const handleNewTodoSubmit = event => {

    event.preventDefault();

    const todoText = newTodoInput.value.trim();

    if (!todoText) {
        toggleElement(newTodoModalElement);
        newTodoInput.value = "";
        return
    }

    const newTodo = buildTodo(todoText);

    todoList.append(newTodo);

    updateContentVisibility();

    toggleElement(newTodoModalElement);

    newTodoInput.value = "";

}

const closeDropDowns = () => {
    todoList.querySelectorAll('.todo-list__dropdown').forEach(dropdown => {
        toggleElement(dropdown, true);
    });

}

const handleEditOptionVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');
    const currentCheckbox = currentTodo.querySelector('.todo-list__checkbox');
    const dropDownEditButton = dropDownOptions.querySelector('[data-action="edit"]');

    toggleElement(dropDownEditButton, currentCheckbox.checked);

}

const handleDropDownVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');

    const wasOpen = !dropDownOptions.classList.contains('is-hidden');

    closeDropDowns();

    toggleElement(dropDownOptions, wasOpen);

    handleEditOptionVisibility(currentTodo);

}


// const handleMoreButtonClick = event => {

//     const currentTodoOptionsButton = event.target.closest('[data-action="more"]');   

//     if (currentTodoOptionsButton) {

//         const currentTodo = event.target.closest('.todo-list__item');
//         handleDropDownVisibility(currentTodo);

//     }

// };

const handleDropdownVisibilityByClick = event => {

    const currentTodoOptionsButton = event.target.closest('[data-action="more"]');

    if (currentTodoOptionsButton) {
        const currentTodo = event.target.closest('.todo-list__item');
        handleDropDownVisibility(currentTodo);

        return
    }

    const isClickInsideDropdown = event.target.closest('.todo-list__dropdown');
    if (!isClickInsideDropdown) {
        closeDropDowns();
    }
}

const saveEditedTodo = (currentTodo, editInput, oldTextValue) => {

    const text = editInput.value.trim() || oldTextValue;

    const newTodoTextElement = buildElement('span', ['todo-list__text'], text);
    const checkboxContentWrapper = currentTodo.querySelector('.todo-list__checkbox-content-wrapper');
    checkboxContentWrapper.replaceChild(newTodoTextElement, editInput);

    const moreButton = currentTodo.querySelector('[data-action="more"]');
    moreButton.classList.remove('is-hidden');
};

const handleEditTodo = currentTodo => {

    closeDropDowns();

    const todoTextElement = currentTodo.querySelector('.todo-list__text');
    const originalText = todoTextElement.textContent;

    const editInput = buildElement('input', ['todo-list__edit-input'], originalText);
    editInput.type = 'text';

    const checkboxContentWrapper = currentTodo.querySelector('.todo-list__checkbox-content-wrapper');
    checkboxContentWrapper.replaceChild(editInput, todoTextElement);

    editInput.focus();

    editInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            event.preventDefault();

            editInput.blur();
        }
    });

    editInput.addEventListener('blur', () => {
        setTimeout(() => saveEditedTodo(currentTodo, editInput, originalText), 0);
    });


    const moreButton = currentTodo.querySelector('[data-action="more"]');
    moreButton.classList.add('is-hidden');
};

const handleTodoActionClick = event => {

    const currentTodo = event.target.closest('.todo-list__item');
    if (!currentTodo) return;

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.getAttribute('data-action');

    switch (action) {

        case 'edit':
            handleEditTodo(currentTodo);
            break;

        case 'delete':
            // Lógica para remoção
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
            activeEditInput.value="";
            activeEditInput.blur(); // O evento blur que você já tem cuidará de restaurar o texto
        }
    }
};

const todoAppHeading = buildElement('h2', ['todo-app__heading'], todayShortFormat);
todoAppContainer.prepend(todoAppHeading);

updateContentVisibility();

todoList.addEventListener('click', handleTodoActionClick);

openCreateTodoModalButton.addEventListener('click', openNewTodoModal);

// closeCreateTodoModalButton.addEventListener('click', () =>  toggleElement(newTodoModalElement, true));

newTodoModalElement.addEventListener('click', handleClickToCloseModal);

newTodoForm.addEventListener('submit', handleNewTodoSubmit);

// todoList.addEventListener('click', handleMoreButtonClick); 

document.addEventListener('click', handleDropdownVisibilityByClick);

document.addEventListener('keydown', handleGlobalKeyDown);