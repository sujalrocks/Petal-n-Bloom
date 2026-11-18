var ordersList = document.getElementById('orders-list');
var orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');
function showOrders() {
  if (orders.length === 0) {
    ordersList.innerHTML = '<div class="empty-orders"><div>💐</div><h2>No orders yet</h2><p>Your flower bookings will appear here after you submit the booking form.</p></div>';
    return;
  }

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];

    var card = document.createElement('section');
    card.className = 'order-card';

    var heading = document.createElement('div');
    heading.className = 'order-card-heading';
    heading.innerHTML = '<div><p class="order-label">ORDER NUMBER</p><h2>' +
      order.id + '</h2></div><span class="order-status">' +
      order.status + '</span>';
    card.appendChild(heading);

    var details = document.createElement('div');
    details.className = 'order-details';
    details.innerHTML =
      '<div><span>Bouquet</span><strong>' + order.bouquet + '</strong></div>' +
      '<div><span>Delivery date</span><strong>' + order.date + '</strong></div>' +
      '<div><span>Total</span><strong>₹' + Number(order.price).toLocaleString('en-IN') + '</strong></div>' +
      '<div><span>Delivering to</span><strong>' + order.address + '</strong></div>';
    card.appendChild(details);

    var note = document.createElement('p');
    note.className = 'tracking-note';
    note.textContent = 'Demo tracker: your booking is saved in this browser. Delivery updates are not automatic.';
    card.appendChild(note);

    ordersList.appendChild(card);
  }
}

showOrders();
