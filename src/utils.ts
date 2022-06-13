class Products {
  private productList: Product[];

  constructor(list: Product[]) {
    this.productList = list;
  }

  displayEveryItem(): string {
    const products = this.productList.map((product) => {
      const { name, image, price, details, id } = product;

      return `
        <div class="product">
          <img src=${image} alt="product image"/>
          <div class="details">
            <div>
              <h2>${name}</h2>
              <span>PHP ${price}</span>
            </div>
            <p>${details}</p>
            <div class="btns">
              <i  class="fa-solid fa-trash" data-id=${id}></i>
              <i class="fa-solid fa-pen-to-square" data-id=${id}></i>
            </div>
          </div>
        </div>`;
    });

    if (products.length > 0) {
      return products.join("");
    } else {
      return `
        <div>
          <p>NO ITEM IN THE LIST!</p>
        </div>`;
    }
  }
}

class Product {
  constructor(
    readonly name: string,
    readonly image: string,
    readonly price: number,
    readonly details: string,
    readonly id: string
  ) {}
}

class Rand {
  private alphabet = "abcdefghijklmnopqrstuvwxyz";
  private numbers = "0123456789";
  randomID: string;

  constructor(IDsArray: string[]) {
    let id = this.getUniqueID();

    while (IDsArray.includes(id)) {
      id = this.getUniqueID();
    }

    this.randomID = id;
  }

  getUniqueID(): string {
    let id = "";
    for (var i = 0; i < 30; i++) {
      const selected = Math.floor(Math.random() * 2) + 1;
      if (selected == 1) {
        const index = Math.floor(Math.random() * this.alphabet.length) + 1;
        id += this.alphabet.charAt(index);
      } else {
        const index = Math.floor(Math.random() * this.numbers.length) + 1;
        id += this.numbers.charAt(index);
      }
    }

    return id;
  }
}

function getIDs(): string[] {
  let IDs = localStorage.getItem("IDs");
  return IDs ? JSON.parse(IDs) : [];
}

function getProducts(): Product[] {
  let products = localStorage.getItem("products");
  return products ? JSON.parse(products) : [];
}

export { getProducts, Product, Products, getIDs, Rand };
