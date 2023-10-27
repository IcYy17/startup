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