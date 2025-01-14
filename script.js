let cart = [];
let total = 0;
let deliveryFee = 2.00;

function addToCart(item, price) {
    const quantity = parseInt(document.querySelector(`[data-item="${item}"]`).value) || 1;
    for(let i = 0; i < quantity; i++) {
        cart.push({
            item, price
        });
    }
    total += price * quantity;
    updateCart();
    updateCartIcon();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    
    // Group items by name and count quantities
    const groupedItems = cart.reduce((acc, curr) => {
        acc[curr.item] = acc[curr.item] || { count: 0, price: curr.price };
        acc[curr.item].count++;
        return acc;
    }, {});
    
    // Display grouped items
    Object.entries(groupedItems).forEach(([itemName, details]) => {
        const li = document.createElement('li');
        li.textContent = `${itemName} x${details.count} - R$ ${(details.price * details.count).toFixed(2)}`;
        cartItems.appendChild(li);
    });

    const deliveryMethod = document.getElementById('deliveryMethod')?.value;
    const deliveryFeeAmount = (deliveryMethod === 'delivery') ? deliveryFee : 0;
    const totalWithDelivery = total + deliveryFeeAmount;
    
    if (deliveryFeeAmount > 0) {
        const deliveryFeeLi = document.createElement('li');
        deliveryFeeLi.textContent = `Taxa de entrega - R$ ${deliveryFeeAmount.toFixed(2)}`;
        cartItems.appendChild(deliveryFeeLi);
    }
    
    cartTotal.textContent = `Total: R$ ${totalWithDelivery.toFixed(2)}`;
}

function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

function toggleCart() {
    const cart = document.getElementById('cart');
    cart.classList.toggle('open');
}

function openModal() {
    document.getElementById('orderModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function toggleAddress() {
    const deliveryMethod = document.getElementById('deliveryMethod');
    const addressField = document.getElementById('addressField');
    if (deliveryMethod.value === 'delivery') {
        addressField.style.display = 'block';
    } else {
        addressField.style.display = 'none';
    }
    updateCart(); // Update cart to reflect delivery fee changes
}

function generateWhatsAppURL(message) {
    const phoneNumber = '5594991446833';
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    let message = `Novo pedido de ${name}!\n\n`;
    message += `Método de entrega: ${deliveryMethod === 'pickup' ? 'Retirar no local': 'Entrega'}\n`;
    if (deliveryMethod === 'delivery') {
        message += `Endereço: ${address}\n`;
    }
    message += `Forma de pagamento: ${paymentMethod}\n`;
    message += '\nItens do pedido:\n';

    // Group items for the message
    const groupedItems = cart.reduce((acc, curr) => {
        acc[curr.item] = acc[curr.item] || { count: 0, price: curr.price };
        acc[curr.item].count++;
        return acc;
    }, {});

    Object.entries(groupedItems).forEach(([itemName, details]) => {
        message += `${itemName} x${details.count} - R$ ${(details.price * details.count).toFixed(2)}\n`;
    });

    if (deliveryMethod === 'delivery') {
        message += `Taxa de entrega - R$ ${deliveryFee.toFixed(2)}\n`;
    }

    const totalWithDelivery = total + (deliveryMethod === 'delivery' ? deliveryFee : 0);
    message += `\nTotal: R$ ${totalWithDelivery.toFixed(2)}`;

    const whatsappURL = generateWhatsAppURL(message);
    window.open(whatsappURL, '_blank');

    cart = [];
    total = 0;
    updateCart();
    updateCartIcon();
    closeModal();
    toggleCart();
});

function checkCafeOpen() {
  const now = new Date();
  const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const hour = now.getHours();
  const minute = now.getMinutes();

  const currentTime = hour * 60 + minute;

  const isSabbath = (day === 5 && currentTime >= 17 * 60) || // Friday after 17:00
  (day === 6) || // Saturday
  (day === 0 && currentTime < 8 * 60); // Sunday before 08:00

  if (isSabbath) {
    document.getElementById('sabbathModal').style.display = 'block';
    document.getElementById('closedModal').style.display = 'none';
    document.querySelectorAll('button, a, input, select').forEach(el => el.disabled = true);
    displaySabbathVerse();
  } else if (currentTime < 8 * 60 || currentTime >= 22 * 60) {
    document.getElementById('closedModal').style.display = 'block';
    document.getElementById('sabbathModal').style.display = 'none';
    document.querySelectorAll('button, a, input, select').forEach(el => el.disabled = true);
  } else {
    document.getElementById('closedModal').style.display = 'none';
    document.getElementById('sabbathModal').style.display = 'none';
    document.querySelectorAll('button, a, input, select').forEach(el => el.disabled = false);
  }
}

function displaySabbathVerse() {
  const verses = [
    "Lembra-te do dia de sábado, para santificá-lo. - Êxodo 20:8",
    "Seis dias trabalharás e farás toda a tua obra. Mas o sétimo dia é o sábado do Senhor teu Deus. - Êxodo 20:9-10",
    "O sábado foi feito por causa do homem, e não o homem por causa do sábado. - Marcos 2:27",
    "Bem-aventurado o homem que faz isto, e o filho do homem que lança mão disto; que se guarda de profanar o sábado. - Isaías 56:2"
  ];
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  document.getElementById('sabbathVerse').textContent = randomVerse;
}

checkCafeOpen();
setInterval(checkCafeOpen, 60000);

document.addEventListener('DOMContentLoaded', (event) => {
  const fadeElems = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElems.forEach(elem => {
    elem.style.opacity = 0;
    observer.observe(elem);
  });

  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click',
      () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
  });
});