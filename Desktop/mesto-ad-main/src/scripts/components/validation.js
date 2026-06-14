function showInputError(formElement, inputElement, errorMessage, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(settings.errorClass);
}

function checkInputValidity(formElement, inputElement, settings) {
    const customErrorMessage = inputElement.dataset.errorMessage;
    if (!inputElement.validity.valid) {
        let errorMessage;
        // Если есть кастомное сообщение И ошибка именно из-за несоответствия pattern
        if (customErrorMessage && inputElement.validity.patternMismatch) {
            errorMessage = customErrorMessage;
        } else {
            // Для остальных ошибок (required, minlength, maxlength, type mismatch) используем стандартное сообщение
            errorMessage = inputElement.validationMessage;
        }
        showInputError(formElement, inputElement, errorMessage, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
}

function disableSubmitButton(buttonElement, settings) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
}

function enableSubmitButton(buttonElement, settings) {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
}

function toggleButtonState(inputList, buttonElement, settings) {
    if (hasInvalidInput(inputList)) {
        disableSubmitButton(buttonElement, settings);
    } else {
        enableSubmitButton(buttonElement, settings);
    }
}

function setEventListeners(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);
    toggleButtonState(inputList, buttonElement, settings);
    inputList.forEach((inputElement) => {
        inputElement.addEventListener("input", () => {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
}

function clearValidation(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings);
    });
    disableSubmitButton(buttonElement, settings);
}

function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));
    formList.forEach((formElement) => {
        formElement.addEventListener("submit", (evt) => evt.preventDefault());
        setEventListeners(formElement, settings);
    });
}

export { enableValidation, clearValidation };