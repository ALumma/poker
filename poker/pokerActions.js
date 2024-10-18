function updateButtonStatus(toggle) {

}

function flop(preFlopDeck) {
    preFlopDeck.pop(); // Burn
    const flopArr = [];
    flopArr.push(preFlopDeck.pop());
    flopArr.push(preFlopDeck.pop());
    flopArr.push(preFlopDeck.pop());
    return {
        preTurnDeck: preFlopDeck,
        flopArr: flopArr,
    };
}

function turn(preTurnDeck) {
    preTurnDeck.pop(); // Burn
    const turnCard = preTurnDeck.pop();
    return {
        preRiverDeck: preTurnDeck,
        turnCard: turnCard,
    };
}

function river(preRiverDeck) {
    preRiverDeck.pop(); // Burn
    const riverCard = preRiverDeck.pop();
    return riverCard;
}

function tiebreak(board, winnerGameData, winnerArr) {
	const tier = winnerArr[0].tier;
	if (tier == 1 || tier == 2) {
		let winningPlayer = winnerArr[0].playerNumber;
		let currentHighCard = winnerArr[0].highCard;
		for (let i = 1; i < winnerArr.length; i++) {
			if (((currentHighCard !== 1) && (winnerArr[i].highCard > currentHighCard)) || (winnerArr[i].highCard == 1)) {
				currentHighCard = winnerArr[i].highCard;
				winningPlayer = winnerArr[i].playerNumber;
			}
		}
		return winningPlayer;
	} else if (tier == 3) {
		let winningPlayerArr = [];
		winningPlayerArr.push([winnerArr[0].playerNumber, winnerArr[0].doubleValue]);
		let currentHighTriple = winnerArr[0].tripleValue;
		for (let i = 1; i < winnerArr.length; i++) {
			if (winnerArr[i].tripleValue == currentHighTriple) {
				winningPlayerArr.push([winnerArr[i].playerNumber, winnerArr[i].doubleValue]);
			} else if (((currentHighTriple !== 1) && (winnerArr[i].tripleValue > currentHighTriple))  || (winnerArr[i].tripleValue == 1)) {
				currentHighTriple = winnerArr[i].tripleValue;
				winningPlayerArr = [];
				winningPlayerArr.push([winnerArr[i].playerNumber, winnerArr[i].doubleValue]);
			}
		}
        if (winningPlayerArr.length == 1) {
            return [winningPlayerArr[0][0]];
        }
		let newWinningPlayerArr = [];
		newWinningPlayerArr.push(winningPlayerArr[0][0]);
		let currentHighDouble = winningPlayerArr[0][1];
		for (let i = 1; i < winningPlayerArr.length; i++) {
			if (winningPlayerArr[i][1] == currentHighDouble) {
				newWinningPlayerArr.push(winningPlayerArr[i][0]);
			} else if (((currentHighDouble !== 1) && (winningPlayerArr[i][1] > currentHighDouble))  || (winningPlayerArr[i][1] == 1)) {
				currentHighDouble = winningPlayerArr[i][1];
				newWinningPlayerArr = [];
				newWinningPlayerArr.push(winningPlayerArr[i][0]);
			}
		}
		return newWinningPlayerArr;
	} else if (tier == 4) {
        const suit = winnerArr[0].suit;
        const sevenCardLineups = [];
        for (let i = 0; i < winnerArr.length; i++) {
            let spread = board.concat(winnerGameData[winnerArr[i].playerNumber][0]);
            spread.push(winnerGameData[winnerArr[i].playerNumber][1]);
            sevenCardLineups.push({playerNumber: winnerArr[i].playerNumber, spread: spread});
        }
        let flushLineups = [];
        for (let i = 0; i < sevenCardLineups.length; i++) {
            const flushLineup = [];
            for (let j = 0; j < sevenCardLineups[i].spread.length; j++) {
                const card = sevenCardLineups[i].spread[j];
                const cardSuit = card.charAt(card.length - 1);
                let cardValue = Number(card.slice(0, -1));
                if (cardValue == 1) {
                    cardValue = 14; //Aces high
                }
                if (cardSuit == suit) {
                    flushLineup.push(cardValue);
                }
            }
            flushLineups.push({playerNumber: sevenCardLineups[i].playerNumber, lineup: flushLineup});
        }
        const maxComparisons = 5;
		flushLineups.forEach(item => {
			item.lineup.sort((a, b) => b - a);
		});
		for (let i = 0; i < maxComparisons; i++) {
			let maxVal = Math.max(...flushLineups.map(item => item.lineup[i] || -Infinity));
			flushLineups = flushLineups.filter(item => item.lineup[i] === maxVal);
			if (flushLineups.length === 1) {
    			return flushLineups[0].playerNumber;
			}
		}
		return flushLineups.map(item => item.playerNumber);
	} else if (tier == 5) {
		let winningPlayerArr = [];
		winningPlayerArr.push(winnerArr[0].playerNumber);
		let currentHighCard = winnerArr[0].highCard;
		for (let i = 1; i < winnerArr.length; i++) {
			if (winnerArr[i].highCard == currentHighCard) {
				winningPlayerArr.push(winnerArr[i].playerNumber);
			} else if (((currentHighCard !== 1) && (winnerArr[i].highCard > currentHighCard))  || (winnerArr[i].highCard == 1)) {
				currentHighCard = winnerArr[i].highCard;
				winningPlayerArr = [];
				winningPlayerArr.push(winnerArr[i].playerNumber);
			}
		}
		return winningPlayerArr;
	} else if (tier == 6) {
        let firstCutPlayerArr = [];
        let currentMax = winnerArr[0].tripleValue;
        firstCutPlayerArr.push(winnerArr[0]);
		for (let i = 1; i < winnerArr.length; i++) {
            if (winnerArr[i].tripleValue == currentMax) {
                firstCutPlayerArr.push(winnerArr[i]);
            } else if (((currentMax !== 1) && (winnerArr[i].tripleValue > currentMax)) || (winnerArr[i].tripleValue == 1)) {
                firstCutPlayerArr = [];
                currentMax = winnerArr[i].tripleValue;
                firstCutPlayerArr.push(winnerArr[i]);
            }
        }
        if (firstCutPlayerArr.length == 1) {
            return firstCutPlayerArr[0].playerNumber;
        }
        let secondCutPlayerArr = [];
        currentMax = firstCutPlayerArr[0].kickerOne;
        secondCutPlayerArr.push(firstCutPlayerArr[0]);
		for (let i = 1; i < firstCutPlayerArr.length; i++) {
            if (firstCutPlayerArr[i].kickerOne == currentMax) {
                secondCutPlayerArr.push(firstCutPlayerArr[i]);
            } else if (((currentMax !== 1) && (firstCutPlayerArr[i].kickerOne > currentMax)) || (firstCutPlayerArr[i].kickerOne == 1)) {
                secondCutPlayerArr = [];
                currentMax = firstCutPlayerArr[i].kickerOne;
                secondCutPlayerArr.push(firstCutPlayerArr[i]);
            }
        }
        if (secondCutPlayerArr.length == 1) {
            return secondCutPlayerArr[0].playerNumber;
        }
        let thirdCutPlayerArr = [];
        currentMax = secondCutPlayerArr[0].kickerTwo;
        thirdCutPlayerArr.push(secondCutPlayerArr[0].playerNumber);
		for (let i = 1; i < secondCutPlayerArr.length; i++) {
            if (secondCutPlayerArr[i].kickerTwo == currentMax) {
                thirdCutPlayerArr.push(secondCutPlayerArr[i].playerNumber);
            } else if (((currentMax !== 1) && (secondCutPlayerArr[i].kickerTwo > currentMax)) || (secondCutPlayerArr[i].kickerTwo == 1)) {
                thirdCutPlayerArr = [];
                currentMax = secondCutPlayerArr[i].kickerTwo;
                thirdCutPlayerArr.push(secondCutPlayerArr[i].playerNumber);
            }
        }
		return thirdCutPlayerArr;
	} else if (tier == 7) {
		let firstCutPlayerArr = [];
        let currentMax = winnerArr[0].highCard;
        firstCutPlayerArr.push(winnerArr[0]);
		for (let i = 1; i < winnerArr.length; i++) {
            if (winnerArr[i].highCard == currentMax) {
                firstCutPlayerArr.push(winnerArr[i]);
            } else if (((currentMax !== 1) && (winnerArr[i].highCard > currentMax)) || (winnerArr[i].highCard == 1)) {
                firstCutPlayerArr = [];
                currentMax = winnerArr[i].highCard;
                firstCutPlayerArr.push(winnerArr[i]);
            }
        }
        if (firstCutPlayerArr.length == 1) {
            return firstCutPlayerArr[0].playerNumber;
        }
        let secondCutPlayerArr = [];
        currentMax = firstCutPlayerArr[0].secondHighCard;
        secondCutPlayerArr.push(firstCutPlayerArr[0]);
		for (let i = 1; i < firstCutPlayerArr.length; i++) {
            if (firstCutPlayerArr[i].secondHighCard == currentMax) {
                secondCutPlayerArr.push(firstCutPlayerArr[i]);
            } else if (((currentMax !== 1) && (firstCutPlayerArr[i].secondHighCard > currentMax)) || (firstCutPlayerArr[i].secondHighCard == 1)) {
                secondCutPlayerArr = [];
                currentMax = firstCutPlayerArr[i].secondHighCard;
                secondCutPlayerArr.push(firstCutPlayerArr[i]);
            }
        }
        if (secondCutPlayerArr.length == 1) {
            return secondCutPlayerArr[0].playerNumber;
        }
        let thirdCutPlayerArr = [];
        currentMax = secondCutPlayerArr[0].kicker;
        thirdCutPlayerArr.push(secondCutPlayerArr[0].playerNumber);
		for (let i = 1; i < secondCutPlayerArr.length; i++) {
            if (secondCutPlayerArr[i].kicker == currentMax) {
                thirdCutPlayerArr.push(secondCutPlayerArr[i].playerNumber);
            } else if (((currentMax !== 1) && (secondCutPlayerArr[i].kicker > currentMax)) || (secondCutPlayerArr[i].kicker == 1)) {
                thirdCutPlayerArr = [];
                currentMax = secondCutPlayerArr[i].kicker;
                thirdCutPlayerArr.push(secondCutPlayerArr[i].playerNumber);
            }
        }
		return thirdCutPlayerArr;
	} else if (tier == 8) {
        let firstCutPlayerArr = [];
        let currentMax = winnerArr[0].highCard;
        firstCutPlayerArr.push(winnerArr[0]);
		for (let i = 1; i < winnerArr.length; i++) {
            if (winnerArr[i].highCard == currentMax) {
                firstCutPlayerArr.push(winnerArr[i]);
            } else if (((currentMax !== 1) && (winnerArr[i].highCard > currentMax)) || (winnerArr[i].highCard == 1)) {
                firstCutPlayerArr = [];
                currentMax = winnerArr[i].highCard;
                firstCutPlayerArr.push(winnerArr[i]);
            }
        }
        if (firstCutPlayerArr.length == 1) {
            return firstCutPlayerArr[0].playerNumber;
        }
        const sevenCardLineups = [];
        for (let i = 0; i < firstCutPlayerArr.length; i++) {
            let spread = board.concat(winnerGameData[firstCutPlayerArr[i].playerNumber][0]);
            spread.push(winnerGameData[firstCutPlayerArr[i].playerNumber][1]);
            sevenCardLineups.push({playerNumber: firstCutPlayerArr[i].playerNumber, spread: spread, highCard: firstCutPlayerArr[i].highCard});
        }
		for (let i = 0; i < sevenCardLineups.length; i++) {
			for (let j = 0; j < sevenCardLineups[i].spread.length; j++) {
				sevenCardLineups[i].spread[j] = Number(sevenCardLineups[i].spread[j].slice(0, -1));
                if (sevenCardLineups[i].spread[j] == 1) {sevenCardLineups[i].spread[j] = 14}
			}
		}
        for (let i = 0; i < sevenCardLineups.length; i++) {
            sevenCardLineups[i].spread.sort((a, b) => b - a);
        }
        let threeCardLineups = [];
        for (let i = 0; i < sevenCardLineups.length; i++) {
            const lineup = [];
            let count = 0;
			let highCard = sevenCardLineups[i].highCard;
            for (let j = 0; count < 3; j++) {
                const cardValue = sevenCardLineups[i].spread[j];
                if (cardValue !== highCard) {
                    lineup.push(cardValue);
                    count++;
                }
            }
            threeCardLineups.push({playerNumber: sevenCardLineups[i].playerNumber, lineup: lineup});
        }
        const maxComparisons = 3;
		for (let i = 0; i < maxComparisons; i++) {
			let maxVal = Math.max(...threeCardLineups.map(item => item.lineup[i] || -Infinity));
			threeCardLineups = threeCardLineups.filter(item => item.lineup[i] === maxVal);
			if (threeCardLineups.length === 1) {
    			return threeCardLineups[0].playerNumber;
			}
		}
		return threeCardLineups.map(item => item.playerNumber);
	} else if (tier == 9) {
		let sevenCardLineups = [];
        for (let i = 0; i < winnerArr.length; i++) {
            let spread = board.concat(winnerGameData[winnerArr[i].playerNumber][0]);
            spread.push(winnerGameData[winnerArr[i].playerNumber][1]);
            sevenCardLineups.push({playerNumber: winnerArr[i].playerNumber, spread: spread, highCard: winnerArr[i].highCard});
        }
		for (let i = 0; i < sevenCardLineups.length; i++) {
			for (let j = 0; j < sevenCardLineups[i].spread.length; j++) {
				sevenCardLineups[i].spread[j] = Number(sevenCardLineups[i].spread[j].slice(0, -1));
                if (sevenCardLineups[i].spread[j] == 1) {sevenCardLineups[i].spread[j] = 14}
			}
		}
        for (let i = 0; i < sevenCardLineups.length; i++) {
            sevenCardLineups[i].spread.sort((a, b) => b - a);
        }
        const maxComparisons = 5;
		for (let i = 0; i < maxComparisons; i++) {
			let maxVal = Math.max(...sevenCardLineups.map(item => item.spread[i] || -Infinity));
			sevenCardLineups = sevenCardLineups.filter(item => item.spread[i] === maxVal);
			if (sevenCardLineups.length === 1) {
    			return sevenCardLineups[0].playerNumber;
			}
		}
		return sevenCardLineups.map(item => item.playerNumber);
	}
	return 'no winner found';
}

function revealBotCards(playerNumber, winnerGameData) {
	if (playerNumber < 2) {
		return;
	}
	const botCardOne = winnerGameData[playerNumber][0];
	const botCardTwo = winnerGameData[playerNumber][1];
	const botCardElementOne = document.getElementsByClassName('botCard')[(playerNumber - 2) * 2];
	const botCardElementTwo = document.getElementsByClassName('botCard')[(playerNumber - 1.5) * 2];
	botCardElementOne.style.backgroundImage = `url("cards/${botCardOne}.svg")`;
	botCardElementTwo.style.backgroundImage = `url("cards/${botCardTwo}.svg")`;
	return;
}

function getWinner(gameData) {
	const scoreData = [];
    for (let i = 0; i < playerCount; i++) {
        let spread = aceHighSort(quantify(gameData, i));
        scoreData.push(getHandStrength(spread));
        scoreData[i].playerNumber = i + 1;
    }
    for (let i = 0; i < scoreData.length; i++) {
        for (let z = (i + 1); z < scoreData.length; z++) {
            if (scoreData[i].tier < scoreData[z].tier) {
                let iValue = scoreData[i];
                scoreData[i] = scoreData[z];
                scoreData[z] = iValue;
            }
        }
    }
    const winnerArr = [];
    let len = scoreData.length - 1;
    winnerArr.push(scoreData[len]);
    for (let i = 1; i < scoreData.length; i++) {
        let len = scoreData.length - 1 - i;
        if (scoreData[len].tier == winnerArr[0].tier) {
            winnerArr.push(scoreData[len]);
        } else {
            break;
        }
    }
	const tierObj = {
		1: 'Straight Flush',
		2: 'Four of a Kind',
		3: 'Full House',
		4: 'Flush',
		5: 'Straight',
		6: 'Three of a Kind',
		7: 'Two Pair',
		8: 'Pair',
		9: 'High Card',
	}
	const winnerGameData = {};
	for (let i = 0; i < winnerArr.length; i++) {
		let playerNumber = winnerArr[i].playerNumber;
		winnerGameData[playerNumber] = gameData.hand[playerNumber - 1];
	}
    if (winnerArr.length == 1) {
		let playerNumber = winnerArr[0].playerNumber;
		revealBotCards(playerNumber, winnerGameData);
		stackArr[playerNumber - 1] += potAmount;
        return alert('Player ' + playerNumber + ' wins with a ' + tierObj[winnerArr[0].tier] + '!');
    }
    const winner = tiebreak(gameData.board, winnerGameData, winnerArr);
	if (typeof(winner) == 'object') {
		if (winner.length > 1) {
			for (let i = 0; i < winner.length; i++) {
				revealBotCards(winner[i], winnerGameData);
			}
			return alert('it be a tie lol');
		} else {
			revealBotCards(winner[0], winnerGameData);
			stackArr[winner[0] - 1] += potAmount;
			return alert('Player ' + winner[0] + ' wins with the best ' + tierObj[winnerArr[0].tier] + '!');
		}
	}
	revealBotCards(winner, winnerGameData);
	stackArr[winner - 1] += potAmount;
    return alert('Player ' + winner + ' wins with the best ' + tierObj[winnerArr[0].tier] + '!');
}

function nextDraw() {
	if (didFlop == false) {
		flopData = flop(preFlopBoardData.preFlopDeck);
		drawFlopCards(flopData);
		board.push(flopData.flopArr[0]);
		board.push(flopData.flopArr[1]);
		board.push(flopData.flopArr[2]);
		didFlop = true;
	} else if (didTurn == false) {
		turnData = turn(flopData.preTurnDeck);
		drawTurnCard(turnData);
		board.push(turnData.turnCard);
		didTurn = true;
	} else if (didRiver == false) {
		riverData = river(turnData.preRiverDeck);
		drawRiverCard(riverData);
		board.push(riverData);
		didRiver = true;
	} else {
		const hand = preFlopBoardData.handArr;
		const gameData = {
			hand: hand,
			board: board,
		}
		getWinner(gameData);
		//payout();
		document.getElementById("nextHandButton").style.display = 'block';
	}
	return;
}

function nextPlayerTurn(playerIndex) {
	const nextPlayerIndex = (playerIndex + 1) % playerCount;
	if (nextPlayerIndex == 0) {
		return;
	}
	setTimeout(() => {

	}, 2000);
}

function allDecided() {
	return true;
}

function fold(playerIndex) {
	foldArr[playerIndex] = true;
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function checkCall(playerIndex) {
	let callAmt = 0; //placeholder
	stackArr[playerIndex] = stackArr[playerIndex] - callAmt;
	potAmount += callAmt;
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function playerRaise() {
	raiseAmt = Number(document.getElementById('raiseInput').value);
	let callAmt = 0; //placeholder

	document.getElementById('raiseInput').value = 0;
	if ((raiseAmt + callAmt) > stackArr[0]) {
		return false;
	}
	stackArr[0] = stackArr[0] - raiseAmt - callAmt;
	potAmount += (raiseAmt + callAmt);
	positionCards();
	reDrawCards();
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(0);
	}
}

function botRaise(playerIndex, raiseAmt) {
	let callAmt = 0; //placeholder

	document.getElementById('raiseInput').value = 0;
	if ((raiseAmt + callAmt) > stackArr[playerIndex]) {
		return false;
	}
	stackArr[playerIndex] = stackArr[playerIndex] - raiseAmt - callAmt;
	potAmount += (raiseAmt + callAmt);
	positionCards();
	reDrawCards();
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function nextHand() {
	blindArr[0] = ((blindArr[0] + 1) % playerCount);
	blindArr[1] = ((blindArr[1] + 1) % playerCount);
	if (stackArr[0] < 1) {
		return alert("You've unfortunately gone bankrupt. Refresh the page to try again.");
	}
	document.getElementById("nextHandButton").style.display = "none";
	preFlopBoardData = dealCards(playerCount);
	potAmount = 0;
	didFlop = false, didTurn = false, didRiver = false;
	board = [];
	positionCards();
}