"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const productForm = document.getElementById('product-form');
const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productList = document.getElementById('product-list');
const apiUrl = 'https://be-wehaye-1234567.fly.dev';
productForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const name = productName.value;
    const price = parseFloat(productPrice.value);
    if (productForm.dataset.mode === 'edit') {
        const productId = productForm.dataset.productId;
        const response = yield fetch(`${apiUrl}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        });
        if (response.ok) {
            const updatedProduct = yield response.json();
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
    }
    else {
        const response = yield fetch(`${apiUrl}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price }),
        });
        if (response.ok) {
            const newProduct = yield response.json();
            displayProduct(newProduct);
            productForm.reset();
        }
    }
}));
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}/api/products`);
        const products = yield response.json();
        displayProductList(products);
    });
}
function displayProductList(products) {
    productList.innerHTML = '';
    products.forEach(displayProduct);
}
function displayProduct(product) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
    ${product.name} - $${product.price}
    <div>
      <button class="btn btn-primary edit-btn" data-id="${product.id}">Edit</button>
      <button class="btn btn-danger delete-btn" data-id="${product.id}">Delete</button>
    </div>
  `;
    const editButton = li.querySelector('.edit-btn');
    const deleteButton = li.querySelector('.delete-btn');
    editButton.addEventListener('click', () => editProduct(product));
    deleteButton.addEventListener('click', () => deleteProduct(product.id));
    productList.appendChild(li);
}
function editProduct(product) {
    return __awaiter(this, void 0, void 0, function* () {
        productName.value = product.name;
        productPrice.value = product.price.toString();
        productForm.dataset.mode = 'edit';
        productForm.dataset.productId = product.id;
    });
}
function deleteProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}/api/products/${productId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const deletedProduct = yield response.json();
            const productElement = productList.querySelector(`[data-id="${deletedProduct.id}"]`);
            if (productElement) {
                productElement.remove();
            }
        }
    });
}
fetchProducts();
