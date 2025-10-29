async function loadItems() {
  const res = await fetch('/get_items');
  const data = await res.json();
  const tbody = document.querySelector('#inventoryTable tbody');
  tbody.innerHTML = '';

  let totalItems = data.length;
  let totalQty = 0;
  let totalValue = 0;

  data.forEach(item => {
    totalQty += item[3];
    totalValue += item[3] * item[4];

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item[0]}</td>
      <td>${item[1]}</td>
      <td>${item[2]}</td>
      <td>${item[3]}</td>
      <td>₹${item[4]}</td>
      <td>${item[5]}</td>
      <td>
        <button onclick="deleteItem(${item[0]})"><i class='fas fa-trash'></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('totalItems').textContent = totalItems;
  document.getElementById('totalQty').textContent = totalQty;
  document.getElementById('totalValue').textContent = '₹' + totalValue.toFixed(2);
}

async function addItem() {
  const data = {
    product_name: document.getElementById('product_name').value,
    category: document.getElementById('category').value,
    quantity: parseInt(document.getElementById('quantity').value),
    price: parseFloat(document.getElementById('price').value),
    location: document.getElementById('location').value
  };

  if (!data.product_name || !data.quantity || !data.price) {
    alert("Please fill all required fields!");
    return;
  }

  await fetch('/add_item', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });

  document.querySelectorAll('input').forEach(i => i.value = '');
  loadItems();
}

async function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    await fetch(`/delete_item/${id}`, { method: 'DELETE' });
    loadItems();
  }
}

window.onload = loadItems;
