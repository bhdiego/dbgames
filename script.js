const cartContainer = document.querySelector('.cart-container');
const gamesCatalogue = document.querySelector('.games-catalogue');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;

eventListeners();

function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadGames();
        loadCart();
    });

    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show-navbar');
    });

    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    gamesCatalogue.addEventListener('click', purchaseGame);
    cartList.addEventListener('click', deleteGame);
}

// Carga de juegos del archivo .JSON

async function loadGames() {
    let response = await fetch('./json/items.json')
    let gamesJSON = await response.json()
    return gamesJSON
}

let games = loadGames()
games.then( data => {
        data.forEach((game, indice) => {
            gamesCatalogue.innerHTML+= `
                <div class = "game-item" id="game${indice}">
                    <div class = "game-img">
                        <img src="./img/${game.img}" alt ="${game.name}">
                        <button type = "button" class = "add-to-cart-btn">
                            <i class = "fa-solid fa-cart-shopping"></i>Añadir al carrito
                        </button>
                    </div>
                    <div class = "game-content">
                        <h3 class = "game-name">${game.name}</h3>
                        <span class = "game-genre">${game.genre}</span>
                        <p class = "game-price">$${game.price}</p>
                    </div>
                </div>
            `
        })
    });

// Añadir juego al carrito

function addToCartList(game){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${game.id}`);
    cartItem.innerHTML = `
        <img src="${game.img}" alt ="${game.name}">
        <div class="cart-item-info">
            <h3 class="cart-item-name">${game.name}</h3>
            <span class="cart-item-genre">${game.genre}</span>
            <span class="cart-item-price">${game.price}</span>
        </div>
        <button type="button" class="cart-item-del-btn">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

function purchaseGame(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let game = e.target.closest('.game-item');
        getGameInfo(game);
    }
}

// Actualizar carrito

function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.gameCount;
    cartTotalValue.textContent = cartInfo.total;
}

// Info al agregar al carrito

function getGameInfo(game){
    let gameInfo = {
        id: cartItemID,
        img: game.querySelector('.game-img img').src,
        name: game.querySelector('.game-name').textContent,
        genre: game.querySelector('.game-genre').textContent,
        price: game.querySelector('.game-price').textContent
    }
    cartItemID++;
    addToCartList(gameInfo);
    saveGameInStorage(gameInfo);
}

// Guardando en Local Storage

function saveGameInStorage(item){
    let games = getGameFromStorage();
    games.push(item);
    localStorage.setItem('games', JSON.stringify(games));
    updateCartInfo();
}

function getGameFromStorage(){
    return localStorage.getItem('games') ? JSON.parse(localStorage.getItem('games')) : [];
}

// Carga de juegos en el carrito

function loadCart(){
    let games = getGameFromStorage();
    games.length < 1 ? (cartItemID = 1) : (cartItemID = games[games.length - 1].id, cartItemID++);
    games.forEach(game => addToCartList(game));
    updateCartInfo();
}

// Calcular total

function findCartInfo(){
    let games = getGameFromStorage();
    let total = games.reduce((acc, game) => {
        let price = parseFloat(game.price.substr(1));
        return acc += price;
    }, 0);

    return{
        total: total.toFixed(2),
        gameCount: games.length
    }
}

// Borrar juego del carrito y del Local Storage

function deleteGame(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove();
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove();
    }

    let games = getGameFromStorage();
    let updatedGames = games.filter(game => {
        return game.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('games', JSON.stringify(updatedGames));
    updateCartInfo();
}