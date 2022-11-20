function getRandomIndex(max){
    var result = new Set();
    for(var i = 0; i < 13; i++){
        num = Math.floor(Math.random() * max);
        if (result.has(num)) i--;
        else result.add(num);
    }
    return Array.from(result);
}

function generateRoundPool(pick) {
    var result = new Array();
    // put 4 goose cards
    for (var i = 0; i < 4; i++) {
        result[i] = gooseCard();
    }
    // put picked cards into round pool
    var index = 4;
    for (var i = 0; i < pick.length; i++) {
        var poem = pick[i].split("，");
        for (var j = 0; j < 4; j++) {
            result[index] = {};
            result[index].number = i + 1;
            result[index].content = poem[0];
            result[index+1] = {};
            result[index+1].number = 27 - (i + 1);
            result[index+1].content = poem[1];
            index += 2;
        }
    }

    return result;
}

function gooseCard(){
    var goose = {};
    goose.number = 0;
    goose.content = "鹅";
    return goose;
}

function shufflePool(array){
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = 
      [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateDeck(){
    let deck = new Array();
    let index = 0;
    for (var i = 0; i < 6; i++) {
        deck[i] = new Array();
        for (var j = 0; j < 9; j++) {
            deck[i][j] = pool[index];
            index++;
        }
    }
    return deck;
}

function generatePile(){
    let pile = new Array();
    for (var i = 0; i < 54; i++) {
        pile[i] = pool[i + 54];
    }
    return pile;
}

function setClickable(){
    let result = new Array();
    for (let i = 0; i < 6; i++) {
        let cardId = "#card" + i + "-8";
        result.push(cardId);
    }
    result.push("#hand1");
    result.push("#hand2");
    result.push("#pileCards");
    return result;
}