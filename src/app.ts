const productForm = document.getElementById('product-form') as HTMLFormElement;
const productName = document.getElementById('name') as HTMLInputElement;
const productPrice = document.getElementById('price') as HTMLInputElement;
const productList = document.getElementById('product-list') as HTMLUListElement;

const apiUrl = 'https://be-wehaye-1234567.fly.dev';

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = productName.value;
  const price = parseFloat(productPrice.value);

  if (productForm.dataset.mode === 'edit') {
    const productId = productForm.dataset.productId;
    const response = await fetch(`${apiUrl}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price }),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      const existingProduct = productList.querySelector(`[data-id="${updatedProduct.id}"]`);
      if (existingProduct) {
        existingProduct.innerHTML = `${updatedProduct.name} - $${updatedProduct.price}
                                     <div>
                                       <button class="btn btn-primary edit-btn" data-id="${updatedProduct.id}">Edit</button>
                                       <button class="btn btn-danger delete-btn" data-id="${updatedProduct.id}">Delete</button>
                                     </div>`;
      }
      productForm.reset();
      productForm.removeAttribute('data-mode');
      productForm.removeAttribute('data-product-id');
    }
  } else {
    const response = await fetch(`${apiUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price }),
    });

    if (response.ok) {
      const newProduct = await response.json();
      displayProduct(newProduct);
      productForm.reset();
    }
  }
});

async function fetchProducts() {
  const response = await fetch(`${apiUrl}/api/products`);
  const products = await response.json();
  displayProductList(products);
}

function displayProductList(products: any[]) {
  productList.innerHTML = '';
  products.forEach(displayProduct);
}

function displayProduct(product: any) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.innerHTML = `
    ${product.name} - $${product.price}
    <div>
      <button class="btn btn-primary edit-btn" data-id="${product.id}">Edit</button>
      <button class="btn btn-danger delete-btn" data-id="${product.id}">Delete</button>
    </div>
  `;

  const editButton = li.querySelector('.edit-btn') as HTMLButtonElement;
  const deleteButton = li.querySelector('.delete-btn') as HTMLButtonElement;

  editButton.addEventListener('click', () => editProduct(product));
  deleteButton.addEventListener('click', () => deleteProduct(product.id));

  productList.appendChild(li);
}

async function editProduct(product: any) {
  productName.value = product.name;
  productPrice.value = product.price.toString();
  productForm.dataset.mode = 'edit';
  productForm.dataset.productId = product.id;
}

async function deleteProduct(productId: string) {
  const response = await fetch(`${apiUrl}/api/products/${productId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    const deletedProduct = await response.json();
    const productElement = productList.querySelector(`[data-id="${deletedProduct.id}"]`);
    if (productElement) {
      productElement.remove();
    }
  }
}

fetchProducts();
