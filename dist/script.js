import { Product, getProducts, Products, Rand, getIDs } from "./utils.js";
const imageFile = document.getElementById("image-file");
const productPrice = document.getElementById("price");
const productName = document.getElementById("product-name");
const productInfo = document.getElementById("details");
const submitBtn = document.getElementById("submit-btn");
const closeBtn = document.getElementById("close-btn");
const clearBtn = document.getElementById("clear-btn");
const addBtn = document.getElementById("add-btn");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");
const imageCont = document.querySelector(".image-container");
const modalCont = document.querySelector(".modal-container");
const productsContainer = document.querySelector(".products-container");
const formCont = document.querySelector(".create-form-container");
const FormHeader = document.querySelector(".header");
const message = document.querySelector(".message");
let selectedImageURL;
let products = getProducts();
let IDs = getIDs();
let timer;
let editID;
let isEditing = false;
imageFile.addEventListener("change", (e) => {
    var _a;
    const reader = new FileReader();
    const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
    reader.addEventListener("loadend", () => {
        imageCont.innerHTML = `<img src=${reader.result} />`;
        selectedImageURL = reader.result;
    });
    if (file) {
        reader.readAsDataURL(file);
    }
});
submitBtn.addEventListener("click", () => {
    clearTimeout(timer);
    const price = productPrice.valueAsNumber;
    const name = productName.value;
    const details = productInfo.value;
    if (isEditing) {
        if (selectedImageURL && price && name && details) {
            products = products.map((product) => {
                const createdProduct = new Product(name, selectedImageURL.toString(), price, details, editID);
                if (product.id == editID) {
                    return createdProduct;
                }
                else {
                    return product;
                }
            });
            addAndUpdate();
            isEditing = false;
            editID = "";
            FormHeader.textContent = "Add Product Here!";
            submitBtn.textContent = "add to list";
            message.innerHTML = "product updated!";
        }
        else {
            message.innerHTML = "all fields are required!";
        }
    }
    else {
        const id = new Rand(IDs).randomID;
        if (selectedImageURL && price && name && details) {
            const createdProduct = new Product(name, selectedImageURL.toString(), price, details, id);
            IDs.push(id);
            products.push(createdProduct);
            addAndUpdate();
            clearInputs();
            message.innerHTML = "product successfully added!";
        }
        else {
            message.innerHTML = "all fields are required!";
        }
    }
    timer = window.setTimeout(() => {
        message.innerHTML = "";
        message.classList.remove("success");
    }, 1500);
});
clearBtn.addEventListener("click", () => {
    if (products.length > 0) {
        modalCont.classList.add("show-modal");
    }
    return;
});
cancelBtn.addEventListener("click", () => {
    modalCont.classList.remove("show-modal");
});
confirmBtn.addEventListener("click", () => {
    products = [];
    IDs = [];
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("IDs", JSON.stringify(IDs));
    DisplayProducts();
    modalCont.classList.remove("show-modal");
});
closeBtn.addEventListener("click", () => {
    formCont.classList.remove("show-modal");
});
addBtn.addEventListener("click", () => {
    FormHeader.textContent = "Add Product Here!";
    submitBtn.textContent = "add to list";
    clearInputs();
    formCont.classList.add("show-modal");
});
formCont.addEventListener("click", (e) => {
    if (e.target.className.includes("create-form-container")) {
        formCont.classList.remove("show-modal");
    }
});
modalCont.addEventListener("click", (e) => {
    if (e.target.className.includes("modal-container")) {
        modalCont.classList.remove("show-modal");
    }
});
window.addEventListener("DOMContentLoaded", () => {
    DisplayProducts();
});
function DisplayProducts() {
    const productList = new Products(products);
    productsContainer.innerHTML = productList.displayEveryItem();
    document.querySelectorAll(".fa-trash").forEach((btn) => {
        btn.addEventListener("click", (e) => removeItem(e));
    });
    document.querySelectorAll(".fa-pen-to-square").forEach((btn) => {
        btn.addEventListener("click", (e) => EditProduct(e));
    });
}
function EditProduct(e) {
    FormHeader.textContent = "Editing Product";
    submitBtn.textContent = "update product";
    const data = e.target.dataset;
    const productID = data.id;
    const editingProduct = products.find((product) => product.id == productID);
    const { name, id, price, details, image } = editingProduct;
    productName.value = name;
    productPrice.value = price.toString();
    productInfo.value = details;
    imageCont.innerHTML = `<img src=${image} alt="product image"/>`;
    selectedImageURL = image;
    isEditing = true;
    editID = id;
    formCont.classList.add("show-modal");
}
function removeItem(e) {
    const data = e.target.dataset;
    const productID = data.id;
    products = products.filter((product) => product.id != productID);
    IDs = IDs.filter((ID) => ID != productID);
    DisplayProducts();
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("IDs", JSON.stringify(IDs));
}
function addAndUpdate() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("IDs", JSON.stringify(IDs));
    DisplayProducts();
    clearInputs();
    message.classList.add("success");
}
function clearInputs() {
    imageCont.innerHTML = `<p>Product image</p>`;
    productPrice.value = "";
    productName.value = "";
    productInfo.value = "";
    imageFile.value = "";
}
