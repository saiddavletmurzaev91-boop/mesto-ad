```js
const handleEscapeKey = (event) => {
  if (event.key !== "Escape") {
    return;
  }

  const openedPopup = document.querySelector(".popup_is-opened");

  if (openedPopup) {
    closeModalWindow(openedPopup);
  }
};

const closeByOverlay = (popup, event) => {
  if (event.target === popup) {
    closeModalWindow(popup);
  }
};

export const openModalWindow = (popup) => {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscapeKey);
};

export const closeModalWindow = (popup) => {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", handleEscapeKey);
};

export const setCloseModalWindowEventListeners = (popup) => {
  const closeButton = popup.querySelector(".popup__close");

  closeButton.addEventListener("click", () => {
    closeModalWindow(popup);
  });

  popup.addEventListener("mousedown", (event) => {
    closeByOverlay(popup, event);
  });
};
```
