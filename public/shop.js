// const cart = {};


// function updateCartCount() {
//   const cartCount = document.getElementById('cart-count');
//   const count = Object.values(cart).reduce((total, itemCount) => total + itemCount, 0);
//   cartCount.textContent = count;
// }

// // Function to add an item to the cart
// function addToCart(itemName) {
//   if (cart[itemName]) {
//     cart[itemName]++;
//   } else {
//     cart[itemName] = 1;
//   }
//   updateCartCount();
// }

// // Function to remove an item from the cart
// function removeFromCart(itemName) {
//   if (cart[itemName] && cart[itemName] > 0) {
//     cart[itemName]--;
//   }
//   updateCartCount();
// }

// //Event listeners
// const addToCartButtons = document.querySelectorAll('.add-to-cart');
// addToCartButtons.forEach((button) => {
//   button.addEventListener('click', function () {
//     const productContainer = button.closest('.product');
//     const productName = productContainer.querySelector('p').textContent;
//     addToCart(productName);
//   });
// });

// //Event listeners
// const removeButtons = document.querySelectorAll('.remove-from-cart');
// removeButtons.forEach((button) => {
//   button.addEventListener('click', function () {
//     const productContainer = button.closest('.product');
//     const productName = productContainer.querySelector('p').textContent;
//     removeFromCart(productName);
//   });
// });

// // make request to backend api for shoe price and then displaying them on page. 
// async function fetchShoePrices() {
//   try {
    
//     const response = await fetch('/api/shoe-prices');
//     const data = await response.json();

//     // Display the prices on the webpage
//     document.getElementById('shoePrices').innerText = JSON.stringify(data, null, 2);
//   } catch (error) {
//     console.error('Error fetching shoe prices:', error);
//     document.getElementById('shoePrices').innerText = 'Error fetching shoe prices';
//   }
// }
const cart = {};

// Initialize WebSocket
let socket;
function initializeWebSocket() {
  const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
  socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.action === 'add') {
      displayCartNotification(msg.item);
    }
  };
}

// Function to broadcast cart events
function broadcastCartEvent(item, action) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const event = {
      item: item,
      action: action
    };
    socket.send(JSON.stringify(event));
  }
}

function displayCartNotification(item) {
  const notificationArea = document.querySelector('#cart-notifications');
  const message = `Congrats on adding shoes to your cart! Check out before they are gone!`;
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = message;
  notificationArea.prepend(notification);
  // 3sec timeout
  setTimeout(() => {
    notification.remove();
  }, 3000); 
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const count = Object.values(cart).reduce((total, itemCount) => total + itemCount, 0);
  cartCount.textContent = count;
}

// Modified addToCart to include WebSocket notification simulation
function addToCart(itemName) {
  if (cart[itemName]) {
    cart[itemName]++;
  } else {
    cart[itemName] = 1;
  }
  updateCartCount();
  displayCartNotification(itemName); // Simulate WebSocket notification
}

// Existing removeFromCart function
function removeFromCart(itemName) {
  if (cart[itemName] && cart[itemName] > 0) {
    cart[itemName]--;
    updateCartCount();
  }
}

// Event listeners for adding to cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const productContainer = button.closest('.product');
    const productName = productContainer.querySelector('p').textContent;
    addToCart(productName);
  });
});

// Event listeners for removing from cart
const removeButtons = document.querySelectorAll('.remove-from-cart');
removeButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const productContainer = button.closest('.product');
    const productName = productContainer.querySelector('p').textContent;
    removeFromCart(productName);
  });
});

// Function to fetch and display shoe prices
async function fetchShoePrices() {
  try {
    const response = await fetch('/api/shoe-prices');
    const data = await response.json();
    document.getElementById('shoePrices').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error fetching shoe prices:', error);
    document.getElementById('shoePrices').innerText = 'Error fetching shoe prices';
  }
}

// Initialize WebSocket connection when the page loads
initializeWebSocket();


