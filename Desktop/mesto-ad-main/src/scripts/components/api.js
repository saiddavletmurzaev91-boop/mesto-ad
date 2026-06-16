```js
const apiSettings = {
  url: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  headers: {
    authorization: "11a2ddfa-556d-46bb-a889-d2157f8510e9",
    "Content-Type": "application/json",
  },
};

const checkResponse = (response) => {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(`Ошибка: ${response.status}`);
};

const request = (endpoint, options = {}) => {
  return fetch(`${apiSettings.url}${endpoint}`, {
    headers: apiSettings.headers,
    ...options,
  }).then(checkResponse);
};

export const getUserInfo = () => request("/users/me");

export const getCardList = () => request("/cards");

export const setUserInfo = ({ name, about }) =>
  request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      name,
      about,
    }),
  });

export const setAvatar = ({ avatar }) =>
  request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({
      avatar,
    }),
  });

export const setCard = ({ name, link }) =>
  request("/cards", {
    method: "POST",
    body: JSON.stringify({
      name,
      link,
    }),
  });

export const deleteCard = (cardId) =>
  request(`/cards/${cardId}`, {
    method: "DELETE",
  });

export const changeLikeCardStatus = (cardId, isLiked) =>
  request(`/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
  });

export const updateLikeCount = (cardElement, likes) => {
  const likesCounter = cardElement.querySelector(".card__like-count");
  likesCounter.textContent = likes.length;
};
```
