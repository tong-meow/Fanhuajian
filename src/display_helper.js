/* DISPLAY_HELPER DOES MOST DYNAMIC DISPLAYING STUFF */

function setHowToPlayBoard(){
    const canvasDiv = document.getElementById("canvas");
    canvasDiv.style.display = "none";
    const winningDiv = document.getElementById("win");
    winningDiv.style.display = "none";
    const stepDiv = document.getElementById("stepScore");
    stepDiv.style.display = "none";
}

function setCardBoard(){
    var i = 0;
    while (i < 6) {
        var idStr = "cardsArray" + i;
        $('#cardsTable').append($('<div>').prop({
            class: 'cardsArray',
            id: idStr
        }));
        appendCardsDiv(idStr, i);
        i++;
    }
    displayCards();
}

function appendCardsDiv(idStr, i){
    var findID = "#" + idStr;
    var j = 0;
    while (j < 9) {
        var idStr = "card" + i + "-" + j;
        $(findID).append($('<div>').prop({
                id: idStr,
                class: 'card'
            })
        );
        j++;
    }
}

function displayCards(){
    for(var i = 0; i < 6; i++){
        for(var j = 0; j < 9; j++){
            var idStr = "card" + i + "-" + j;
            var card = document.getElementById(idStr);
            $(card).css("z-index", j);
            $(card).css("margin-top", getMarginTop(j));
            $(card).css("background-image", "url(../assets/card.jpg)");
            $(card).css("background-size", "80px 120px");
            $(card).css("writing-mode", "vertical-rl");
            $(card).css("text-orientation", "upright");
            var textIdStr = "text" + i + "-" + j;
            $(card).append($('<div>').prop({
                    id: textIdStr,
                    class: 'text',
                    innerHTML: ''
                })
            );
        }
    }
}

function getMarginTop(j){
    return (28 * j).toString() + "px";
}

function displayDeck(deck){
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 9; j++) {
            let cardIdStr = "#card" + i + "-" + j;
            let textIdStr = "#text" + i + "-" + j;
            let poem = deck[i][j];
            if (poem.number == 0) {
                $(cardIdStr).css("background-image", "url(../assets/goose.png)");
                $(textIdStr).text("");
            }else{
                $(textIdStr).text(poem.content);
            }
        }
    }
}

function displayPile(handCard1, handCard2, pileRemain){
    // deal with hand card #1
    if (handCard1.number == 0) {
        $("#hand1").css("background-image", "url(../assets/goose.png)");
        $("#text1").text("");
    }
    else{
        $("#hand1").css("background-image", "url(../assets/card.jpg)");
        $("#text1").text(handCard1.content);
    }

    // deal with hand card #2
    if (handCard2.number == 0) {
        $("#hand2").css("background-image", "url(../assets/goose.png)");
        $("#text2").text("");
    }
    else{
        $("#hand2").css("background-image", "url(../assets/card.jpg)");
        $("#text2").text(handCard2.content);
    }

    // display pile
    $("#pilesText").text(pileRemain.toString());
}

function resetGameBoard(){
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 9; j++) {
            let cardIdStr = "#card" + i + "-" + j;
            let textIdStr = "#text" + i + "-" + j;
            if(!$(cardIdStr).length){
                console.log("This div doesnt exist: " + cardIdStr);
                let cardArrayId = "#cardsArray" + i;
                let realCardId = "card" + i + "-" + j;
                $(cardArrayId).append($('<div>').prop({
                    id: realCardId,
                    class: 'card'
                }));
                $(cardIdStr).css("z-index", j);
                $(cardIdStr).css("margin-top", getMarginTop(8));
                $(cardIdStr).css("background-image", "url(../assets/card.jpg)");
                $(cardIdStr).css("background-size", "80px 120px");
                $(cardIdStr).css("writing-mode", "vertical-rl");
                $(cardIdStr).css("text-orientation", "upright");
                let realTextId = "text" + i + "-" + j;
                $(cardIdStr).append($('<div>').prop({
                    id: realTextId,
                    class: 'text',
                    innerHTML: ''
                }));
                $(cardIdStr).on("click", function(){
                    onChooseDeckCard(cardIdStr);
                });
            }
            $(cardIdStr).css("background-image", "url(../assets/card.jpg)");
            $(cardIdStr).css("border-width", "1px");
            $(textIdStr).text("");
        }
    }
    $("#score").text("0");
    $("#hand1").css("background-image", "url(../assets/card.jpg)");
    $("#text1").text("");
    $("#hand2").css("background-image", "url(../assets/card.jpg)");
    $("#text2").text("");
    $("pilesText").text("");
}

function highlightCard(cardId){
    if (cardId === "") return;
    $(cardId).css("border-color", "#a1753d");
    $(cardId).css("border-width", "2px");
    $(cardId).css("box-shadow", "0.1em 0.1em 0.2em 0.1em #e8dfc1");
}

function unhighlightCard(cardId){
    if (cardId === "") return;
    $(cardId).css("border-color", "#aaa36e");
    $(cardId).css("border-width", "1px");
    $(cardId).css("box-shadow", "");
}

function updateHand(handNumber, newCard){
    let cardElement = "#hand" + handNumber;
    let textElement = "#text" + handNumber;
    if (newCard.number == 0) {
        $(cardElement).css("background-image", "url(../assets/goose.png)");
        $(textElement).text("");
    }else{
        $(cardElement).css("background-image", "url(../assets/card.jpg)");
        $(textElement).text(newCard.content);
    }
}

function updatePile(pileRemain){
    $("#pilesText").text(pileRemain.toString());
}

function updateCol(col, deck){
    let array = deck[col];
    if (array.length == 0) {
        let cardElement = "#card" + col + "-8";
        disableCard(cardElement);
    }
    else {
        let index = array.length-1;
        // 8 7 6 5 4 * * * *   array.length = 5
        // 8 7 6 5 4 3 2 1 0
        for (let i = 8; i > (8 - array.length); i--) {
            let cardElement = "#card" + col + "-" + i;
            let textElement = "#text" + col + "-" + i;
            let card = array[index];
            if (card.number == 0) {
                $(cardElement).css("background-image", "url(../assets/goose.png)");
                $(textElement).text("");
            }else{
                $(cardElement).css("background-image", "url(../assets/card.jpg)");
                $(textElement).text(card.content);
            }
            index--;
        }
    }

    for (let i = 0; i <= (8 - array.length); i++) {
        let cardElement = "#card" + col + "-" + i;
        let textElement = "#text" + col + "-" + i;
        $(textElement).text("");
        $(cardElement).css("background-image", "");
        $(cardElement).css("border-width", "0");
    }
}

function updateScore(totalScore){
    $("#score").text(totalScore);
}

function disableCard(cardId){
    $(cardId).remove();
}

function displayWinningPage(totalScore){
    // hide the game canvas
    const canvasDiv = document.getElementById("canvas");
    canvasDiv.style.display = "none";
    // display the winning part
    const winningDiv = document.getElementById("win");
    winningDiv.style.display = "block";
    // display total score
    $("#totalScore").text(totalScore);
}

function showStepScore(stepScore) {
    const stepDiv = document.getElementById("stepScore");
    stepDiv.style.display = "block";
    $("#step").text(stepScore);

    let marginTop = 60;

    var fadeEffect = setInterval(function () {
        if (!stepDiv.style.opacity) {
            stepDiv.style.opacity = 1;
        }
        if (stepDiv.style.opacity > 0) {
            let top = marginTop.toString() + "px";
            marginTop -= 3;
            $(stepDiv).css("margin-top", top);
            stepDiv.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
            // $(stepDiv).css("opacity", "1");
            stepDiv.style.opacity = 1;
            $(stepDiv).css("margin-top", "60px");
            stepDiv.style.display = "none";
        }
    }, 50);
}