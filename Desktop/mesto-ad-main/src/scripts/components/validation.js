
const displayInputError = (form, input, message, config) => {
  const errorField = form.querySelector(`#${input.id}-error`);

  input.classList.add(config.inputErrorClass);
  errorField.textContent = message;
  errorField.classList.add(config.errorClass);
};

const clearInputError = (form, input, config) => {
  const errorField = form.querySelector(`#${input.id}-error`);

  input.classList.remove(config.inputErrorClass);
  errorField.textContent = "";
  errorField.classList.remove(config.errorClass);
};

const validateField = (form, input, config) => {
  if (input.validity.valid) {
    clearInputError(form, input, config);
    return;
  }

  const patternMessage = input.dataset.errorMessage;

  const errorText =
    patternMessage && input.validity.patternMismatch
      ? patternMessage
      : input.validationMessage;

  displayInputError(form, input, errorText, config);
};

const containsInvalidFields = (fields) => {
  return fields.some((field) => !field.validity.valid);
};

const setButtonDisabled = (button, config) => {
  button.disabled = true;
  button.classList.add(config.inactiveButtonClass);
};

const setButtonEnabled = (button, config) => {
  button.disabled = false;
  button.classList.remove(config.inactiveButtonClass);
};

const updateSubmitButtonState = (fields, button, config) => {
  if (containsInvalidFields(fields)) {
    setButtonDisabled(button, config);
    return;
  }

  setButtonEnabled(button, config);
};

const attachValidationHandlers = (form, config) => {
  const fields = [...form.querySelectorAll(config.inputSelector)];
  const submitButton = form.querySelector(
    config.submitButtonSelector
  );

  updateSubmitButtonState(fields, submitButton, config);

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(form, field, config);
      updateSubmitButtonState(fields, submitButton, config);
    });
  });
};

const clearValidation = (form, config) => {
  const fields = [...form.querySelectorAll(config.inputSelector)];
  const submitButton = form.querySelector(
    config.submitButtonSelector
  );

  fields.forEach((field) => {
    clearInputError(form, field, config);
  });

  setButtonDisabled(submitButton, config);
};

const enableValidation = (config) => {
  const forms = [...document.querySelectorAll(config.formSelector)];

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    attachValidationHandlers(form, config);
  });
};

export { enableValidation, clearValidation };

