/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { 
  getUserInfo, 
  getCardList, 
  setUserInfo, 
  setAvatar, 
  setCard, 
  changeLikeCardStatus,
  deleteCard 
} from "./components/api.js";


// файл index.js
import { enableValidation, clearValidation } from "./components/validation.js";

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// включение валидации вызовом enableValidation
enableValidation(validationSettings);

import { initialCards } from "./cards.js";
import { createCardElement, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const logoButton = document.querySelector(".header__logo");
let currentUserId;
const usersStatsModalWindow = document.querySelector(".popup_type_info");
const usersStatsModalInfoList = usersStatsModalWindow.querySelector(".popup__info");
const infoDefinitionTemplate = document.querySelector("#popup-info-definition-template").content;
const userPreviewTemplate = document.querySelector("#popup-info-user-preview-template").content;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};



const renderLoading = (button, isLoading, normalText, loadingText) => {
  button.textContent = isLoading ? loadingText : normalText;
};



const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Сохранить", "Сохранение...");
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    renderLoading(submitButton, false, "Сохранить", "Сохранение...");
  });
};


const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Сохранить", "Сохранение...");
  setAvatar({
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${avatarInput.value})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err)=>{
      console.log(err)
    })
    .finally(() => {
    renderLoading(submitButton, false, "Сохранить", "Сохранение...");
  });
};



const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(submitButton, true, "Создать", "Создание...");
  setCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCard) => {
      placesWrap.prepend(
        createCardElement(
          newCard,  
          {
            currentUserId,
            onPreviewPicture: handlePreviewPicture,
            onLikeClick: handlechangeLikeCardStatus,
            onDeleteClick: handleDeleteCard,
          }
        )
      );
      cardForm.reset();  
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButton, false, "Создать", "Создание...");
    });
};


const handleDeleteCard = (cardElement, cardId) => {
  deleteCard(cardId) 
    .then(() => {
      cardElement.remove();
    })
    .catch(console.log);
};

const handlechangeLikeCardStatus = (likeButton, cardId, likeCounter) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  changeLikeCardStatus(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};



const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (term, description) => {
  const infoElement = document.createElement("div");
  infoElement.className = "popup__info-item";
  infoElement.innerHTML = `
    <dt class="popup__info-term">${term}</dt>
    <dd class="popup__info-description">${description}</dd>
  `;
  return infoElement;
};

const createUserItem = (user) => {
  const userElement = document.createElement("li");
  userElement.className = "popup__list-item";
  userElement.textContent = user.name;
  return userElement;
};

const handleLogoClick = () => {
  const title = usersStatsModalWindow.querySelector(".popup__title");
  if (title) title.textContent = "Статистика пользователей";
  const subTitle = usersStatsModalWindow.querySelector(".popup__text");
  if (subTitle) subTitle.textContent = "Все пользователи:";
  
  getCardList()
    .then((cards) => {
      usersStatsModalInfoList.innerHTML = "";
      const usersList = usersStatsModalWindow.querySelector(".popup__list");
      if (usersList) usersList.innerHTML = "";

      const totalCards = cards.length;
      const usersMap = new Map();
      const userCardCounts = {};
      
      cards.forEach((card) => {
        if (!usersMap.has(card.owner._id)) {
          usersMap.set(card.owner._id, card.owner);
        }
        
        userCardCounts[card.owner._id] = (userCardCounts[card.owner._id] || 0) + 1;
      });
      
      const totalUsers = usersMap.size;
      const maxCardsFromOne = Math.max(...Object.values(userCardCounts));
      const sortedCards = cards.slice().sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const firstCardDate = formatDate(new Date(sortedCards[sortedCards.length - 1].createdAt));
      const lastCardDate = formatDate(new Date(sortedCards[0].createdAt));
      
      usersStatsModalInfoList.append(
        createInfoString("Всего карточек:", totalCards.toString())
      );
      usersStatsModalInfoList.append(
        createInfoString("Первая создана:", firstCardDate)
      );
      usersStatsModalInfoList.append(
        createInfoString("Последняя создана:", lastCardDate)
      );
      usersStatsModalInfoList.append(
        createInfoString("Всего пользователей:", totalUsers.toString())
      );
      usersStatsModalInfoList.append(
        createInfoString("Максимум карточек от одного:", maxCardsFromOne.toString())
      );
      if (usersList) {
        usersMap.forEach((user) => {
          usersList.append(createUserItem(user));
        });
      }
      openModalWindow(usersStatsModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};
logoButton.addEventListener("click", handleLogoClick);



// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);  
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings); 
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings); 
  openModalWindow(cardFormModalWindow);
});


// настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});



Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    // Код отвечающий за отрисовку полученных данных
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          currentUserId,
          onPreviewPicture: handlePreviewPicture,
          onLikeClick: handlechangeLikeCardStatus, 
          onDeleteClick: handleDeleteCard,           
        })
      );
    });
  })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });
  