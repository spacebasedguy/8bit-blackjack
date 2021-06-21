'use strict';
//-----------------------------------------------------------------------------------------
// 1) ELEMENT SELECTION & SETUP
//-----------------------------------------------------------------------------------------

//Modals
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');

//Buttons
const btnNew = document.querySelector('.btn--new');
const btnHit = document.querySelector('.btn--hit');
const btnStand = document.querySelector('.btn--stand');
const btnContinue = document.querySelector('.btn--continue');

//Players Info
const player = document.querySelector('.player');
const dealer = document.querySelector('.dealer');
const scorePlayer = document.getElementById('score--player');
const scoreDealer = document.getElementById('score--dealer');

//Elements for displaying )rendering) cards
const card = document.getElementById('cards');
//Player's table
const tablePlayer = document.getElementById('playerCanvas');
const contextPlayer = tablePlayer.getContext('2d');
//Dealer's table
const tableDealer = document.getElementById('dealerCanvas');
const contextDealer = tableDealer.getContext('2d');

//-----------------------------------------------------------
//SETUP (basic arrays & variables)
//-----------------------------------------------------------

let scores, activePlayer, deck, playerHand, dealerHand;
const cardSuits = ['hearts', 'clubs', 'diamonds', 'spades'];
// prettier-ignore
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',];

//-----------------------------------------------------------------------------------------
// 2) INIT (Start & Restart game) & Supporting functions
//-----------------------------------------------------------------------------------------

const init = function () {
  //Initiate || Reset values & elements

  //Values
  scores = [0, 0];
  activePlayer = 0;
  scorePlayer.textContent = 0;
  scoreDealer.textContent = 0;
  playerHand = [];
  dealerHand = [];

  //Players elements
  player.classList.remove('player--winner');
  dealer.classList.remove('player--winner');
  player.classList.add('player--active');
  dealer.classList.remove('player--active');

  //Buttons elements
  btnHit.classList.remove('btn--frozen');
  btnStand.classList.remove('btn--frozen');
  btnHit.classList.add('btn');
  btnStand.classList.add('btn');
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
const dealCards = function () {
  dealSound();
  freezeButtons();

  for (let i = 0; i < 2; i++) {
    setTimeout(function timer() {
      dealerHand[i] = dealCard();
      getPoints(dealerHand, '1st');
      playerHand[i] = dealCard();
      getPoints(playerHand);
      drawCardsAndHideDealersFirst(dealerHand, contextDealer);
      drawCards(playerHand, contextPlayer);
    }, i * 800);
  }
  unFreezeButtons();
};

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
//---------------------------------------------------------------------------------------------------
// Buttons - Event listeners
//-------------------------------------------------------------------------------------------------

//---------------------------------------------------
//BTN HIT CARD
//---------------------------------------------------
btnHit.addEventListener('click', function hit() {
  hitMe(playerHand, contextPlayer);
  getPoints(playerHand);

  if (playerHand.points > 21) {
    freezeButtons();
    console.log('You busted');
    gameOverSound();
    //open modal window - you busted, play again?
    //play winning sound
  }
});
//---------------------------------------------------
//BTN STAND
//---------------------------------------------------

//---------------------------------------------------
function hitMe(hand, context) {
  hand.push(dealCard());
  drawCards(hand, context);
  hitSound();
}
//---------------------------------------------------
//---------------------------------------------------
function dealCard() {
  let card = deck.pop();
  console.log(card);
  return card;
}
//---------------------------------------------------
function getPoints(hand, round) {
  let points = 0;
  for (let i = 0; i < hand.length; i++) {
    points += hand[i].cardWeight;
  }
  hand.points = points;
  if (hand === playerHand) {
    scorePlayer.textContent = points;
  } else if (round === '1st') {
    scoreDealer.textContent = '?';
  } else {
    scoreDealer.textContent = points;
  }
  return points;
}
//---------------------------------------------------
function openModal() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

//Close window & Start Game
function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  init();
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
btnContinue.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//The only reason I'm using async function is because clasic SetTimeout was freezing browser in this loop.

async function dealersTurn() {
  let y = dealerHand.points;

  for (let i = dealerHand.points; i < 17; i = i + (dealerHand.points - y)) {
    hitMe(dealerHand, contextDealer);
    getPoints(dealerHand);
    await new Promise(r => setTimeout(r, 800));
  }

  if (dealerHand.points > 21) {
    console.log('Dealer is BUSTED, YOU WON!!!');
    wonSound();
    //Modal window, Dealer's buster, you WONN, play again?
  } else if (dealerHand.points === playerHand.points) {
    console.log('Its a draw!');
    //Modal window, Player had X, dealaer had Y, its a draw, play again?
  } else if (dealerHand.points > playerHand.points) {
    console.log('Dealer won');
    gameOverSound();
    //Modal window, Player had X, dealaer had Y, dealer Won,  game over sound, play again?
  } else {
    console.log('You won won!!');
    wonSound();
    //Modal window, Player had X, dealaer had Y, You WON! congratulations,  game over sound, play again?
  }
}

function freezeButtons() {
  btnHit.classList.remove('btn');
  btnStand.classList.remove('btn');
  btnHit.classList.add('btn--frozen');
  btnStand.classList.add('btn--frozen');
  btnHit.disabled = true;
  btnStand.disabled = true;
}

function unFreezeButtons() {
  setTimeout(function () {
    btnHit.classList.add('btn');
    btnStand.classList.add('btn');
    btnHit.classList.remove('btn--frozen');
    btnStand.classList.remove('btn--frozen');
    btnHit.disabled = false;
    btnStand.disabled = false;
    playersTurn();
  }, 1600);
}

function playersTurn() {
  turnSound();
}

function checkWinner(hand) {
  if (hand.points > 21) {
    //Open modal window
    //If hand je dealerhand, tak open window Delaer Busted, you are winner ELSE you busted, you lost
  } else {
    //if player.handpoints > dealer.handpoints player winner,
    //else dealer winner
  }
}

btnStand.addEventListener('click', function stand() {
  getPoints(dealerHand);
  dealersTurn();
  freezeButtons();
});

//-----------------------------------

//Click on a New Game Button
btnNew.addEventListener('click', function () {
  init();
});

//This is somewhat whacky implementation of sounds. Spent X hours trying to make it "cleaner", select it at the global like buttons above, however this is only solution that worked. Otherwise getting "cannot read property null" etc.

function hitSound() {
  let audio = document.getElementById('hitsound');
  audio.play();
}

function dealSound() {
  let audio = document.getElementById('dealsound');
  audio.play();
}

function turnSound() {
  let audio = document.getElementById('turn');
  audio.play();
}

function wonSound() {
  let audio = document.getElementById('won');
  audio.play();
}

function gameOverSound() {
  let audio = document.getElementById('gameover');
  audio.play();
}

//-----------------------------------------------------------

/* 1) CREATE THE DECK: pairing up each suit from the 'cardSuits' array with each possible value from the array 'cardValues'. We let JS create an array storing 52 objects which each represents one card in standard 52 card deck.

//In JS array is a data structure which bundle multiple SINGLE values. Object on the other hand can store values and their properties (object is associative array, value pairs). But array is best whenever we need an order, we can iterate through it based on its index. But array can also store objects. So in this case we store 52 objects (value pairs) each representing one single card into an array 'deck'. We create func

//I'm gonna use loop inside the loop to pair elements of 2 arrays into 1 object where one array (cardValue) is the actual element and another array, the cardSuits is it's property. I'll store those 52 objects into one new array. Each time function getDeck gets called it returns brand new array 'deck' with 52 objects (cards)

//This is good example how to create array storing objects which we can later later access by their index.


function createDeck() {
  const deck = [];

  for (let i = 0; i < cardSuits.length; i++) {
    for (let j = 0; j < cardValues.length; j++) {
      const card = { value: cardValues[j], suit: cardSuits[i] };
      deck.push(card);
    }
  }
  return deck;
}

/* 
2)SHUFFLE THE DECK : Creating function to shuffle deck. I'm gonna use the Durstenfeld shuffle, which is an optimized version of the famous, greatest, the best shuffling alghorithm - Fisher-Yates. At least according to stackoverflow, what do I know, haha :D

I'm using ES6/ECMAScript 2015 which allows assign two variables at once = shorter code


function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
*/
