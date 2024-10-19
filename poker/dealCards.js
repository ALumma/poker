let userInput;
    
// Ask the user for input until it's a valid integer between 2 and 10
do {
    userInput = prompt("Enter number of players (2-10):");

    // Check if the input is an integer and within the range
    if (isNaN(userInput) || !Number.isInteger(Number(userInput))) {
        alert("That is not a valid integer. Please try again.");
    }
    else if (Number(userInput) < 2 || Number(userInput) > 10) {
        alert("The number must be between 2 and 10. Please try again.");
    }

} while (isNaN(userInput) || !Number.isInteger(Number(userInput)) || Number(userInput) < 2 || Number(userInput) > 10);

const playerCount = userInput;

function getShuffledDeck() {
    const deckArr = [
        '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', '11H', '12H', '13H',  // Hearts
        '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', '11S', '12S', '13S',  // Spades
        '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', '11D', '12D', '13D',  // Diamonds
        '1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', '11C', '12C', '13C'   // Clubs
    ];
    const shuffledDeck = [];
    while (deckArr.length > 0) {
        const randomIndex = Math.floor(Math.random() * deckArr.length);
        const randomCard = deckArr.splice(randomIndex, 1)[0];
        shuffledDeck.push(randomCard);
    }
    return shuffledDeck;
}

function dealCards(players) {
    const shuffledDeck = getShuffledDeck();
    const handArr = [];
    for (let i = 0; i < players; i++) {
        handArr.push([]);
        handArr[i].push(shuffledDeck.pop());
    }
    for (let i = 0; i < players; i++) {
        handArr[i].push(shuffledDeck.pop());
    }
    return {
        preFlopDeck: shuffledDeck,
        handArr: handArr,
    };
}

const stackArr = [];
const playerStatusArr = [];
const roundBetArr = [];
for (let i = 0; i < playerCount; i++) {
    stackArr.push(1000);
    playerStatusArr.push(1); //0 for folded, 1 for undecided, 2 for decided
    roundBetArr.push(0);
}
const blindArr = [0, 1]; //little comma big (player indexes);

let preFlopBoardData = dealCards(playerCount);
let potAmount = 0;
let didFlop = false, didTurn = false, didRiver = false;
let flopData, turnData, riverData;
let board = [];
document.getElementById("nextHandButton").style.display = false;