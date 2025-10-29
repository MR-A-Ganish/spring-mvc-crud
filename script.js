const baseURL = "http://localhost:8080/InventoryManagementSystem";

// Fetch and display inventory
async function displayInventory() {
  const res = await fetch(${baseURL}/viewInventory);
  const data = await res.json();
  const tbody = document.querySelector("#inventoryTable tbody");
  tbody.innerHTML = "";
  data.forEach((item, i) => {
    const row = `<tr>
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.supplier}</td>
      <td>${item.price}</td>
      <td>${item.location}</td>
      <td>
        <button class="edit" onclick="fillForm('${item.sku}')">Edit</button>
        <button class="delete" onclick="deleteItem('${item.sku}')">Delete</button>
      </td>
    </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Add or update item
document.querySelector("#inventoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(${baseURL}/addItem, {
    method: "POST",
    body: formData
  });
  const result = await res.json();
  alert(result.message || result.error);
  displayInventory();
});

// Delete item
async function deleteItem(sku) {
  if (!confirm("Delete item " + sku + "?")) return;
  const res = await fetch(${baseURL}/deleteItem?sku=${sku}, { method: "DELETE" });
  const result = await res.json();
  alert(result.message || result.error);
  displayInventory();
}

// Fill form for editing (frontend only)
function fillForm(sku) {
  alert("Editing mode not yet connected to backend update.");
}

// Initial load
displayInventory();
