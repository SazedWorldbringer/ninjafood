const menu = document.getElementById("menu");
const hamburger = document.getElementById("hamburger");

// show/hide mobile nav
hamburger.addEventListener("click", () => {
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
  } else {
    menu.classList.add("hidden");
  }
});

const likedCards = document.getElementById("liked-recipes"); // the element where we store our random recipe and liked recipes
const searchedRecipes = document.getElementById("search-recipes"); // the element where we store search results

const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById("close-popup");

const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");

getRandomMeal();
fetchFavMeals();

// add the random recipe and liked recipes to the likedCards element
function addMeal(mealData, random = false) {
  const card = document.createElement("div");
  card.classList.add(
    "bg-white",
    "rounded",
    "overflow-hidden",
    "shadow-md",
    "relative",
    "hover:shadow-lg",
    "transition",
    "ease",
    "duration-300"
  );

  card.innerHTML = `
              <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}" 
                class="w-full h-32 sm:h-48 object-cover cursor-pointer" />
              <div class="m-4 flex justify-between items-center">
                <span class="font-bold">${mealData.strMeal}</span>
                <button class="fav-btn text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              ${
                random
                  ? `<div
                class="bg-secondary-100 text-secondary-200 text-xs uppercase font-bold rounded-full p-2 absolute top-0 ml-2 mt-2">
                <span>Random recipe</span>
              </div>`
                  : ""
              }

    `;

  // event listener for the favorite meal button(heart) button
  const btn = card.querySelector("div .fav-btn");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealFromLocalStorage(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLocalStorage(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeals();
  });

  const recipeImg = card.querySelector("img");

  recipeImg.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  //  meal.addEventListener("click", () => {
  //    showMealInfo(mealData);
  //  });

  likedCards.appendChild(card);
}

// add recipes to the searchedRecipes element after results load up
function addSearchMeal(mealData, random = false) {
  const card = document.createElement("div");
  card.classList.add(
    "bg-white",
    "rounded",
    "overflow-hidden",
    "shadow-md",
    "relative",
    "hover:shadow-lg",
    "transition",
    "ease",
    "duration-300"
  );

  card.innerHTML = `
              <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}" 
                class="w-full h-32 sm:h-48 object-cover" />
              <div class="m-4 flex justify-between items-center">
                <span class="font-bold">${mealData.strMeal}</span>
                <button class="fav-btn text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              ${
                random
                  ? `<div
                class="bg-secondary-100 text-secondary-200 text-xs uppercase font-bold rounded-full p-2 absolute top-0 ml-2 mt-2">
                <span>Random recipe</span>
              </div>`
                  : ``
              }

    `;

  // event listener for the favorite meal button(heart) button
  const btn = card.querySelector("div .fav-btn");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealFromLocalStorage(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLocalStorage(mealData.idMeal);
      btn.classList.add("active");
    }

    fetchFavMeals();
  });

  const recipeImg = card.querySelector("img");

  recipeImg.addEventListener("click", () => {
    showMealInfo(mealData);
  });
  //  meal.addEventListener("click", () => {
  //    showMealInfo(mealData);
  //  });

  searchedRecipes.appendChild(card);
}

// fetch random meals from TheMealDB api
async function getRandomMeal() {
  const resp = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await resp.json();
  const randomMeal = respData.meals[0];

  console.log(randomMeal);
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );

  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

function addMealToLocalStorage(mealId) {
  const mealIds = getMealsFromLocalStorage();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function getMealsFromLocalStorage() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  return mealIds === null ? [] : mealIds;
}

function removeMealFromLocalStorage(mealId) {
  const mealIds = getMealsFromLocalStorage();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

async function fetchFavMeals() {
  // clean the container
  likedCards.innerHTML = "";

  const mealIds = getMealsFromLocalStorage();
  getRandomMeal();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement("div");

  favMeal.innerHTML = `
              <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}" 
                class="w-full h-32 sm:h-48 object-cover" />
              <div class="m-4 flex justify-between items-center">
                <span class="font-bold">${mealData.strMeal}</span>
                <button class="clear fav-btn text-gray-500 text-sm">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  stroke-width="2"
                >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M6 18L18 6M6 6l12 12"
                />
                </svg>
                </button>
              </div>
    `;
  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealFromLocalStorage(mealData.idMeal);
    fetchFavMeals();
  });

  const favMealImg = favMeal.querySelector("img");

  favMealImg.addEventListener("click", () => {
    showMealInfo(mealData);
  });

  likedCards.appendChild(favMeal);
}

function showMealInfo(mealData) {
  // clean the element
  mealInfoEl.innerHTML = "";
  // update the meal info
  const mealEl = document.createElement("div");

  const ingredients = [];

  //get ingredients and measurements
  for (let i = 0; i < 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    }
  }

  mealEl.innerHTML = `
    <h1 class="text-4xl text-center">${mealData.strMeal}</h1>
    <div class="lg:flex justify-around">
      <img
        src="${mealData.strMealThumb}"
        alt="${mealData.strMeal}"
        class="my-8 mx-4 rounded-lg"
       />
       <div>
          <h3 class="text-2xl font-semibold pt-4 text-center">Ingredients:</h3>
          <ul class="my-8 text-center">
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
      </div>
    </div>
    <p class="text-xl text-left">${mealData.strInstructions}</p>
    `;

  mealInfoEl.appendChild(mealEl);
  //show the popup
  mealPopup.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  // clean the container
  searchedRecipes.innerHTML = "";
  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addSearchMeal(meal);
    });
  }
});

popupCloseBtn.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
