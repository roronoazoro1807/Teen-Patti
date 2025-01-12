const suits = ['♠', '♣', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const valueMap = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};

function getDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealCards(deck, numberOfCards) {
    return deck.splice(0, numberOfCards);
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.suit}`;
    cardDiv.innerHTML = `<span>${card.value}</span><span>${card.suit}</span>`;
    return cardDiv;
}

function evaluateHand(hand) {
    let values = hand.map(card => valueMap[card.value]);
    values.sort((a, b) => a - b);
    const isSequence = (values[1] === values[0] + 1) && (values[2] === values[1] + 1);
    const isSameSuit = hand.every(card => card.suit === hand[0].suit);
    const isThreeOfAKind = values[0] === values[1] && values[1] === values[2];
    const isPair = values[0] === values[1] || values[1] === values[2] || values[0] === values[2];

    if (isThreeOfAKind) return { rank: 4, value: values[0] };
    if (isSequence && isSameSuit) return { rank: 3, value: values[2] };
    if (isSameSuit) return { rank: 2, value: values[2] };
    if (isSequence) return { rank: 1, value: values[2] };
    if (isPair) return { rank: 0.5, value: values[1] };

    return { rank: 0, value: values[2] };
}

function determineWinner(playersHands) {
    let bestHand = { rank: -1, value: -1 };
    let winner = -1;

    playersHands.forEach((hand, index) => {
        const handValue = evaluateHand(hand);
        if (handValue.rank > bestHand.rank || (handValue.rank === bestHand.rank && handValue.value > bestHand.value)) {
            bestHand = handValue;
            winner = index + 1;
        }
    });

    return winner;
}

document.getElementById('deal-button').addEventListener('click', () => {
    const deck = shuffleDeck(getDeck());
    const numberOfPlayers = 4;
    const cardsPerPlayer = 3;
    const playersHands = [];

    for (let i = 1; i <= numberOfPlayers; i++) {
        const playerHand = dealCards(deck, cardsPerPlayer);
        playersHands.push(playerHand);
        const playerHandDiv = document.getElementById(`hand-${i}`);
        playerHandDiv.innerHTML = '';
        playerHand.forEach(card => {
            const cardElement = createCardElement(card);
            playerHandDiv.appendChild(cardElement);
        });
    }

    const winner = determineWinner(playersHands);
    document.getElementById('winner').textContent = `Player ${winner} wins!`;

    // Remove glow from all players
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('glow');
    });

    // Add glow to the winning player
    document.getElementById(`player-${winner}`).classList.add('glow');
});
