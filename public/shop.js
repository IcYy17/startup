const cart = {};


function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const count = Object.values(cart).reduce((total, itemCount) => total + itemCount, 0);
  cartCount.textContent = count;
}

// Function to add an item to the cart
function addToCart(itemName) {
  if (cart[itemName]) {
    cart[itemName]++;
  } else {
    cart[itemName] = 1;
  }
  updateCartCount();
}

// Function to remove an item from the cart
function removeFromCart(itemName) {
  if (cart[itemName] && cart[itemName] > 0) {
    cart[itemName]--;
  }
  updateCartCount();
}

//Event listeners
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const productContainer = button.closest('.product');
    const productName = productContainer.querySelector('p').textContent;
    addToCart(productName);
  });
});

//Event listeners
const removeButtons = document.querySelectorAll('.remove-from-cart');
removeButtons.forEach((button) => {
  button.addEventListener('click', function () {
    const productContainer = button.closest('.product');
    const productName = productContainer.querySelector('p').textContent;
    removeFromCart(productName);
  });
});

// make request to backend api for shoe price and then displaying them on page. 
async function fetchShoePrices() {
  try {
    
    const response = await fetch('/api/shoe-prices');
    const data = await response.json();

    // Display the prices on the webpage
    document.getElementById('shoePrices').innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error fetching shoe prices:', error);
    document.getElementById('shoePrices').innerText = 'Error fetching shoe prices';
  }
}