const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

function quantify(data, playerIndex) {
    const board = data.board;
    const hand = data.hand[playerIndex];
    const spread = board.concat(hand);
    for (let i = 0; i < spread.length; i++) {
        let cardNumber = Number(spread[i].slice(0, -1));
        let cardSuit = spread[i].charAt(spread[i].length - 1);
        spread[i] = [cardNumber, cardSuit];
    }
    return spread;
}

function aceHighSort(spread) {
    for (let i = 0; i < spread.length; i++) {
        for (let z = (i + 1); z < spread.length; z++) {
            if (spread[i][0] > spread[z][0]) {
                let iValue = spread[i];
                spread[i] = spread[z];
                spread[z] = iValue;
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        if (spread[0][0] == 1) {
            let ace = spread.shift();
            spread.push(ace);
        }
    }
    return spread;
}

function isStraightFlush(originalSpread) {
    const spreadData = [];
    for (let i = 0; i < originalSpread.length; i++) {
        let newLen = spreadData.length - 1;
        if (spreadData.length > 0) {
            if (spreadData[newLen - 1] !== originalSpread[i][0]) {
                let nextCard = originalSpread[i];
                spreadData.push(...nextCard);
            }
        } else {
            let nextCard = originalSpread[i];
            spreadData.push(...nextCard);
        }   
    }
    const spread = [];
    for (let i = 0; i < spreadData.length; i = i + 2) {
        let tempArr = [];
        tempArr.push(spreadData[i]);
        tempArr.push(spreadData[i + 1]);
        spread.push(tempArr);
    }
    if (spread.length < 5) {
        return false;
    }
    let count = 1;
    if (spread[spread.length - 1][0] == 1) {
        let aceCard = spread[spread.length - 1];
        spread.unshift([...aceCard]);
        spread[spread.length - 1][0] = 14;
    } // Aces high and low
   for (let i = 0; i < spread.length; i++) {
        if (spread.length < 5) {
            return false;
        }
        let len = spread.length - 1;
        if (((spread[len - i][0] - 1) == spread[len - i - 1][0]) && (spread[len - i][1] == spread[len - i - 1][1])) {
            count++;
        } else {
            count = 1;
            i = -1;
            spread.pop();
        }
        if (count > 4) {
            let highCard = spread[len][0];
            highCard = (highCard == 14) ? 1 : highCard;
            return {
                isStraightFlush: true,
                highCard: highCard,
            }
        }
    }
    return false;
}

function isFlush(spread) {
    let hCount = 0, dCount = 0, sCount = 0, cCount = 0;
    let highCardH = 2, highCardD = 2, highCardS = 2, highCardC = 2;
    for (let i = 0; i < 7; i++) {
        if (spread[i][0] == 1) spread[i][0] = 14; // Ace's High
        if (spread[i][1] == 'H') {
            hCount++;
            highCardH = (spread[i][0] > highCardH) ? spread[i][0] : highCardH;
        } else if (spread[i][1] == 'D') {
            dCount++;
            highCardD = (spread[i][0] > highCardD) ? spread[i][0] : highCardD;
        } else if (spread[i][1] == 'S') {
            sCount++;
            highCardS = (spread[i][0] > highCardS) ? spread[i][0] : highCardS;
        } else if (spread[i][1] == 'C') {
            cCount++;
            highCardC = (spread[i][0] > highCardC) ? spread[i][0] : highCardC;
        }
    }
    for (let i = 0; i < 4; i++) {
        let len = spread.length - 1;
        if (spread[len - i][0] == 14) spread[len - i][0] = 1; // Return to Ace Form
    }
    if (hCount > 4) {
        if (highCardH == 14) highCardH = 1;
        return {
    	    isFlush: true,
    	    highCard: highCardH,
            suit: "H",
    	}
    }
    if (dCount > 4) {
        if (highCardD == 14) highCardD = 1;
        return {
    	    isFlush: true,
    	    highCard: highCardD,
            suit: "D",
    	}
    }
    if (sCount > 4) {
        if (highCardS == 14) highCardS = 1;
        return {
    	    isFlush: true,
    	    highCard: highCardS,
            suit: "S",
    	}
    }
    if (cCount > 4) {
        if (highCardC == 14) highCardC = 1;
        return {
    	    isFlush: true,
    	    highCard: highCardC,
            suit: "C",
    	}
    }
    return false;
}

function isStraight(originalSpread) {
    const spread = [];
    for (let i = 0; i < originalSpread.length; i++) {
        let newLen = spread.length - 1;
        if (spread.length > 0) {
            if (spread[newLen] !== originalSpread[i][0]) {
                let nextCard = originalSpread[i][0];
                spread.push(nextCard);
            }
        } else {
            let nextCard = originalSpread[i][0];
            spread.push(nextCard);
        }   
    }
    if (spread.length < 5) {
        return false;
    }
    let count = 1;
    if (spread[spread.length - 1] == 1) {
        spread.unshift(1);
        spread[spread.length - 1] = 14;
    } // Aces high and low
    for (let i = 0; i < spread.length; i++) {
        if (spread.length < 5) {
            return false;
        }
        let len = spread.length - 1;
        if ((spread[len - i] - 1) == spread[len - i - 1]) {
            count++;
        } else {
            count = 1;
            i = -1;
            spread.pop();
        }
        if (count > 4) {
            let highCard = spread[len];
            highCard = (highCard == 14) ? 1 : highCard;
            return {
                isStraight: true,
                highCard: highCard,
            }
        }
    }
    return false;
}

function isFullHouse(spread) {
    let tripleArr = [];
    for (let i = 0; i < (spread.length - 2); i++) {
        let len = spread.length - 1;
        if ((spread[len - i][0] == spread[len - i - 1][0]) && (spread[len - i])[0] == spread[len - i - 2][0]) {
            tripleArr.push(spread[len - i]);
            tripleArr.push(spread[len - i - 1]);
            tripleArr.push(spread[len - i - 2]);
            break;
        }
    }
    if (tripleArr.length < 3) {
        return false;
    }
    let doubleArr = [];
    for (let i = 0; i < (spread.length - 1); i++) {
        let len = spread.length - 1;
        if ((spread[len - i][0] !== tripleArr[0][0]) && (spread[len - i][0] == spread[len - i - 1][0])) {
            doubleArr.push(spread[len - i]);
            doubleArr.push(spread[len - i - 1]);
            break;
        }
    }
    if (doubleArr.length < 2) {
        return false;
    }
    const tripleValue = tripleArr[0][0];
    const doubleValue = doubleArr[0][0];
    return {
        isFullHouse: true,
        tripleValue: tripleValue,
        doubleValue: doubleValue,
    };
}

function isFourOfAKind(spread) {
    let quadArr = [];
    for (let i = 0; i < (spread.length - 3); i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if ((first == spread[len - i - 1][0]) && (first == spread[len - i - 2][0]) && (first == spread[len - i - 3][0])) {
            quadArr.push(spread[len - i]);
            quadArr.push(spread[len - i - 1]);
            quadArr.push(spread[len - i - 2]);
            quadArr.push(spread[len - i - 3]);
            break;
        }
    }
    if (quadArr.length < 4) {
        return false;
    }
    const highCard = quadArr[0][0];
    return {
        isFourOfAKind: true,
        highCard: highCard,
    };
}

function isThreeOfAKind(spread) {
    let tripleArr = [];
    for (let i = 0; i < (spread.length - 2); i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if ((first == spread[len - i - 1][0]) && (first == spread[len - i - 2][0])) {
            tripleArr.push(spread[len - i]);
            tripleArr.push(spread[len - i - 1]);
            tripleArr.push(spread[len - i - 2]);
            break;
        }
    }
    if (tripleArr.length < 3) {
        return false;
    }
    const tripleValue = tripleArr[0][0];
    let kickerOne = 0, kickerTwo = 0;
    for (let i = 0; i < spread.length; i++) {
        let len = spread.length - 1;
        let highValue = spread[len - i][0];
        if (highValue !== tripleValue) {
            kickerOne = highValue;
            break;
        }
    }
    for (let i = 0; i < spread.length; i++) {
        let len = spread.length - 1;
        let highValue = spread[len - i][0];
        if ((highValue !== tripleValue) && (highValue !== kickerOne)) {
            kickerTwo = highValue;
            break;
        }
    }
    return {
        isThreeOfAKind: true,
        tripleValue: tripleValue,
        kickerOne: kickerOne,
        kickerTwo: kickerTwo,
    };
}

function isTwoPair(spread) {
    let firstDoubleArr = [];
    for (let i = 0; i < (spread.length - 1); i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if (first == spread[len - i - 1][0]) {
            firstDoubleArr.push(spread[len - i]);
            firstDoubleArr.push(spread[len - i - 1]);
            break;
        }
    }
    if (firstDoubleArr.length < 2) {
        return false;
    }
    let secondDoubleArr = [];
    for (let i = 0; i < (spread.length - 1); i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if (first !== firstDoubleArr[0][0]) {
            if (first == spread[len - i - 1][0]) {
                secondDoubleArr.push(spread[len - i]);
                secondDoubleArr.push(spread[len - i - 1]);
                break;
            }
        }
    }
    if (secondDoubleArr.length < 2) {
        return false;
    }
    let highCard = firstDoubleArr[0][0];
    const secondHighCard = secondDoubleArr[0][0];
    if (highCard == 14) {
    	highCard = 1;
    }
    let kicker = 0;
    for (let i = 0; i < spread.length; i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if ((first !== highCard) && (first !== secondHighCard)) {
            kicker = first;
            break;
        }
    }
    return {
        isTwoPair: true,
        highCard: highCard,
        secondHighCard: secondHighCard,
        kicker: kicker,
    }
}


function isPair(spread) {
    let doubleArr = [];
    for (let i = 0; i < (spread.length - 1); i++) {
        let len = spread.length - 1;
        let first = spread[len - i][0];
        if (first == spread[len - i - 1][0]) {
            doubleArr.push(spread[len - i]);
            doubleArr.push(spread[len - i - 1]);
            break;
        }
    }
    if (doubleArr.length < 2) {
        return false;
    }
    let highCard = doubleArr[0][0];
    if (highCard == 14) {
        highCard = 1;
    }
    return {
        isPair: true,
        highCard: highCard,
    };
}

function highCard(spread) {
    let highCard = spread[spread.length - 1][0];
    if (highCard == 14) {
    		highCard = 1;
    }
    return highCard;
}

function getHandStrength(spread) {
    const straightFlushData = isStraightFlush(spread);
    if (straightFlushData !== false) {
        return {
            tier: 1,
            highCard: straightFlushData.highCard,
        }
    }
    const fourOfAKindData = isFourOfAKind(spread);
    if (fourOfAKindData !== false) {
        return {
            tier: 2,
            highCard: fourOfAKindData.highCard,
        }
    }
    const fullHouseData = isFullHouse(spread);
    if (fullHouseData !== false) {
        return {
            tier: 3,
            tripleValue: fullHouseData.tripleValue,
            doubleValue: fullHouseData.doubleValue,
        }
    }
    const flushData = isFlush(spread);
    if (flushData !== false) {
        return {
            tier: 4,
            highCard: flushData.highCard,
            suit: flushData.suit,
        }
    }
    const straightData = isStraight(spread);
    if (straightData !== false) {
        return {
            tier: 5,
            highCard: straightData.highCard,
        }
    }
    const threeOfAKindData = isThreeOfAKind(spread);
    if (threeOfAKindData !== false) {
        return {
            tier: 6,
            tripleValue: threeOfAKindData.tripleValue,
            kickerOne: threeOfAKindData.kickerOne,
            kickerTwo: threeOfAKindData.kickerTwo,
        }
    }
    const twoPairData = isTwoPair(spread);
    if (twoPairData !== false) {
        return {
            tier: 7,
            highCard: twoPairData.highCard,
            secondHighCard: twoPairData.secondHighCard,
            kicker: twoPairData.kicker,
        }
    }
    const pairData = isPair(spread);
    if (pairData !== false) {
        return {
            tier: 8,
            highCard: pairData.highCard,
        }
    }
    const highestCard = highCard(spread);
    return {
        tier: 9,
        highCard: highestCard,
    }
}

function drawFlopCards(flopData) {
    for (let i = 0; i < 3; i++) {
        const card = document.createElement('div');
        const distinctCard = flopData.flopArr[i];
        card.classList.add('playerCard');
        card.style.backgroundImage = `url("cards/${distinctCard}.svg")`;

        // Get the position of the deck card
        const deckCard = document.getElementById('deck');
        const deckRect = deckCard.getBoundingClientRect();
        
        // Position the flop cards horizontally next to the deck card
        let cardX = deckRect.right + (i * 110) - 140; // Spacing between cards
        let cardY = deckRect.top - (150 * i); // Align with the deck card vertically

        card.style.transform = `translate(${cardX}px, ${cardY}px)`;
        container.appendChild(card);
    }
}

function drawTurnCard(turnData) {
	const card = document.createElement('div');
	const distinctCard = turnData.turnCard;
	card.classList.add('playerCard');
	card.style.backgroundImage = `url("cards/${distinctCard}.svg")`;

	// Get the position of the deck card
	const deckCard = document.getElementById('deck');
	const deckRect = deckCard.getBoundingClientRect();
	
	// Position the flop cards horizontally next to the deck card
	let cardX = deckRect.right + 190; // Spacing between cards
	let cardY = deckRect.top - 450; // Align with the deck card vertically

	card.style.transform = `translate(${cardX}px, ${cardY}px)`;
	container.appendChild(card);
}

function drawRiverCard(riverData) {
	const card = document.createElement('div');
	const distinctCard = riverData;
	card.classList.add('playerCard');
	card.style.backgroundImage = `url("cards/${distinctCard}.svg")`;

	// Get the position of the deck card
	const deckCard = document.getElementById('deck');
	const deckRect = deckCard.getBoundingClientRect();
	
	// Position the flop cards horizontally next to the deck card
	let cardX = deckRect.right + 300; // Spacing between cards
	let cardY = deckRect.top - 600; // Align with the deck card vertically

	card.style.transform = `translate(${cardX}px, ${cardY}px)`;
	container.appendChild(card);
	document.getElementById('deck').style = `background-image: url('cards/card_back.svg'); transform: translate(-330px, -80px);`;
}

function reDrawCards() {
	if (didFlop == true) {
		drawFlopCards(flopData);
	}
	if (didTurn == true) {
		drawTurnCard(turnData);
	}
	if (didRiver == true) {
		drawRiverCard(riverData);
	}
}

window.addEventListener('resize', reDrawCards);