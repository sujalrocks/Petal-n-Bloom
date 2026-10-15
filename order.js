const ordersList = document.getElementById('orders-list');
const orders = JSON.parse(localStorage.getItem('flowerOrders') || '[]');

function showOrders() {
  if (orders.length === 0) {
    ordersList.innerHTML = '<div class="empty-orders"><div>💐</div><h2>No orders yet</h2><p>Your flower bookings will appear here after you submit the booking form.</p></div>';
    return;
  }

  ordersList.innerHTML = '';

  orders.forEach(function(order) {
    const card = document.createElement('section');
    card.className = 'order-card';

    const heading = document.createElement('div');
    heading.className = 'order-card-heading';
    heading.innerHTML = '<div><p class="order-label">ORDER NUMBER</p><h2>' + order.id + '</h2></div><span class="order-status">' + order.status + '</span>';
    card.appendChild(heading);

    const details = document.createElement('div');
    details.className = 'order-details';
    details.innerHTML = '<div><span>Bouquet</span><strong></strong></div>' +
      '<div><span>Delivery date</span><strong></strong></div>' +
      '<div><span>Total</span><strong></strong></div>' +
      '<div><span>Delivering to</span><strong></strong></div>';
    details.children[0].children[1].textContent = order.bouquet;
    details.children[1].children[1].textContent = order.date;
    details.children[2].children[1].textContent = '₹' + Number(order.price).toLocaleString('en-IN');
    details.children[3].children[1].textContent = order.address;
    card.appendChild(details);

    const trackTitle = document.createElement('h3');
    trackTitle.className = 'tracking-title';
    trackTitle.textContent = 'Delivery tracking';
    card.appendChild(trackTitle);

    const steps = document.createElement('div');
    steps.className = 'tracking-steps';
    const labels = ['Booking received', 'Preparing bouquet', 'Out for delivery', 'Delivered'];
    labels.forEach(function(label, index) {
      const step = document.createElement('div');
      step.className = 'tracking-step ' + (index === 0 ? 'current' : '');
      step.innerHTML = '<span class="step-dot">' + (index === 0 ? '✓' : (index + 1)) + '</span><span>' + label + '</span>';
      steps.appendChild(step);
    });
    card.appendChild(steps);

    const note = document.createElement('p');
    note.className = 'tracking-note';
    note.textContent = 'This is a demo tracker. Your booking is saved on this device, but a real flower shop has not been notified and delivery status will not update automatically.';
    card.appendChild(note);
    ordersList.appendChild(card);
  });
}

showOrders();
