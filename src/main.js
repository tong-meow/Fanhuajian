/* MAIN DOES MOST GAME PLAY STUFF */

//////////////////////////////////////////////////////////////////
// Cards Clickable Array
var clickable = new Array();

// Cards
var pool = new Array(); // 108 total, 13 groups * 4 + goose * 4
var deck = new Array(); // 54 cards, displayed on the board
var pile = new Array(); // 54 cards, 52 in the pile, 2 hand cards

// Gameplay
var chosenCards = ["", ""];
var hand1Cards = new Array();
var hand2Cards = new Array();
var pileRemain = 54; // remaining cards track

// Score
var totalScore = 0;
var stepScore = 10; // score of the current step


//////////////////////////////////////////////////////////////////
$(document).ready(function() {
    setHowToPlayBoard();
    clickable = setClickable();
    setCardBoard();
    // set up all the listeners
    setUpListener();
});

function newGame(){
    clearAll();
    // hide the information part
    const infoDiv = document.getElementById("info");
    infoDiv.style.display = "none";
    // hide the winning part
    const winningDiv = document.getElementById("win");
    winningDiv.style.display = "none";
    // display the game canvas
    const canvasDiv = document.getElementById("canvas");
    canvasDiv.style.display = "block";
    // generate a new card pool and deck
    pool = setGeneralModePool();
    pool = shufflePool(pool);
    deck = generateDeck();
    pile = generatePile();
    // display deck and pile and 2 hand cards
    displayDeck(deck);
    // put 2 cards in pile into hand cards array
    getTwoHandCards();
}

function clearAll(){
    pool = new Array();
    deck = new Array();
    pile = new Array();
    hand1Cards = new Array();
    hand2Cards = new Array();
    resetGameBoard();
    resetGame();
    // clearListner();
}

function resetGame(){
    chosenCards = ["", ""];
    pileRemain = 54;
    totalScore = 0;
    stepScore = 10;
}

function getTwoHandCards(){
    if (pile.length == 0) return;
    if (pile.length == 1) {
        hand1Cards.push(pile.shift());
    }
    else {
        hand1Cards.push(pile.shift());
        hand2Cards.push(pile.shift());
    }
    pileRemain = pile.length;
    displayPile(hand1Cards[hand1Cards.length-1], 
                hand2Cards[hand2Cards.length-1], 
                pileRemain);
    stepScore = 10;
    if (pileRemain == 0) {
        let isWin = checkWinningStatus();
        if (isWin) {
            displayWinningPage(totalScore);
        }
    }
}

function setUpListener(){
    // set listener to the document
    setListenerToDocument();
    // set listener for last row
    setListenerToDeck();
    // set listener for 2 hand cards
    $("#hand1").on("click", function(){ onChooseDeckCard("#hand1"); });
    $("#hand2").on("click", function(){ onChooseDeckCard("#hand2"); });
    // set listener for card pile
    $("#pileCards").on("click", function(){ getTwoHandCards(); });
}

function setListenerToDocument(){
    $(document).on("click", function(event){
        let cancelChose = true;
        clickable.forEach(e => {
            // if the player clicked another valid card
            // do not unhighlight the chosed one
            if( $(event.target).closest(e).length != 0){
                cancelChose = false;
            }
        });
        // if the player clicked the card pile
        // unhighlight the chose one
        if( $(event.target).closest("#pileCards").length != 0) {
            cancelChose = true;
        }
        // if it's canceling, unhighlight chosen cards
        // clear chosen cards pair
        if (cancelChose) {
            unhighlightCard(chosenCards[0]);
            unhighlightCard(chosenCards[1]);
            chosenCards = ["", ""];
        }
    });
}

function setListenerToDeck(){
    // the last card for each row 
    for (let i = 0; i < 6; i++) {
        let cardId = "#card" + i + "-8";
        $(cardId).on("click", function(){
            onChooseDeckCard(cardId);
        });
    }
}

function onChooseDeckCard(cardId){
    let card = getCardFromId(cardId);
    if (card != undefined) {
        if (chosenCards[0] == "" && chosenCards[1] == "") {
            highlightCard(cardId);
            chosenCards[0] = cardId;
        }
        else {
            if (chosenCards[0] == cardId){
                unhighlightCard(cardId);
                chosenCards = ["", ""];
            } else {
                highlightCard(cardId);
                chosenCards[1] = cardId;
                checkPair();
            }
        }
    }
    else {
        disableCard(cardId);
        if (chosenCards[0] != "") {
            unhighlightCard(chosenCards[0]);
        }
        chosenCards = ["", ""];
    }
}

function checkPair() {
    let card1 = getCardFromId(chosenCards[0]);
    let card2 = getCardFromId(chosenCards[1]);
    if ((card1.number == 0 || card2.number == 0) ||
        (card1.number + card2.number == 27) ||
        (card1.number == card2.number) ){
        // add score
        totalScore += stepScore;
        stepScore += 10;
        updateScore(totalScore);
        // cancel highlight
        unhighlightCard(chosenCards[0]);
        unhighlightCard(chosenCards[1]);
        // remove this pair
        chosenCards.forEach(c => {
            removeCard(c);
        });
        // clear chosenCards
        chosenCards = ["", ""];
        // check winning status
        let isWin = checkWinningStatus();
        if (isWin) {
            displayWinningPage(totalScore);
        }
    }
    else {
        // cancel highlight
        unhighlightCard(chosenCards[0]);
        unhighlightCard(chosenCards[1]);
        chosenCards = ["", ""];
    }
}

function getCardFromId(cardId){
    if (cardId == "#hand1") {
        return hand1Cards.length != 0 ? hand1Cards[hand1Cards.length-1]: undefined;
    }
    else if (cardId == "#hand2"){
        return hand2Cards.length != 0 ? hand2Cards[hand2Cards.length-1]: undefined;
    }
    else {
        // #card1-8 #card2-8
        let col = Number(cardId.charAt(5));
        return deck[col].length != 0 ? deck[col][deck[col].length-1] : undefined;
    }
}

function removeCard(cardId){
    if (cardId == "#hand1") {
        hand1Cards.pop();
        if (hand1Cards.length == 0) {
            hand1Cards.push(pile.shift());
            pileRemain--;
            updatePile(pileRemain);
        }
        updateHand(1, hand1Cards[hand1Cards.length-1]);
    }
    else if (cardId == "#hand2"){
        hand2Cards.pop();
        if (hand2Cards.length == 0) {
            hand2Cards.push(pile.shift());
            pileRemain--;
            updatePile(pileRemain);
        }
        updateHand(2, hand2Cards[hand2Cards.length-1]);
    }
    else {
        // #card1-8
        let col = Number(cardId.charAt(5));
        deck[col].pop();
        updateCol(col, deck);
    }
}

function checkWinningStatus(){
    // 1. if all cards in deck is cleard, win
    let deckCleared= true;
    deck.forEach(col => {
        if (col.length != 0) {
            deckCleared = false;
        }
    });
    if (deckCleared){
        totalScore += 100 * pileRemain;
        updateScore(totalScore);
        return true;
    }

    // 2. if pile remain is 0, and no pairs exists, win
    if (pileRemain == 0) {
        // get all the cards available
        let remains = new Array();
        let hand1 = getCardFromId("#hand1");
        if (hand1 != undefined) remains.push(hand1);
        let hand2 = getCardFromId("#hand2");
        if (hand2 != undefined) remains.push(hand2);
        for (let col = 0; col < 6; col++){
            let card = getCardFromId("#card"+col+"-8");
            if (card != undefined) remains.push(card);
        }
        console.log("Get all the cards available: " + remains);
        // if there is only 0 or 1 card left, win
        if (remains.length == 0 || remains.length == 1) return true;
        // check if any two are a pair
        for (let i = 0; i < remains.length-1; i++) {
            for (let j = i+1; j < remains.length-1; j++) {
                if (remains[i].number == 0 || remains[j].number == 0) {
                    return false;
                }
                else if (remains[i].number + remains[j].number == 27) {
                    return false;
                }
                else if (remains[i].number == remains[j].number) {
                    return false;
                }
            }
        }
        return true;
    }
}