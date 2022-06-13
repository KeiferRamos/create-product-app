import { Product, getProducts, Products, Rand, getIDs } from "./utils.js";

const imageFile = document.getElementById("image-file") as HTMLInputElement;
const productPrice = document.getElementById("price") as HTMLInputElement;
const productName = document.getElementById("product-name") as HTMLInputElement;
const productInfo = document.getElementById("details") as HTMLTextAreaElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
const closeBtn = document.getElementById("close-btn") as HTMLButtonElement;
const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const confirmBtn = document.getElementById("confirm-btn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
const imageCont = document.querySelector(".image-container") as HTMLDivElement;
const modalCont = document.querySelector(".modal-container") as HTMLDivElement;
const productsContainer = document.querySelector(
  ".products-container"
) as HTMLDivElement;
const formCont = document.querySelector(
  ".create-form-container"
) as HTMLDivElement;
const FormHeader = document.querySelector(".header") as HTMLHeadingElement;
const message = document.querySelector(".message") as HTMLSpanElement;
let selectedImageURL: string | ArrayBuffer | null;
let products: Product[] = getProducts();
let IDs: string[] = getIDs();
let timer: number;
let editID: string;
let isEditing: boolean = false;

imageFile.addEventListener("change", (e: Event) => {
  const reader = new FileReader();
  const file = (e.target as HTMLInputElement)!.files?.[0];

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
  const price: number = productPrice.valueAsNumber;
  const name: string = productName.value;
  const details = productInfo.value;
  if (isEditing) {
    if (selectedImageURL && price && name && details) {
      products = products.map((product) => {
        const createdProduct = new Product(
          name,
          selectedImageURL!.toString(),
          price,
          details,
          editID
        );
        if (product.id == editID) {
          return createdProduct;
        } else {
          return product;
        }
      });
      addAndUpdate();
      isEditing = false;
      editID = "";
      FormHeader.textContent = "Add Product Here!";
      submitBtn.textContent = "add to list";
      message.innerHTML = "product updated!";
    } else {
      message.innerHTML = "all fields are required!";
    }
  } else {
    const id = new Rand(IDs).randomID;

    if (selectedImageURL && price && name && details) {
      const createdProduct = new Product(
        name,
        selectedImageURL.toString(),
        price,
        details,
        id
      );
      IDs.push(id);
      products.push(createdProduct);
      addAndUpdate();
      clearInputs();
      message.innerHTML = "product successfully added!";
    } else {
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

formCont.addEventListener("click", (e: Event) => {
  if ((e.target as Element).className.includes("create-form-container")) {
    formCont.classList.remove("show-modal");
  }
});

modalCont.addEventListener("click", (e: Event) => {
  if ((e.target as Element).className.includes("modal-container")) {
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
    btn.addEventListener("click", (e: Event) => removeItem(e));
  });

  document.querySelectorAll(".fa-pen-to-square").forEach((btn) => {
    btn.addEventListener("click", (e: Event) => EditProduct(e));
  });
}

function EditProduct(e: Event) {
  FormHeader.textContent = "Editing Product";
  submitBtn.textContent = "update product";
  const data = (e.target as HTMLElement).dataset as DOMStringMap;
  const productID = data.id;
  const editingProduct: Product = products.find(
    (product) => product.id == productID
  )!;
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

function removeItem(e: Event) {
  const data = (e.target as HTMLElement).dataset as DOMStringMap;
  const productID = data.id;

  products = products.filter((product: Product) => product.id != productID);
  IDs = IDs.filter((ID: string) => ID != productID);

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
