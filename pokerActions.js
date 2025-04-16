function updateButtonStatus(isEnabled) {
	document.getElementById("foldButton").disabled = !isEnabled;
    document.getElementById("checkCallButton").disabled = !isEnabled;
    document.getElementById("raiseInput").disabled = !isEnabled;
    document.getElementById("raiseButton").disabled = !isEnabled;
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
	if (tier == 1) {
		let winningPlayer = winnerArr[0].playerNumber;
		let currentHighCard = winnerArr[0].highCard;
		for (let i = 1; i < winnerArr.length; i++) {
			if (((currentHighCard !== 1) && (winnerArr[i].highCard > currentHighCard)) || (winnerArr[i].highCard == 1)) {
				currentHighCard = winnerArr[i].highCard;
				winningPlayer = winnerArr[i].playerNumber;
			}
		}
		return winningPlayer;
	} else if (tier == 2) {
		let firstCutPlayerArr = [];
		firstCutPlayerArr.push(winnerArr[0]);
		let currentHighCard = winnerArr[0].highCard;
		for (let i = 1; i < winnerArr.length; i++) {
            if (currentHighCard == winnerArr[i].highCard) {
                firstCutPlayerArr.push(winnerArr[i]);
            } else if (((currentHighCard !== 1) && (winnerArr[i].highCard > currentHighCard)) || (winnerArr[i].highCard == 1)) {
				currentHighCard = winnerArr[i].highCard;
				firstCutPlayerArr = [];
				firstCutPlayerArr.push(winnerArr[i]);
			}
		}
		if (firstCutPlayerArr.length == 1) {
			return firstCutPlayerArr[0].playerNumber;
		};
		let winningPlayerArr = [];
		winningPlayerArr.push(firstCutPlayerArr[0].playerNumber);
		currentHighCard = firstCutPlayerArr[0].kicker;
		for (let i = 1; i < winnerArr.length; i++) {
            if (currentHighCard == firstCutPlayerArr[i].kicker) {
                winningPlayerArr.push(firstCutPlayerArr[i].playerNumber)
            } else if (((currentHighCard !== 1) && (firstCutPlayerArr[i].kicker > currentHighCard)) || (firstCutPlayerArr[i].kicker == 1)) {
				currentHighCard = firstCutPlayerArr[i].kicker;
				winningPlayerArr = [];
				winningPlayerArr = firstCutPlayerArr[i].playerNumber;
			}
		}
		return winningPlayerArr;
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

function getWinner(gameData, singleWinningPlayerIndex = false) {
	updateButtonStatus(false);
	if (typeof(singleWinningPlayerIndex) == 'number') {
		stackArr[singleWinningPlayerIndex] += potAmount;
		document.getElementById("nextHandButton").style.display = 'block';
        return alert('Player ' + (singleWinningPlayerIndex + 1) + ' wins!');
	}
	const scoreData = [];
    for (let i = 0; i < playerCount; i++) {
		if (playerStatusArr[i] !== 0) {
			let spread = aceHighSort(quantify(gameData, i));
			scoreData.push(getHandStrength(spread));
			scoreData[scoreData.length - 1].playerNumber = i + 1;
		}
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
		document.getElementById("nextHandButton").style.display = 'block';
        return alert('Player ' + playerNumber + ' wins with a ' + tierObj[winnerArr[0].tier] + '!');
    }
    const winner = tiebreak(gameData.board, winnerGameData, winnerArr);
	if (typeof(winner) == 'object') {
		if (winner.length > 1) {
			let splitAmt = Math.floor(potAmount / winner.length);
			for (let i = 0; i < winner.length; i++) {
				revealBotCards(winner[i], winnerGameData);
				stackArr[winner[i] - 1] += splitAmt;
			}
			document.getElementById("nextHandButton").style.display = 'block';
			return alert(`Players ${winner.join(', ')} split the pot!`);
		} else {
			revealBotCards(winner[0], winnerGameData);
			stackArr[winner[0] - 1] += potAmount;
			document.getElementById("nextHandButton").style.display = 'block';
			return alert('Player ' + winner[0] + ' wins with the best ' + tierObj[winnerArr[0].tier] + '!');
		}
	}
	revealBotCards(winner, winnerGameData);
	stackArr[winner - 1] += potAmount;
	document.getElementById("nextHandButton").style.display = 'block';
    return alert('Player ' + winner + ' wins with the best ' + tierObj[winnerArr[0].tier] + '!');
}

function distributeSidePots(gameData, singleWinningPlayerIndex = false) {
	if (sidePotArr.length == 0) {
		return;
	}
	updateButtonStatus(false);
	if (typeof(singleWinningPlayerIndex) == 'number') {
		for (let i = 0; i < sidePotArr.length; i++)  {
			let len = sidePotArr.length - 1 - i;
			if (sidePotArr[len].elegiblePlayers.includes(singleWinningPlayerIndex)) {
				stackArr[singleWinningPlayerIndex] += potAmount;
				alert('Player ' + (singleWinningPlayerIndex + 1) + ` wins a side pot of ${sidePotArr[i].amount}!`);
			}
		}
		return;
	}
	for (let i = 0; i < sidePotArr.length; i++) {
		const scoreData = [];
		for (let z = 0; z < playerCount; z++) {
			if ((playerStatusArr[z] !== 0) && (sidePotArr[i].elegiblePlayers.includes(z))) {
				let spread = aceHighSort(quantify(gameData, z));
				scoreData.push(getHandStrength(spread));
				scoreData[scoreData.length - 1].playerNumber = z + 1;
			}
		}
		for (let j = 0; j < scoreData.length; j++) {
			for (let z = (j + 1); z < scoreData.length; z++) {
				if (scoreData[j].tier < scoreData[z].tier) {
					let jValue = scoreData[j];
					scoreData[j] = scoreData[z];
					scoreData[z] = jValue;
				}
			}
		}
		const winnerArr = [];
		let len = scoreData.length - 1;
		winnerArr.push(scoreData[len]);
		for (let z = 1; z < scoreData.length; z++) {
			let len = scoreData.length - 1 - z;
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
		for (let z = 0; z < winnerArr.length; z++) {
			let playerNumber = winnerArr[z].playerNumber;
			winnerGameData[playerNumber] = gameData.hand[playerNumber - 1];
		}
		if (winnerArr.length == 1) {
			let playerNumber = winnerArr[0].playerNumber;
			revealBotCards(playerNumber, winnerGameData);
			stackArr[playerNumber - 1] += sidePotArr[i].amount;
			alert('Player ' + playerNumber + ` wins the side pot of ${sidePotArr[i].amount} with a ` + tierObj[winnerArr[0].tier] + '!');
			continue;
		}
		const winner = tiebreak(gameData.board, winnerGameData, winnerArr);
		if (typeof(winner) == 'object') {
			if (winner.length > 1) {
				let splitAmt = Math.floor(sidePotArr[i].amount / winner.length);
				for (let z = 0; z < winner.length; z++) {
					revealBotCards(winner[z], winnerGameData);
					stackArr[winner[z] - 1] += splitAmt;
				}
				alert(`Players ${winner.join(', ')} split the side pot of $${sidePotArr[i].amount}`);
				continue;
			} else {
				revealBotCards(winner[0], winnerGameData);
				stackArr[winner[0] - 1] += sidePotArr[i].amount;
				alert('Player ' + winner[0] + ` wins the side pot of $${sidePotArr[i].amount} with the best ` + tierObj[winnerArr[0].tier] + '!');
				continue;
			}
		}
		revealBotCards(winner, winnerGameData);
		stackArr[winner - 1] += sidePotArr[i].amount;
		alert('Player ' + winner + ` wins the side pot of ${sidePotArr[i].amount} with the best ` + tierObj[winnerArr[0].tier] + '!');
	}
}

function nextDraw() {
	if (didFlop == false) {
		flopData = flop(preFlopBoardData.preFlopDeck);
		drawFlopCards(flopData);
		board.push(flopData.flopArr[0]);
		board.push(flopData.flopArr[1]);
		board.push(flopData.flopArr[2]);
		didFlop = true;
		let player = blindArr[0]
		return nextPlayerTurn(player - 1);
	} else if (didTurn == false) {
		turnData = turn(flopData.preTurnDeck);
		drawTurnCard(turnData);
		board.push(turnData.turnCard);
		didTurn = true;
		let player = blindArr[0]
		return nextPlayerTurn(player - 1);
	} else if (didRiver == false) {
		riverData = river(turnData.preRiverDeck);
		drawRiverCard(riverData);
		board.push(riverData);
		didRiver = true;
		let player = blindArr[0]
		return nextPlayerTurn(player - 1);
	} else {
		const hand = preFlopBoardData.handArr;
		const gameData = {
			hand: hand,
			board: board,
		}
		distributeSidePots(gameData);
		getWinner(gameData);
		document.getElementById("nextHandButton").style.display = 'block';
	}
	return;
}

function getBotDecision(botPlayerIndex) {
	if (stackArr[botPlayerIndex] == 0) {
		return 1;
	}
	function getRaiseAmt() {
		const botChips = stackArr[botPlayerIndex];
		const randomNumber = Math.random() * (1.2 - 0.8) + 0.8;
		const raiseAmt = Math.floor(botChips * .1 * randomNumber);
		return raiseAmt;
	}
    let potSize = potAmount;
	for (let i = 0; i < sidePotArr.length; i++) {
		if (sidePotArr[i].elegiblePlayers.includes(botPlayerIndex)) {
			potSize += sidePotArr[i].amount;
		}
	}
	const botChips = stackArr[botPlayerIndex];
	const currentBet = getCallAmt(botPlayerIndex);
	const handStrength = Math.random();
	if (handStrength > 0.85) {
		if (currentBet >= botChips) {
			return 1;
		}
		let raiseAmount = getRaiseAmt();
        return {decision: 2, raiseAmt: raiseAmount}; // for raise;
    } else if (handStrength > 0.1) {
        // Decent hand: call or raise
        if (potSize > 100) {
            return 1; // for call
        } else {
			let raiseAmount = getRaiseAmt();
            return {decision: 2, raiseAmt: raiseAmount}; // for raise
        }
    } else {
        // Weak hand: fold or call small bet
        if (currentBet > botChips * 0.1) {
            return 0; // for fold
        } else {
            return 1; // for call;
        }
    }
}

function nextPlayerTurn(playerIndex) {
	const nextPlayerIndex = (playerIndex + 1) % playerCount;
	updateButtonStatus(false);
	if (nextPlayerIndex == 0) {
		if (playerStatusArr[0] == 0) { // check if The Player folded
			return nextPlayerTurn(nextPlayerIndex);
		}
		//console.log(`It's ${nextPlayerIndex + 1}'s turn`);
		return updateButtonStatus(true);
	} else {
		if (playerStatusArr[nextPlayerIndex] == 0) { // check if the bot folded
			return nextPlayerTurn(nextPlayerIndex);
		}
	}
	setTimeout(() => {
		//console.log(`It's ${nextPlayerIndex + 1}'s turn`);
		const botDecision = getBotDecision(nextPlayerIndex);
		if (botDecision == 0) {
			return fold(nextPlayerIndex);
		} else if (botDecision == 1) {
			return checkCall(nextPlayerIndex);
		} else if (botDecision.decision == 2) {
			return botRaise(nextPlayerIndex, botDecision.raiseAmt);
		}
	}, 2000);
}

function apportionPots() {
	function shouldCreateSidePot() {
		const betAmounts = [];
		for (let i = 0; i < roundBetArr.length; i++) {
			if ((((roundBetArr[i] !== 0) && (stackArr[i] == 0)) || (playerStatusArr[i] !== 0)) && roundBetArr[i] !== null) {
				betAmounts.push(roundBetArr[i]);
			}
		}
		// Find unique non-zero numbers
		const uniqueBets = [...new Set(betAmounts)];
		if (uniqueBets.length > 1) {
			return true;
		}
		return false;
	}
	if (shouldCreateSidePot()) {
		const betAmounts = [];
		for (let i = 0; i < roundBetArr.length; i++) {
			if ((((roundBetArr[i] !== 0) || (playerStatusArr[i] !== 0)) && (roundBetArr[i] !== null))) {
				betAmounts.push(roundBetArr[i]);
			}
		}
		const sortedBets = [...new Set(betAmounts)].sort((a, b) => a - b);
		const smallestBet = sortedBets[0];
		const secondSmallestBet = sortedBets[1];
		const sidePotObj = {};
		let sidePotAmt = 0;
		let sidePotPlayerArr = [];
		for (let i = 0; i < roundBetArr.length; i++) {
			if ((roundBetArr[i] !== 0) && (roundBetArr[i] !== null)) {
				roundBetArr[i] -= smallestBet;
			}
			if ((roundBetArr[i] == 0) && (playerStatusArr[i] !== 0)) {
				roundBetArr[i] = null;
			}
		}
		for (let i = 0; i < roundBetArr.length; i++) {
			if ((roundBetArr[i] !== 0) && (roundBetArr[i] !== null)) {
				potAmount = potAmount - (secondSmallestBet - smallestBet);
				sidePotAmt += (secondSmallestBet - smallestBet);
				if (playerStatusArr[i] !== 0) {
					sidePotPlayerArr.push(i);
				}
			}
		}
		sidePotObj.amount = sidePotAmt;
		sidePotObj.elegiblePlayers = sidePotPlayerArr;
		sidePotArr.push(sidePotObj);
		apportionPots();
	}
	positionCards();
	reDrawCards();
	return;
}

function allDecided() {
	for (let i = 0; i < playerStatusArr.length; i++) {
		if (playerStatusArr[i] == 1) {
			return false;
		}
	}
	apportionPots();
	for (let i = 0; i < playerStatusArr.length; i++) {
		if (playerStatusArr[i] !== 0) {
			playerStatusArr[i] = 1;
		}
	}
	for (let i = 0; i < roundBetArr.length; i++) {
		roundBetArr[i] = 0;
	}
	minimumRaise = BBAmt;
	updateButtonStatus(true);
	positionCards();
	reDrawCards();
	return true;
}

function fold(playerIndex) {
	playerStatusArr[playerIndex] = 0;
	if (playerIndex !== 0) {
		document.getElementsByClassName("stackDisplay")[playerIndex - 1].textContent += " * Fold";
	}
	for (let i = 0; i < sidePotArr.length; i++) {
		sidePotArr[i].elegiblePlayers = sidePotArr[i].elegiblePlayers.filter(num => num !== playerIndex);
	}
	const nonZeroElements = playerStatusArr.filter(num => num !== 0);
	if (nonZeroElements.length == 1) { // check if everyone else folded
		let singleIndex = playerStatusArr.indexOf(nonZeroElements[0]);
		const hand = preFlopBoardData.handArr;
		const gameData = {
			hand: hand,
			board: board,
		}
		distributeSidePots(gameData, singleIndex);
		return getWinner(gameData, singleIndex);
	}
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function checkCall(playerIndex) {
	let callAmt = getCallAmt(playerIndex);
	if (stackArr[playerIndex] < callAmt) {
		createSidePot = true;
		callAmt = stackArr[playerIndex];
	}
	stackArr[playerIndex] = stackArr[playerIndex] - callAmt;
	potAmount += callAmt;
	playerStatusArr[playerIndex] = 2;
	roundBetArr[playerIndex] = roundBetArr[playerIndex] + callAmt;
	positionCards();
	reDrawCards();
	if (playerIndex !== 0) {
		if (callAmt == 0) {
			document.getElementsByClassName("stackDisplay")[playerIndex - 1].textContent += " * Check";
		} else {
			document.getElementsByClassName("stackDisplay")[playerIndex - 1].textContent += " * Call";
		}
	}
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function playerRaise() {
	let raiseAmt = Number(document.getElementById('raiseInput').value);
	let playerContribution = roundBetArr[0];
	let maxOtherContribution = Math.max(...roundBetArr.slice(1)); // Get the max of the array excluding the first element
	let callAmt = maxOtherContribution - playerContribution;
	if (callAmt < 0) {
		callAmt = 0;
	}
	document.getElementById('raiseInput').value = 0;
	if ((raiseAmt + callAmt) > stackArr[0]) {
		return alert('Insufficent funds');
	}
	if ((raiseAmt !== stackArr[0]) && (raiseAmt < minimumRaise)) {
		return alert(`Raise must be at least $${minimumRaise}`)
	}
	if (minimumRaise < raiseAmt) {
		minimumRaise = raiseAmt;
	}
	stackArr[0] = stackArr[0] - raiseAmt - callAmt;
	potAmount += (raiseAmt + callAmt);
	for (let i = 0; i < playerStatusArr.length; i++) {
		if (playerStatusArr[i] !== 0) {
			playerStatusArr[i] = 1;
		}
	}
	playerStatusArr[0] = 2;
	roundBetArr[0] = roundBetArr[0] + raiseAmt + callAmt;
	positionCards();
	reDrawCards();
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(0);
	}
}

function botRaise(playerIndex, raiseAmt) {
	let callAmt = getCallAmt(playerIndex);
	document.getElementById('raiseInput').value = 0;
	if ((raiseAmt + callAmt) > stackArr[playerIndex]) {
		return false;
	}
	if (minimumRaise < raiseAmt) {
		minimumRaise = raiseAmt;
	}
	stackArr[playerIndex] = stackArr[playerIndex] - raiseAmt - callAmt;
	potAmount += (raiseAmt + callAmt);
	for (let i = 0; i < playerStatusArr.length; i++) {
		if (playerStatusArr[i] !== 0) {
			playerStatusArr[i] = 1;
		}
	}
	playerStatusArr[playerIndex] = 2;
	roundBetArr[playerIndex] = roundBetArr[playerIndex] + raiseAmt + callAmt;
	positionCards();
	reDrawCards();
	document.getElementsByClassName("stackDisplay")[playerIndex - 1].textContent += ` * Raise $${raiseAmt}`;
	if (allDecided() == true) {
		return nextDraw();
	} else {
		return nextPlayerTurn(playerIndex);
	}
}

function getCallAmt(playerIndex) {
	let botContribution = roundBetArr[playerIndex]; // The number at the variable index
	let otherContributions = [...roundBetArr.slice(0, playerIndex), ...roundBetArr.slice(playerIndex + 1)]; // Exclude the chosen index
	let maxOtherContribution = Math.max(...otherContributions); // Get the max from the remaining numbers
	let callAmt = maxOtherContribution - botContribution;
	if (callAmt <= 0) {
		callAmt = 0;
	} else if ((callAmt < BBAmt) && (maxOtherContribution < BBAmt)) {
		callAmt = BBAmt;
	}
	return callAmt;
}

function nextHand() {
	blindArr[0] = ((blindArr[0] + 1) % playerCount);
	blindArr[1] = ((blindArr[1] + 1) % playerCount);
	if (stackArr[0] < 1) {
		return alert("You've unfortunately gone bankrupt. Refresh the page to try again.");
	}
	for (let i = 1; i < stackArr.length; i++) {
		if (stackArr[i] == 0) {
			alert(`Player ${i + 1} has gone bankrupt, and a new player has filled their seat.`);
			let sumStackArr = stackArr.reduce((sum, num, p) => p !== i ? sum + num : sum, 0);
			let averageExcludingIndex = Math.floor(sumStackArr / (stackArr.length - 1));
			stackArr[i] = averageExcludingIndex;
		}
	}
	document.getElementById("nextHandButton").style.display = "none";
	updateButtonStatus(true);
	preFlopBoardData = dealCards(playerCount);
	minimumRaise = BBAmt;
	potAmount = 0;
	didFlop = false, didTurn = false, didRiver = false;
	for (let i = 0; i < playerStatusArr.length; i++) {
		playerStatusArr[i] = 1;
	}
	for (let i = 0; i < roundBetArr.length; i++) {
		roundBetArr[i] = 0;
	}
	sidePotArr = [];
	board = [];
	let LBplayerIndex = blindArr[0];
	let LBBetAmt = 0;
	if (stackArr[LBplayerIndex] < LBAmt) {
		LBBetAmt = stackArr[LBplayerIndex];
	} else {
		LBBetAmt = LBAmt;
	}
	stackArr[LBplayerIndex] = stackArr[LBplayerIndex] - LBBetAmt;
	potAmount += LBBetAmt;
	roundBetArr[LBplayerIndex] = roundBetArr[LBplayerIndex] + LBBetAmt;
	let BBplayerIndex = blindArr[1];
	let BBBetAmt = 0;
	if (stackArr[BBplayerIndex] < BBAmt) {
		BBBetAmt = stackArr[BBplayerIndex];
	} else {
		BBBetAmt = BBAmt;
	}
	stackArr[BBplayerIndex] = stackArr[BBplayerIndex] - BBBetAmt;
	potAmount += BBBetAmt;
	roundBetArr[BBplayerIndex] = roundBetArr[BBplayerIndex] + BBBetAmt;
	playerStatusArr[blindArr[1]] = 2;
	positionCards();
	return nextPlayerTurn(blindArr[1]);
}