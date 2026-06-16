```js
const cardTemplateSelector = "#card-template";

const cloneCardTemplate = () => {
  const template = document.querySelector(cardTemplateSelector).content;
  return template.querySelector(".card").cloneNode(true);
};

const hasUserLike = (likes, userId) => {
  return likes.some((user) => user._id === userId);
};

export const isCardLiked = hasUserLike;

export const likeCard = (cardData, likeButton, counterElement) => {
  likeButton.classList.toggle("card__like-button_is-active");
  counterElement.textContent = cardData.likes.length;
};

export const removeCard = (cardElement) => {
  cardElement.remove();
};

export const createCardElement = (
  cardData,
  { currentUserId, onPreviewPicture, onLikeClick, onDeleteClick }
) => {
  const card = cloneCardTemplate();

  const imageElement = card.querySelector(".card__image");
  const titleElement = card.querySelector(".card__title");
  const likeButton = card.querySelector(".card__like-button");
  const likesCounter = card.querySelector(".card__like-count");
  const deleteButton = card.querySelector(
    ".card__control-button_type_delete"
  );

  imageElement.src = cardData.link;
  imageElement.alt = cardData.name;
  titleElement.textContent = cardData.name;

  likesCounter.textContent = cardData.likes.length;

  if (hasUserLike(cardData.likes, currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  imageElement.addEventListener("click", () => {
    onPreviewPicture({
      name: cardData.name,
      link: cardData.link,
    });
  });

  likeButton.addEventListener("click", () => {
    const likedByCurrentUser = likeButton.classList.contains(
      "card__like-button_is-active"
    );

    onLikeClick(
      likeButton,
      cardData._id,
      likesCounter,
      likedByCurrentUser
    );
  });

  if (cardData.owner._id === currentUserId) {
    deleteButton.addEventListener("click", () => {
      onDeleteClick(card, cardData._id);
    });
  } else {
    deleteButton.remove();
  }

  return card;
};
```
