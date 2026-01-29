
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

const toggleElement = (element, forceValue) => element.classList.toggle('hidden', forceValue);

const handleOutsideClickToCloseModal = event => {

    const shouldCloseModal = event.target.id === "create-todo-modal";

    if (shouldCloseModal) {
        toggleElement(newTodoModalElement);
    }

}

const updateContentVisibility = () => {

    const hasItems = todoList.childElementCount > 0;

    toggleElement(emptyNotice, hasItems);
    toggleElement(todoList, !hasItems);
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


const buildDropDownOption = (iconID, labelText) => {

    const iconStyle = iconID === 'delete' ? 'icon--danger' : 'icon--secondary';

    const actionButtonAttributes = {
        iconID: iconID,
        classNamesIcon: [iconStyle, 'icon-sm'],
        classNamesButton: ['button', 'todo-list__action-option', 'todo-list__dropdown-option'],
        labelText: labelText,
        labelClasses: ['todo-list__action-option-label']
    };

    const actionButton = buildButton(actionButtonAttributes);

    return actionButton;
}

const buildDropDownOptions = () => {

    const dropDownContainer = buildElement('div', ['todo-list__dropdown']);

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

const handleEditOptionVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');
    const currentCheckbox = currentTodo.querySelector('.todo-list__checkbox');
    const dropDownEditButton = dropDownOptions.querySelector('[data-action="edit"');

    toggleElement(dropDownEditButton, currentCheckbox.checked);

}

const handleDropDownVisibility = currentTodo => {

    let dropDownOptions = currentTodo.querySelector('.todo-list__dropdown');

    const wasOpen = dropDownOptions && !dropDownOptions.classList.contains('hidden');
    closeDropDowns();

    if (!dropDownOptions) {

        dropDownOptions = buildDropDownOptions();
        currentTodo.append(dropDownOptions);

    }

    handleEditOptionVisibility(currentTodo);

    toggleElement(dropDownOptions, wasOpen);

}

const handleMoreButtonClick = event => {

    const currentTodoOptionsButton = event.target.closest('[data-action="more"]');

    if (currentTodoOptionsButton) {
        const currentTodo = event.target.closest('.todo-list__item');
        handleDropDownVisibility(currentTodo);
    }
};

const handleOutsideClickToCloseDropdown = event => {

    const isClickOnMoreButton = event.target.closest('[data-action="more"]');

    if (isClickOnMoreButton) return;

    const isClickInsideDropdown = event.target.closest('.todo-list__dropdown');

    if (!isClickInsideDropdown) {
        closeDropDowns();
    }

}




// --- NOVAS FUNÇÕES ---

const saveEditedTodo = (currentTodo, editInput) => {
    // 1. Pega o novo texto, garantindo que não seja vazio
    const newText = editInput.value.trim() || 'Item vazio'; 

    // 2. Reverte para o elemento de texto (span)
    const newTodoTextElement = buildElement('span', ['todo-list__text'], newText);
    
    // 3. Aplica o estilo de concluído/riscado (se o checkbox estiver marcado)
    const checkbox = currentTodo.querySelector('.todo-list__checkbox');
    if (checkbox.checked) {
        newTodoTextElement.style.textDecoration = 'line-through';
        newTodoTextElement.style.opacity = '0.5';
    }

    // 4. Substitui o input pelo novo span de texto
    const checkboxContentWrapper = currentTodo.querySelector('.todo-list__checkbox-content-wrapper');
    checkboxContentWrapper.replaceChild(newTodoTextElement, editInput);

    // 5. Reaparece o botão de opções (três pontos)
    const moreButton = currentTodo.querySelector('[data-action="more"]');
    moreButton.classList.remove('hidden');
};

const handleEditTodo = currentTodo => {
    // 1. Fecha o dropdown aberto para evitar interrupção
    closeDropDowns();

    const todoTextElement = currentTodo.querySelector('.todo-list__text');
    const originalText = todoTextElement.textContent;

    // 2. Cria o campo de input de edição
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('todo-list__edit-input');
    editInput.value = originalText;

    // 3. Substitui o texto pelo input
    const checkboxContentWrapper = currentTodo.querySelector('.todo-list__checkbox-content-wrapper');
    checkboxContentWrapper.replaceChild(editInput, todoTextElement);

    editInput.focus();
    
    // 4. Adicionar evento para salvar ao pressionar Enter
    editInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            // O blur será disparado, que chamará saveEditedTodo.
            editInput.blur(); 
        }
    });

    // 5. Adicionar evento para salvar ao perder o foco (blur)
    editInput.addEventListener('blur', () => {
        // Usa setTimeout para dar tempo para o evento 'keypress' finalizar, 
        // e garante que a edição não seja salva duas vezes
        setTimeout(() => saveEditedTodo(currentTodo, editInput), 0);
    });

    // 6. Ocultar o botão de opções (três pontos)
    const moreButton = currentTodo.querySelector('[data-action="more"]');
    moreButton.classList.add('hidden');
};


// Remova: todoList.addEventListener('click', handleMoreButtonClick);

const handleTodoActionClick = event => {
    const currentTodo = event.target.closest('.todo-list__item');
    if (!currentTodo) return;

    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;

    const action = actionButton.getAttribute('data-action');

    switch (action) {
        case 'more':
            handleDropDownVisibility(currentTodo);
            break;

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

// Adicione este novo listener unificado
todoList.addEventListener('click', handleTodoActionClick);






















openCreateTodoModalButton.addEventListener('click', openNewTodoModal);

closeCreateTodoModalButton.addEventListener('click', () => toggleElement(newTodoModalElement));

newTodoModalElement.addEventListener('click', handleOutsideClickToCloseModal);

newTodoForm.addEventListener('submit', handleNewItemSubmit);

// todoList.addEventListener('click', handleMoreButtonClick);

document.addEventListener('click', handleOutsideClickToCloseDropdown);
