export const likeCard = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};



const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

const isCardLiked = (likesArray, userId) => {
  return likesArray.some((like) => like._id === userId);
};

export const createCardElement = (
  data,
  { currentUserId, onPreviewPicture, onLikeClick, onDeleteClick }
) => {
  const cardElement = getTemplate();

  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardTitle = cardElement.querySelector(".card__title");
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  
  cardImage.addEventListener("click", () =>
    onPreviewPicture({ name: data.name, link: data.link })
  );
  likeCounter.textContent = data.likes.length;
  if (data.likes.some((l) => l._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }
  likeButton.addEventListener("click", () =>
    onLikeClick(likeButton, data._id, likeCounter)
  );
  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () =>
      onDeleteClick(cardElement, data._id)
    );
  }
  return cardElement;
};
