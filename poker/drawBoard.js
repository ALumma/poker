const numCardPairs = playerCount; // Change this to the number of card pairs you want
const container = document.getElementById('circle-container');
const botCardOffset = 50; // Offset between the two cards in each pair
const verticalShift = -30; // Shift the entire circle upwards (negative value for upwards)

function positionCards() {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Adjust the radius for an oval shape by scaling x and y differently
  const radiusX = containerWidth / 2 * 0.9; // Horizontally scaled (80% of half the container's width)
  const radiusY = containerHeight / 2 * 0.8; // Vertically scaled (60% of half the container's height)
  
  const playerTypeClass = 'botCard';
  
  // Clear existing cards
  container.innerHTML = '';

  for (let i = 1; i < numCardPairs; i++) {
    const angle = (i / numCardPairs) * 2 * Math.PI + Math.PI / 2; // Shift by π/2 radians (90 degrees)

    // Adjust x and y coordinates to create an oval shape
    const x = (Math.cos(angle) * radiusX) - 30;
    const y = Math.sin(angle) * radiusY + verticalShift; // Apply vertical shift

    // Create a wrapper for the card pair and stack display
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper'); // Optional class for styling the wrapper
    cardWrapper.style.position = 'absolute'; // Use absolute positioning within the container

    // Create the first card
    const firstCard = document.createElement('div');
    firstCard.classList.add(playerTypeClass);
    firstCard.style.backgroundImage = 'url("cards/card_back.svg")'; // Bot card
    let firstCardX = x + containerWidth / 2 - botCardOffset / 2;
    let firstCardY = y + containerHeight / 2;
    firstCard.style.transform = `translate(${firstCardX}px, ${firstCardY}px)`; // Bot card position
    cardWrapper.appendChild(firstCard);

    // Create the second card
    const secondCard = document.createElement('div');
    secondCard.classList.add(playerTypeClass);
    secondCard.style.backgroundImage = 'url("cards/card_back.svg")'; // Bot card
    let secondCardX = x + containerWidth / 2 + botCardOffset / 2;
    let secondCardY = y + containerHeight / 2;
    secondCard.style.transform = `translate(${secondCardX}px, ${secondCardY}px)`; // Bot card position
    cardWrapper.appendChild(secondCard);
    
    // Display player stack
    let playerStack = stackArr[i]; // Assuming stackArr contains the player stacks
    const stackDisplay = document.createElement('div');
    stackDisplay.textContent = '$' + playerStack;
    stackDisplay.style.fontSize = '24px'; // Set the font size to 24px
    let stackDisplayX = (firstCardX + secondCardX) / 2;
    let stackDisplayY = ((firstCardY + secondCardY) / 2) + 80; // Position below the cards
    stackDisplay.style.transform = `translate(${stackDisplayX}px, ${stackDisplayY}px)`;
    stackDisplay.classList.add('stackDisplay'); // Optional class for styling
    cardWrapper.appendChild(stackDisplay); // Append stack display to the wrapper
    
    //Fix Call button
		let callAmt = getCallAmt(0);
		if (callAmt !== 0) {
			document.getElementById('checkCallButton').textContent = `Call ($${callAmt})`
		} else {
			document.getElementById('checkCallButton').textContent = "Check"
		}
    document.getElementById('raiseButton').textContent = `Raise (Min $${minimumRaise})`;

    // Display player number
    let botNumberLabel = i + 1; // Assuming stackArr contains the player stacks
    const botNumberDisplay = document.createElement('div');
    if (blindArr[0] == botNumberLabel - 1) {
      botNumberDisplay.textContent = 'Player ' + botNumberLabel + ' (Little Blind)';
    } else if (blindArr[1] == botNumberLabel - 1) {
      botNumberDisplay.textContent = 'Player ' + botNumberLabel + ' (Big Blind)';
    } else {
      botNumberDisplay.textContent = 'Player ' + botNumberLabel;
    }
    botNumberDisplay.style.fontSize = '24px'; // Set the font size to 24px
    let botNumberDisplayX = ((firstCardX + secondCardX) / 2) - 10;
    let botNumberDisplayY = ((firstCardY + secondCardY) / 2) - 60; // Position below the cards
    botNumberDisplay.style.transform = `translate(${botNumberDisplayX}px, ${botNumberDisplayY}px)`;
    botNumberDisplay.classList.add('botNumberDisplay'); // Optional class for styling
    cardWrapper.appendChild(botNumberDisplay); // Append stack display to the wrapper
    // Append the wrapper to the main container
    container.appendChild(cardWrapper);
  }

  // Update player's cards
  const playerNumberDisplay = document.getElementById('playerNumberDisplay');
  if (blindArr[0] == 0) {
    playerNumberDisplay.textContent = 'Player 1 (You) (Little Blind)';
  } else if (blindArr[1] == 0) {
    playerNumberDisplay.textContent = 'Player 1 (You) (Big Blind)';
  } else {
    playerNumberDisplay.textContent = 'Player 1 (You)';;
  }
  playerNumberDisplay.style = 'transform: translate(0px, -260px);';
  playerNumberDisplay.style.fontSize = '24px';
  
  const playerCardOne = preFlopBoardData.handArr[0][0];
  document.getElementsByClassName('playerCard')[0].style = `background-image: url('cards/${playerCardOne}.svg'); transform: translate(0px, -50px);`;
  const playerCardTwo = preFlopBoardData.handArr[0][1];
  document.getElementsByClassName('playerCard')[1].style = `background-image: url('cards/${playerCardTwo}.svg'); transform: translate(0px, -50px);`;
  
  const playerStackDisplay = document.getElementById('playerStackDisplay');
  playerStackDisplay.textContent = '$' + stackArr[0];
  playerStackDisplay.style = 'transform: translate(0px, -70px);';
  playerStackDisplay.style.fontSize = '24px';
  // Update deck card
  document.getElementById('deck').style = `background-image: url('cards/card_back.svg'); transform: translate(-330px, -65px);`;

  // Update pot display
  const potDisplay = document.getElementById('potDisplay');
  potDisplay.textContent = 'Main Pot: $' + potAmount;
  const potY = containerHeight - 120;
  potDisplay.style = `transform: translate(0px, -${potY}px);`;
  potDisplay.style.fontSize = '24px';
}

positionCards(); // Initial positioning

// Reposition cards on window resize
window.addEventListener('resize', positionCards);
