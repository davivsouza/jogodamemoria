const cardFront = "card-front";
const cardBack = "card-back";
let container = document.getElementById("container");
let gameOverlay = document.getElementById('game-over')

let lockmode = false;
let firstCard = null;
let secondCard = null;
let cards;
let animals = [
  "papagaio",
  "raposa",
  "gorila",
  "elefante",
  "alce",
  "canguru",
  "tigre",
  "tubarao",
  "baleia",
  "orca",
];

startGame();

function startGame() {
  cards = createCardsFromAnimals(animals);
  shuffleCards(cards);

  initializeCards(cards);
}

function initializeCards(cards) {

  cards.forEach((card) => {
    container.innerHTML += `
    
      <div id="${card.id}"  class="card" data-icon="${card.icon}" onclick="flipCard(this)">
        <div class="card-front" style=" background-image: url('./assets/${card.icon}.jfif'); background-size: cover; background-position: center;">
          
        </div>
        <div class="card-back">
          <img src="./assets/arvore-icon.svg" alt="Árvore Icon" />
        </div>
      </div>
    
    
    `;
  });
}

function setCard(id) {
  let card = cards.filter((card) => card.id === id)[0];
  if (card.flipped || lockmode) {
    return false;
  }

  if (!firstCard) {
    firstCard = card;
    firstCard.flipped = true;
    return true;
  } else {
    secondCard = card;
    secondCard.flipped = true;
    lockmode = true;
    return true;
  }
}

function unflipCards() {
  firstCard.flipped = false;
  secondCard.flipped = false;
  clearCards();
}

function checkGameOver() {
  return cards.filter(card => !card.flipped).length == 0;
}

function flipCard(element) {
  if (setCard(element.id)) {
    element.classList.add("flip");

    if (secondCard) {
      if (checkMatch()) {
        clearCards();
        if(checkGameOver()){
          gameOverlay.style.display = "flex"
        }
      } else {
        setTimeout(() => {
          let firstCardView = document.getElementById(firstCard.id);
          let secondCardView = document.getElementById(secondCard.id);

          firstCardView.classList.remove("flip");
          secondCardView.classList.remove("flip");
          unflipCards();
        }, 1000);
      }
    }
  }
}

function checkMatch() {
  if (!firstCard || !secondCard) {
    return false;
  }
  return firstCard.icon === secondCard.icon;
}

function clearCards() {
  firstCard = null;
  secondCard = null;
  lockmode = false;
}

function shuffleCards(cards) {
  let currentIndex = cards.length; //21

  let randomIndex = 0;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cards[randomIndex], cards[currentIndex]] = [
      cards[currentIndex],
      cards[randomIndex],
    ];
  }
}

function createCardsFromAnimals(animals) {
  let animalsCards = [];

  for (let animal of animals) {
    animalsCards.push(createPairOfAnimals(animal));
  }

  return animalsCards.flatMap((pair) => pair);
}

//to find the 2 cards of each animals,  i need create a pair for each of them
//
function createPairOfAnimals(animal) {
  return [
    {
      id: createRandomId(animal),
      icon: animal,
      flipped: false,
    },
    {
      id: createRandomId(animal),
      icon: animal,
      flipped: false,
    },
  ];
}

function createRandomId(animal) {
  return animal + parseInt(Math.random() * 1000);
}


function restartGame(){
  if(checkGameOver()){
    container.innerHTML = ""
    gameOverlay.style.display = "none"
    startGame()

  }
}