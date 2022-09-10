let cart = JSON.parse(localStorage.getItem("cart")) || []
let stock = [];

// Cart Button DOM
let cartButton = document.getElementById("cartButton");


// Shipping DOM
let buttonShipping = document.getElementById("calculate");
let shipping = "";
let shippingResult = document.createElement("div");
shippingResult.id = "shippingResult";
let shippingContainer = document.getElementById("buttonContainer");
shippingContainer.append(shippingResult);

//Button shop DOM
let textTotal = document.getElementById("totalWShip");
let buttonPurchase = document.getElementById("buttonPurchase");
let goPay = document.getElementById("goPay");
let totalWshipping = document.createElement("div");
totalWshipping.id = "totalWshipping";
buttonPurchase.append(totalWshipping);

//Form DOM
let cForm = document.getElementById("container__form");

//Credit Cart DOM
let contCreditCard = document.getElementById("container__creditCard");


//Shop DOM
let section = document.getElementById("shop");
section.className = "section__container scale-up-center row row-col-2 text-center";


//Render Cards For OF
function renderProducts() {
    for (const product of stock) {
        let cardContainer = document.createElement("div");
        cardContainer.className = "col-12 col-md-6 col-xl-4"
        cardContainer.innerHTML = `<div class="card" style="width: 18rem;">
         <img src="${product.img}" class="card-img-top" alt="...">
        <div class="card-body">
         <h5 class="card-title">${product.article}</h5>
         <h6 class="card-title">ID: ${product.id}</h6>
        <p class="card-text"></p>
         <p class="card-text">$ ${(product.price)}</p>
                <button id="btn${product.id}" class="btn btn-primary">Agregar a Carrito</button>
 </div>
 </div>
 `;
        section.append(cardContainer)
    }

    stock.forEach(prod => {

        document.getElementById(`btn${prod.id}`).onclick = function () {
            addToCart(prod);

        };

    });

}

//function Open offcanvas
const openCart = () => document.getElementById("openCart").click();


// Add to cart!
function addToCart(newProduct) {
    let found = cart.find(p => p.id == newProduct.id);
    console.log(found);
    if (found == undefined) {
        let addCart = {
            ...newProduct,
            amount: 1
        };
        cart.push(addCart);
        console.log(cart);

        Toastify({

            text: "Agregaste al carrito: " + newProduct.article,
            position: screenLeft,
            duration: 3000

        }).showToast();

        document.getElementById("tbody").innerHTML += (`
        <tr id="row${addCart.id}">
        <td>${addCart.id}</td>
        <td>${addCart.article}</td>
        <td>${addCart.mat}</td>
        <td id="${addCart.id}">${addCart.amount}</td>
        <td>$${addCart.price}</td>
        <td> <button class='btn btn-light' onclick='deleteItem(${addCart.id})'>🗑️</button></td>
        </tr>
        `);
    } else {

        let position = cart.findIndex(p => p.id == newProduct.id);

        cart[position].amount += 1;
        document.getElementById(newProduct.id).innerHTML = cart[position].amount;

        Toastify({

            text: "Agregaste al carrito: " + newProduct.article,
            position: screenLeft,
            duration: 3000,

        }).showToast();
    }
    document.getElementById("totalToPay").innerText = (`Total productos $ ${totalShop()}`);
    localStorage.setItem("cart", JSON.stringify(cart));
    cartButton.innerText = " " + cart.length;

    goPay.removeAttribute("disabled")
    discount();
    openCart();
    calculateShipping();

}



//Function Discount!
function discount() {
    let discount = 0;
    if (totalShop() >= 3000) {

        let multiply = totalShop() * 10;
        discount = multiply / 100;
        document.getElementById("discount").innerText = ("Felicitaciones tu descuento es de $" + discount);

    } else {

        document.getElementById("discount").innerText = ("Tu descuento es de $" + discount);

    }

    return discount;
}


//Total shop amount!
function totalShop() {
    let totalPrice = 0;
    for (const item of cart) {
        totalPrice = totalPrice + (item.price * item.amount);

    }
    return totalPrice;
}


//Delete Items!
function deleteItem(id) {

    let init = cart.findIndex(product => product.id == id);
    cart.splice(init, 1); //eliminando del carro
    if (cart.length === 0) {
        goPay.setAttribute("disabled", "");
    }
    let row = document.getElementById(`row${id}`);
    document.getElementById("tbody").removeChild(row); //eliminando de la tabla
    document.getElementById("totalToPay").innerText = (`Total productos $ ${totalShop()}`);
    localStorage.setItem("cart", JSON.stringify(cart));
    cartButton.innerText = " " + cart.length;
    Toastify({

        text: "Producto eliminado  ",
        position: "center",
        duration: 5000,

    }).showToast();
    calculateShipping();
    discount();

    toPayshop();

}



//Calculate Shipping!
function calculateShipping() {
    textTotal.innerText = "Total de compra: $ " + toPayshop();

    calculate.addEventListener("click", function () {
        textTotal.innerText = "Total de compra con envio: $ " + toPayshop();
        let input = document.getElementById("number")
        let priceShipping = 0;
        shipping = input.value;
        document.getElementById("shippingResult");


        if (shipping == 1) {
            shipping = priceShipping + 350;
            shippingResult.innerHTML = "<h4>El valor de tu envió es de $" + shipping + "</h4>";

        } else if (shipping == 2) {
            shipping = priceShipping + 650;
            shippingResult.innerHTML = "<h4>El valor de tu envió es de $" + shipping + "</h4>";

        } else if (shipping == 3) {
            shipping = priceShipping + 900;
            shippingResult.innerHTML = "<h4>El valor de tu envió es de $" + shipping + "</h4>";

        } else if ((shipping == 4)) {
            shipping = priceShipping + 0
            shippingResult.innerHTML = "<h4>¡Retira gratis en sucursal!</h4>";

        } else {
            shippingResult.innerHTML = "<h4>Ingresa una opción correcta</h4>";
        }

    });
    toPayshop();

}




//Get JSON STOCK!
async function getStock() {
    const URLJSON = "./js/stock.json";
    const response = await fetch(URLJSON);
    const data = await response.json();
    stock = data;
    renderProducts();
}

getStock();



// Total to Pay with Discount!
function toPayshop() {
    let totalWithDisc = (totalShop() + shipping) - discount();
    goPay.onclick = () => {

        Swal.fire({
            position: 'top',
            icon: 'success',
            title: '¡Gracias por tu compra! Estamos procesando tu compra por un total de $' + totalWithDisc + " Completa el formulario para continuar!",
            showConfirmButton: false,
            timer: 5000,
        });
        openCart();
        discount();
        renderForm();


    }
    return totalWithDisc;
}



//Render Form! 
function renderForm() {
    cForm.innerHTML = `
    <form class="m-1 row g-3 text-white d-flex justify-content-center">
  <div class="m-1 col-xs-6 col-md-6 col-xl-6">
    <label for="inputName4" class="form-label">Nombre</label>
    <input type="text" class="form-control" id="inputName4"placeholder="Ingrese su nombre">
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-6">
    <label for="inputSurname" class="form-label">Apellido</label>
    <input type="text" class="form-control" id="inputApellido4"placeholder="Ingrese su apellido">
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-6">
    <label for="inputEmail" class="form-label">Email</label>
    <input type="email" class="form-control" id="inputEmail4"placeholder="Ingrese su email pedro@gmail.com">
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-6">
    <label for="inputAddress" class="form-label">Dirección</label>
    <input type="text" class="form-control" id="inputAddress" placeholder="Ejemplo: Av Cabildo 4879">
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-6">
    <label for="inputCity" class="form-label">Localidad</label>
    <input type="text" class="form-control" id="inputCity"placeholder="Ejemplo: Belgrano">
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-6">
    <label for="inputState" class="form-label">Zona  GBA / CABA </label>
    <select id="inputState" class="form-select">
      <option selected>Elegi tu zona de envió...</option>
      <option>CABA</option>
      <option>Zona Norte</option>
      <option>Zona Oeste</option>
      <option>Zona Sur</option>
    </select>
  </div>
 
  <div class="m-1 col-xs-12 col-md-6 col-xl-12 d-flex justify-content-center">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="gridCheck">
      <label class="form-check-label" for="gridCheck">
        Confirmar datos
      </label>
    </div>
  </div>
  <div class="m-1 col-xs-12 col-md-6 col-xl-4 d-flex justify-content-center mb-lg-5">
    
  </div>
</form>`

    creditCard();
};



//Render Credit Card!
function creditCard() {

    contCreditCard.innerHTML = `<div class="padding">
<div class="row text-white">
<div class="col-sm-6 text-white">
<div class="card text-white">
<div class="card-header text-white">
<strong>Tarjeta de Crédito / Débito</strong>
<small>Ingresa los datos de tu tarjeta para el pago</small>
</div>
<div class="card-body text-white">
<div class="row text-white">
<div class="col-sm-12 text-white">
<div class="form-group text-white">
    

    
<label for="name">Nombre</label>
<input class="form-control" id="name" type="text" placeholder="Ingresa nombre como figura en tarjeta">
</div>
</div>
</div>

<div class="row">
<div class="col-sm-12">
<div class="form-group">
<label for="ccnumber">Numero de tarjeta</label>


<div class="input-group">
<input class="form-control" type="number" placeholder="0000 0000 0000 0000" autocomplete="card">
<div class="input-group-append">
<span class="input-group-text">
<i class="mdi mdi-credit-card"></i>
</span>
</div>
</div> 
</div>
</div>
</div>

<div class="row">
<div class="form-group col-sm-4">
<label for="ccmonth">Mes</label>
<select class="form-control" id="ccmonth">
<option>1</option>
<option>2</option>
<option>3</option>
<option>4</option>
<option>5</option>
<option>6</option>
<option>7</option>
<option>8</option>
<option>9</option>
<option>10</option>
<option>11</option>
<option>12</option>
</select>
</div>
<div class="form-group col-sm-4">
<label for="ccyear">Año</label>
<select class="form-control" id="ccyear">
<option>2014</option>
<option>2015</option>
<option>2016</option>
<option>2017</option>
<option>2018</option>
<option>2019</option>
<option>2020</option>
<option>2021</option>
<option>2022</option>
<option>2023</option>
<option>2024</option>
<option>2025</option>
</select>
</div>
<div class="col-sm-4">
<div class="form-group">
<label for="cvv">Código</label>
<input class="form-control" id="cvv" type="number" placeholder="123">
</div>
</div>
</div>

</div>
<div class="card-footer">
<button onclick="confirmShop()" class="btnConfirm btn btn-primary">Confirmar Compra </button>
<a class="nav-link" href="index.html"><button onclick="cancelShop()" class="btn btn-sm btn-danger" type="reset">
<i class="mdi mdi-lock-reset"></i>Volver a Tienda</button></a>
</div>
</div>
</div>
</div>
</div>`
};

cForm.append(section);
contCreditCard.append(section);



// Render Local Storage!
function showLocalStorage() {
    cart.map(item => document.getElementById("tbody").innerHTML += `<tr id="row${item.id}">
    <tr id="row${item.id}">
        <td>${item.id}</td>
        <td>${item.article}</td>
        <td>${item.mat}</td>
        <td id="${item.id}">${item.amount}</td>        
        <td>$${item.price}</td>
        
        <td> <button class='btn btn-light' onclick='deleteItem(${item.id})'>🗑️</button></td>
        </tr>`);

    cartButton.innerText = " " + cart.length;
    goPay.removeAttribute("disabled");
    discount();

};


// Confirm Shop!
function confirmShop() {
    cart = [];
    showLocalStorage();
    localStorage.clear();
    tbody.innerHTML = ``;
    document.getElementById("totalToPay").innerText = ``;
    shippingResult.innerHTML = ``;

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tu compra finalizo con éxito, revisa tu correo para ver tu factura, y seguimiento!',
        showConfirmButton: false,
        timer: 5000

    });

};

//Cancel Shopping!
function cancelShop() {
    showLocalStorage();
    renderProducts();
    totalShop();
    calculateShipping();
    document.getElementById("totalToPay").innerText = (`Total productos $ ${totalShop()}`);


};

cancelShop();