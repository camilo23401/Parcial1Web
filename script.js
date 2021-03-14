const products = [];
let favorites = [];
const contentTag = document.getElementById("content");
(async function fetchProducts() {
  const response = await fetch(
    "https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce"
  );
  const responseJson = await response.json();
  const productsJson = await responseJson.items;
  for (let i in productsJson) {
    products.push(productsJson[i]);
  }
  content(products, "list", "x");
})();

function comma(num) {
  let str = num.toString().split(".");
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  if (!str[1]) {
    str[1] = "00";
  }
  return str.join(".");
}

function content(data, type, filter) {
  if (type === "list") {
    renderData(data);
  } else if (type === "filtered") {
    const filteredEntries = [];
    for (i in data) {
      if (data[i].categories.includes(filter)) {
        filteredEntries.push(data[i]);
      }
    }
    if (filteredEntries.length === 0) {
      document.getElementById;
      contentTag.innerHTML = "";
      const container = document.createElement("h1");
      container.style.maxWidth = "1220px";
      contentTag.append(container);
      container.innerText =
        "We're sorry. There are no matches for your search.";
    } else {
      renderData(filteredEntries);
    }
  } else if (type === "detailed") {
    let filteredObject;
    for (i in data) {
      if (data[i].id === filter) {
        filteredObject = data[i];
      }
    }
    renderDetail(filteredObject);
  } else if (type === "favorites") {
    renderFavs(data);
  }
}

function renderData(data) {
  contentTag.innerHTML = "";
  for (i in data) {
    price = comma(data[i].price.amount);
    product = data[i].title;
    picture = data[i].picture;
    loc = data[i].location;
    shiping = data[i].free_shipping;
    const container = document.createElement("div");
    container.classList.add("card");
    container.classList.add("mb-3");
    container.style.maxWidth = "1220px";
    contentTag.append(container);
    const row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("no-gutters");
    container.appendChild(row);
    const imgSpace = document.createElement("div");
    imgSpace.classList.add("col-2");
    row.appendChild(imgSpace);
    const productImg = document.createElement("img");
    productImg.classList.add("card-img-list");
    productImg.src = picture;
    imgSpace.appendChild(productImg);
    imgSpace.onclick = function () {
      let id;
      for (let j in data) {
        if (data[j].picture === productImg.src) {
          id = data[j].id;
        }
      }
      content(data, "detailed", id);
    };
    const infoSpace = document.createElement("div");
    infoSpace.classList.add("col-7");
    row.appendChild(infoSpace);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    infoSpace.appendChild(cardBody);
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-text");
    cardBody.appendChild(cardTitle);
    cardTitle.innerText = "$ " + price;
    if (shiping === true) {
      const freeShipping = document.createElement("img");
      freeShipping.classList.add("fs-image");
      freeShipping.src = "media/freeShipping.png";
      freeShipping.alt = "This item has free shiping";
      cardBody.appendChild(freeShipping);
    }
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardBody.appendChild(cardText);
    cardText.innerText = product;
    const infoCiudad = document.createElement("div");
    infoCiudad.classList.add("col-2");
    row.appendChild(infoCiudad);
    const ciudad = document.createElement("p");
    ciudad.classList.add("txt-ciudad");
    infoCiudad.appendChild(ciudad);
    ciudad.innerText = loc;
  }
}

function renderDetail(productData) {
  contentTag.innerHTML = "";
  const breadcrumb = document.createElement("div");
  breadcrumb.classList.add("breadcrumb");
  contentTag.appendChild(breadcrumb);
  const breadcrumbContent = document.createElement("p");
  breadcrumb.appendChild(breadcrumbContent);
  const categories = productData.categories;
  const bc = categories.join(" > ");
  breadcrumbContent.innerText = bc;
  const container = document.createElement("div");
  container.classList.add("container-detail");
  contentTag.appendChild(container);
  const row1 = document.createElement("div");
  row1.classList.add("row");
  container.appendChild(row1);
  const productImgSpace = document.createElement("div");
  productImgSpace.classList.add("col-8");
  row1.appendChild(productImgSpace);
  const imgDetail = document.createElement("img");
  imgDetail.classList.add("image-detail");
  imgDetail.src = productData.picture;
  productImgSpace.appendChild(imgDetail);
  const infoButtonsSpace = document.createElement("div");
  infoButtonsSpace.classList.add("col-4");
  row1.appendChild(infoButtonsSpace);
  const statusSold = document.createElement("p");
  statusSold.classList.add("status-sold");
  infoButtonsSpace.appendChild(statusSold);
  statusSold.innerText =
    productData.condition + " | " + productData.sold_quantity + " vendidos";
  const productName = document.createElement("p");
  productName.classList.add("product-name-detail");
  infoButtonsSpace.appendChild(productName);
  productName.innerText = productData.title;
  const productPrice = document.createElement("p");
  productPrice.classList.add("product-price-detail");
  infoButtonsSpace.appendChild(productPrice);
  productPrice.innerText = comma("$" + productData.price.amount);
  const buyButton = document.createElement("button");
  buyButton.classList.add("buy-button");
  buyButton.id = "buyButton";
  infoButtonsSpace.appendChild(buyButton);
  buyButton.dataset.toggle = "modal";
  buyButton.dataset.target = "#modalPurchase";
  buyButton.innerText = "Comprar";
  buyButton.onclick = function () {
    document.getElementById("modalObject").innerText = productData.title;
  };
  const favButton = document.createElement("button");
  favButton.classList.add("fav-button");
  favButton.id = "favButton";
  infoButtonsSpace.appendChild(favButton);
  let pressed = false;
  if (favorites.includes(productData)) {
    favButton.innerText = "Quitar de favoritos";
    pressed = true;
  } else {
    favButton.innerText = "Añadir a favoritos";
  }
  const row2 = document.createElement("div");
  row2.classList.add("row");
  container.appendChild(row2);
  const descriptionSpace = document.createElement("div");
  descriptionSpace.classList.add("col-8");
  row2.appendChild(descriptionSpace);
  const title = document.createElement("h2");
  title.classList.add("description-title");
  descriptionSpace.appendChild(title);
  title.innerText = "Descripción del producto";
  const description = document.createElement("p");
  description.classList.add("description-detail");
  descriptionSpace.appendChild(description);
  description.innerText = productData.description;
  const empty = document.createElement("div");
  empty.classList.add("col-4");
  row2.appendChild(empty);
  document.getElementById("favButton").onclick = function () {
    if (pressed === false) {
      makeFavorite(productData);
      favButton.innerText = "Quitar de favoritos";
      pressed = true;
    } else {
      removeFavorite(productData);
      favButton.innerText = "Añadir a favoritos";
      pressed = false;
    }
  };
}

function renderFavs(data) {
  contentTag.innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("card");
  container.classList.add("supBarFav");
  container.style.maxWidth = "1220px";
  contentTag.appendChild(container);
  const row = document.createElement("div");
  row.classList.add("row");
  row.classList.add("no-gutters");
  container.appendChild(row);
  const checkSpace = document.createElement("div");
  checkSpace.classList.add("col-1");
  row.appendChild(checkSpace);
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("checkFavAll");
  waschecked = false;
  checkBox.onclick = function () {
    if (!waschecked) {
      favButton.disabled = false;
      for (i in data) {
        document.getElementById("cb-" + i).checked = true;
        waschecked = true;
      }
    } else {
      favButton.disabled = true;
      for (i in data) {
        document.getElementById("cb-" + i).checked = false;
        waschecked = false;
      }
    }
  };
  checkSpace.appendChild(checkBox);
  const infoCiudad = document.createElement("div");
  infoCiudad.classList.add("col-11");
  row.appendChild(infoCiudad);
  const favButton = document.createElement("button");
  favButton.disabled = true;
  favButton.classList.add("delete-fav-button");
  favButton.id = "favButton";
  favButton.onclick = function () {
    forDeletion = [];
    for (i in data) {
      if (document.getElementById("cb-" + i).checked === true) {
        forDeletion.push(data[i]);
      }
    }
    favorites = favorites.filter((item) => !forDeletion.includes(item));
    content(favorites, "favorites", "x");
  };
  infoCiudad.appendChild(favButton);
  favButton.innerText = "Eliminar";
  for (i in data) {
    price = comma(data[i].price.amount);
    product = data[i].title;
    picture = data[i].picture;
    loc = data[i].location;
    shiping = data[i].free_shipping;
    const container = document.createElement("div");
    container.classList.add("card");
    container.classList.add("mb-3");
    container.style.maxWidth = "1220px";
    contentTag.append(container);
    const row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("no-gutters");
    container.appendChild(row);
    const checkSpace = document.createElement("div");
    checkSpace.classList.add("col-1");
    row.appendChild(checkSpace);
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "cb-" + i;
    checkBox.classList.add("checkFav");
    checkBox.onchange = function () {
      document.getElementById("favButton").disabled = false;
    };
    checkSpace.appendChild(checkBox);
    const imgSpace = document.createElement("div");
    imgSpace.classList.add("col-2");
    row.appendChild(imgSpace);
    const productImg = document.createElement("img");
    productImg.classList.add("card-img-fav");
    productImg.src = picture;
    imgSpace.appendChild(productImg);
    const infoSpace = document.createElement("div");
    infoSpace.classList.add("col-6");
    row.appendChild(infoSpace);
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body-fav");
    infoSpace.appendChild(cardBody);
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-text");
    cardBody.appendChild(cardTitle);
    cardTitle.innerText = "$ " + price;
    if (shiping === true) {
      const freeShipping = document.createElement("img");
      freeShipping.classList.add("fs-image-fav");
      freeShipping.src = "media/freeShipping.png";
      freeShipping.alt = "This item has free shiping";
      cardBody.appendChild(freeShipping);
    }
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardBody.appendChild(cardText);
    cardText.innerText = product;
    const infoCiudad = document.createElement("div");
    infoCiudad.classList.add("col-3");
    row.appendChild(infoCiudad);
    const favButton = document.createElement("button");
    favButton.classList.add("see-product");
    favButton.onclick = function () {
      let id;
      for (let j in data) {
        if (data[j].picture === productImg.src) {
          id = data[j].id;
        }
      }
      content(data, "detailed", id);
    };
    infoCiudad.appendChild(favButton);
    favButton.innerText = "Ver artículo";
  }
}

function makeFavorite(productData) {
  if (!favorites.includes(productData)) {
    favorites.push(productData);
  }
}

function removeFavorite(productData) {
  if (favorites.includes(productData)) {
    favorites.pop(productData);
  }
}

document.getElementById("favIcon").onclick = function () {
  content(favorites, "favorites", "x");
};

document.getElementById("homeLogo").onclick = function () {
  content(products, "list", "x");
};

document.getElementById("search").onclick = function () {
  content(
    products,
    "filtered",
    document.getElementById("filterparameter").value
  );
  document.getElementById("filterparameter").value = "";
};

document.getElementById("btnClosePurchase").onclick = function () {
  content(products, "list", "x");
};
