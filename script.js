"use strict";
//-----------------------------------------------------------------------------------------
// 1) ELEMENT SELECTION & SETUP
//-----------------------------------------------------------------------------------------

//Opening Modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

//Gamelogic Modals
const playerBustedAlert = document.getElementById("player--busted");
const dealerBustedAlert = document.getElementById("dealer--busted");
const dealerDrawAlert = document.getElementById("draw");
const dealerWonAlert = document.getElementById("dealer--won");
const playerWonAlert = document.getElementById("player--won");

//Gamelogic Modals textcontexts
const playerBustedScore = document.getElementById("player--busted--score");
const dealerBustedScore = document.getElementById("dealer--busted--score");
const drawPlayerScore = document.getElementById("draw--player--score");
const drawDealerScore = document.getElementById("draw--dealer--score");
const dealerWonDealerScore = document.getElementById(
  "dealer--won--dealer--score"
);
const dealerWonPlayerScore = document.getElementById(
  "dealer--won--player--score"
);
const playerWonDealerScore = document.getElementById(
  "player--won--dealer--score"
);
const playerWonPlayerScore = document.getElementById(
  "player--won--player--score"
);

//Buttons
const btnNew = document.querySelector(".btn--new");
const btnHit = document.querySelector(".btn--hit");
const btnStand = document.querySelector(".btn--stand");
const btnContinue = document.querySelector(".btn--continue");
const btnCloseModal = document.querySelector(".btn--close-modal");

//Players Info
const player = document.querySelector(".player");
const dealer = document.querySelector(".dealer");
const scorePlayer = document.getElementById("score--player");
const scoreDealer = document.getElementById("score--dealer");

//Elements for displaying )rendering) cards
const card = document.getElementById("cards");
//Player's table
const tablePlayer = document.getElementById("playerCanvas");
const contextPlayer = tablePlayer.getContext("2d");
//Dealer's table
const tableDealer = document.getElementById("dealerCanvas");
const contextDealer = tableDealer.getContext("2d");

//-----------------------------------------------------------
//SETUP (basic arrays & variables)
//-----------------------------------------------------------

let deck, playerHand, dealerHand;

const cardSuits = ["hearts", "clubs", "diamonds", "spades"];
// prettier-ignore
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',];

showModalButtons();

//-----------------------------------------------------------------------------------------
// 2) INIT (Start & Restart game) & Supporting functions
//-----------------------------------------------------------------------------------------

const init = function () {
  //Initiate || Reset values & elements

  //Values
  scorePlayer.textContent = 0;
  scoreDealer.textContent = 0;
  playerHand = [];
  dealerHand = [];

  //Players elements
  player.classList.remove("player--winner");
  dealer.classList.remove("player--winner");
  player.classList.add("player--active");
  dealer.classList.remove("player--active");

  //Buttons elements
  btnHit.classList.remove("btn--frozen");
  btnStand.classList.remove("btn--frozen");
  btnHit.classList.add("btn");
  btnStand.classList.add("btn");
  btnHit.disabled = false;
  btnStand.disabled = false;

  //Reset canvas (table)
  contextPlayer.clearRect(0, 0, tablePlayer.width, tablePlayer.height);
  contextDealer.clearRect(0, 0, tableDealer.width, tableDealer.height);

  //Create & Shuffle Deck of Cards
  deck = createDeck();
  shuffle(deck);

  //Serve 2 initial cards to the Player and 2 to the Dealer
  dealCards();
};

//---------------------------------------------------
//CREATE DECK
//---------------------------------------------------
function createDeck() {
  const deck = [];

  for (let i = 0; i < cardSuits.length; i++) {
    for (let j = 0; j < cardValues.length; j++) {
      //parseInt convert string into integer
      let weight = parseInt(cardValues[j]);

      let positionSX = 202 * [j];
      let positionSY = 271 * [i];
      let positionDX = 4;
      let positionDY = 10;
      // prettier-ignore
      if (cardValues[j] === 'J' || cardValues[j] === 'Q' || cardValues[j] === 'K') {
        weight = 10;
      } else if (cardValues[j] === 'A') {
        weight = 1;
      }
      const card = {
        value: cardValues[j],
        suit: cardSuits[i],
        cardWeight: weight,
        sxPosition: positionSX,
        syPosition: positionSY,
        dxPosition: positionDX,
        dyPosition: positionDY,
      };
      deck.push(card);
    }
  }
  return deck;
}

//---------------------------------------------------
//SHUFFLE DECK
//---------------------------------------------------
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  console.log(deck);
  return deck;
}

//---------------------------------------------------
//DEAL CARDS
//---------------------------------------------------
function dealCards() {
  playSound("deal--sound", 0);
  freezeButtons();

  for (let i = 0; i < 2; i++) {
    setTimeout(function timer() {
      dealerHand[i] = dealCard();
      getPoints(dealerHand, "1st");
      playerHand[i] = dealCard();
      getPoints(playerHand);
      drawCardsAndHideDealersFirst(dealerHand, contextDealer);
      drawCards(playerHand, contextPlayer);
    }, i * 800);
  }

  unFreezeButtons();
  playersTurn();
}

//---------------------------------------------------
//DEAL CARD (Supporting fucntion for DEALCARDS above)
//---------------------------------------------------
function dealCard() {
  let card = deck.pop();
  console.log(card);
  return card;
}

//----------------------------------------------------------------------------------------------
// 3) RENDERING CARDS
//----------------------------------------------------------------------------------------------

//---------------------------------------------------
//DRAW CARDS (Initial & Hit)
//---------------------------------------------------
function drawCards(playerHand, playerContext) {
  console.log(playerHand, playerHand.length);
  setTimeout(function () {
    for (let i = 0; i < playerHand.length; i++) {
      let sx = playerHand[i].sxPosition;
      let sy = playerHand[i].syPosition;
      let dx = [i] * 40;
      let dy = 14;
      console.log(sx, sy, dx, dy);
      playerContext.drawImage(card, sx, sy, 202, 268, dx, dy, 202, 268);
    }
  }, 300);
}

//---------------------------------------------------
//DRAW & HIDE INITIAL DEALER'S CARDS
//---------------------------------------------------
//forloop caused here infinite loop and because we
//need only 2 predifined iteration, we don't actually
//have to use loop
//---------------------------------------------------
function drawCardsAndHideDealersFirst(playerHand, playerContext) {
  console.log(playerHand, playerHand.length);
  //Iteration1
  setTimeout(function () {
    let sx = 2626;
    let sy = 4;
    let dx = 0;
    let dy = 14;

    playerContext.drawImage(card, sx, sy, 202, 268, dx, dy, 202, 268);
  }, 100);
  //Iteration 2
  setTimeout(function () {
    let sx = 2626;
    let sy = 4;
    let sx2 = playerHand[1].sxPosition;
    let sy2 = playerHand[1].syPosition;
    let dx = 0;
    let dy = 14;
    let dx2 = 40;
    let dy2 = 14;
    playerContext.drawImage(card, sx, sy, 202, 268, dx, dy, 202, 268);
    playerContext.drawImage(card, sx2, sy2, 202, 268, dx2, dy2, 202, 268);
  }, 100);
}

//-------------------------------------------------------------------------------------------------
// 4) EVENT LISTENERS & BUTTONS & Supporting functions
//-------------------------------------------------------------------------------------------------

//------------------------------------------------
//MODAL BUTTONS to close & Esc key click to close
//-------------------------------------------------

//Close (X) Button

function showModalButtons() {
  btnCloseModal.addEventListener("click", function () {
    closeModal(modal);
  });
  //Clik outside of modal (anywhere on overlay)
  overlay.addEventListener("click", function () {
    closeModal(modal);
  });
  //BTN Continur
  btnContinue.addEventListener("click", function () {
    closeModal(modal);
  });
  //Esc key click
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal(modal);
    }
  });
}

//---------------------------------------------------
//BTN STAND
//---------------------------------------------------
btnStand.addEventListener("click", function stand() {
  getPoints(dealerHand);
  dealersTurn();
  freezeButtons();
});

//---------------------------------------------------
//BTN NEW-GAME
//---------------------------------------------------
btnNew.addEventListener("click", function () {
  init();
});

//---------------------------------------------------
//HITME (Supporting function for BTN HIT)
//---------------------------------------------------
function hitMe(hand, context) {
  hand.push(dealCard());
  drawCards(hand, context);
  playSound("hit--sound", 0);
}

//-------------------------------------------------------------------
//GETPOINTS (Important Supporting function for buttons and fucntions)
//-------------------------------------------------------------------
function getPoints(hand, round) {
  let points = 0;
  for (let i = 0; i < hand.length; i++) {
    points += hand[i].cardWeight;
  }
  hand.points = points;
  if (hand === playerHand) {
    scorePlayer.textContent = points;
  } else if (round === "1st") {
    scoreDealer.textContent = "?";
  } else {
    scoreDealer.textContent = points;
  }
  return points;
}

//---------------------------------------------------
//BTN HIT CARD
//---------------------------------------------------
btnHit.addEventListener("click", function hit() {
  hitMe(playerHand, contextPlayer);
  getPoints(playerHand);

  if (playerHand.points > 21) {
    freezeButtons();
    //console.log("You busted");
    playSound("game--over", 300);
    gameAlert("playerBusted");
  }
});

//----------------------------------------------------
//DEALER'S TURN
//----------------------------------------------------
//The reason I'm using async function is because clasic SetTimeout was freezing browser in this loop.

async function dealersTurn() {
  let y = dealerHand.points;

  for (let i = dealerHand.points; i < 17; i = i + (dealerHand.points - i)) {
    hitMe(dealerHand, contextDealer);
    getPoints(dealerHand);
    await new Promise((r) => setTimeout(r, 800));
  }

  if (dealerHand.points > 21) {
    playSound("winning--sound", 300);
    gameAlert("dealerBusted");
  } else if (dealerHand.points === playerHand.points) {
    playSound("draw--sound", 300);
    gameAlert("draw");
  } else if (dealerHand.points > playerHand.points) {
    playSound("game--over", 300);
    gameAlert("dealerWon");
  } else {
    playSound("winning--sound", 300);
    gameAlert("playerWon");
  }
}

//----------------------------------------------------
//GAME ALERT - support function for dealersTurn
//----------------------------------------------------
function gameAlert(status) {
  switch (status) {
    case "playerBusted":
      showModal(playerBustedAlert, playerBustedScore, null);
      //modalPlayerScore.textContent = playerHand.points;
      break;
    case "dealerBusted":
      showModal(dealerBustedAlert, playerWonPlayerScore, dealerBustedScore);
      //modalDealerScore.textContent = dealerHand.points;
      break;
    case "draw":
      showModal(dealerDrawAlert, drawPlayerScore, drawDealerScore);
      break;
    case "dealerWon":
      showModal(dealerWonAlert, dealerWonPlayerScore, dealerWonDealerScore);
      break;
    case "playerWon":
      showModal(playerWonAlert, playerWonPlayerScore, playerWonDealerScore);
      break;
    default:
      console.log("default");
  }
}

//----------------------------------------------------
//FREEZE BUTTONS
//----------------------------------------------------
function freezeButtons() {
  btnHit.classList.remove("btn");
  btnStand.classList.remove("btn");
  btnHit.classList.add("btn--frozen");
  btnStand.classList.add("btn--frozen");
  btnHit.disabled = true;
  btnStand.disabled = true;
}

//----------------------------------------------------
//UNFREEZE BUTTONS
//----------------------------------------------------
function unFreezeButtons() {
  setTimeout(function () {
    btnHit.classList.add("btn");
    btnStand.classList.add("btn");
    btnHit.classList.remove("btn--frozen");
    btnStand.classList.remove("btn--frozen");
    btnHit.disabled = false;
    btnStand.disabled = false;
  }, 1600);
}

//----------------------------------------------------
//PLAYERS TURN
//----------------------------------------------------
function playersTurn() {
  playSound("turn--sound", 1600);
}

//-------------------------------------------------------------------------------------------------
// 5) MODAL WINDOWS & Supporting functions
//-------------------------------------------------------------------------------------------------

//---------------------------------------------------
//SHOW MODAL WINDOW
//---------------------------------------------------
function showModal(modal, pscore, dscore) {
  setTimeout(function timer() {
    showModalButtons();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    pscore.textContent = playerHand.points;
    dscore.textContent = dealerHand.points;
  }, 1000);
}

//---------------------------------------------------
//CLOSE MODAL WINDOW
//---------------------------------------------------
function closeModal(modal) {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  init();
}

//-------------------------------------------------------------------------------------------------
// 6) AUDIO
//-------------------------------------------------------------------------------------------------
function playSound(sound, delay) {
  let audio = document.getElementById(sound);
  setTimeout(function timer() {
    audio.play();
  }, delay);
}
