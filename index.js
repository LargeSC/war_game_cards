let deckId
let computerPts =0
let playerPts = 0

const drawCardsBtn = document.getElementById("draw-cards")
const messageEl = document.getElementById("message")
const finalMessageEl = document.getElementById("final-message")
const remainingCards = document.getElementById("remaining-cards")
const computerPtsEl = document.getElementById("computer-pts")
const playerPtsEl = document.getElementById("player-pts")
const overlay = document.getElementById("overlay")
const cardsDiv = document.getElementById("cards")

drawCardsBtn.disabled= true


async function getNewDeck() {
    const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await res.json()
        
    deckId = data.deck_id
    drawCardsBtn.disabled= false
    remainingCards.textContent = `${data.remaining} Cards Remaining`
}

document.getElementById("new-deck").addEventListener("click", getNewDeck)

drawCardsBtn.addEventListener("click", async () => {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
        
    cardsDiv.innerHTML = `
        <img class="card" src=${data.cards[0].image} />
        <img class="card" src=${data.cards[1].image} />
    `
    remainingCards.textContent = `${data.remaining} Cards Remaining`
    messageEl.textContent = compareCards(data.cards[0],data.cards[1])
    computerPtsEl.innerHTML = `Computer: <strong>${computerPts}</strong>`
    playerPtsEl.innerHTML = `Me: <strong>${playerPts}</strong>`
    
    if(data.remaining===0){
        drawCardsBtn.disabled = true
        setWinner()
    }
})

document.getElementById("reset-btn").addEventListener("click",resetGame)


function compareCards(card2,card1){
    const order = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    if(order.indexOf(card1.value)>order.indexOf(card2.value)){
        playerPts++
        cardsDiv.children[1].style= "transform:scale(1.2)"
        playerPtsEl.style = "transform:scale(1.2)"
        computerPtsEl.style = "transform:scale(1)"
        return "I won"
    } else if(order.indexOf(card1.value)===order.indexOf(card2.value)){
        return "War!"
    } else {
        computerPts++
        cardsDiv.children[0].style= "transform:scale(1.2)"
        computerPtsEl.style = "transform:scale(1.2)"
        playerPtsEl.style = "transform:scale(1)"
        return "Computer won"
    }
}


function setWinner(){
    let finalMessage = ""
    if(playerPts>computerPts){
        finalMessage = "You won the game!"
    } else if (playerPts === computerPts){
        finalMessage = "It's a tie!"
    } else {
        finalMessage = "The computer won the game"
    }
    overlay.style.display="block"
    finalMessageEl.innerHTML = finalMessage

}

function resetGame(){
    overlay.style.display="none"
    computerPts = 0
    playerPts = 0
    messageEl.textContent = "Game of War!"
    computerPtsEl.textContent = "Computer:"
    playerPtsEl.textContent = "Me:"
    document.getElementById("cards").innerHTML =
    `<div class="card card-placeholder"></div>
    <div class="card card-placeholder"></div>`
    getNewDeck()
}

