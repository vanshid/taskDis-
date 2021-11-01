// Declaration of my global variables
let rowToStart = 1;
let productNameToBeAdded;
let productPriceToBeAdded;
let productIdToBeAdded;
let productQuantityToBeAdded = 1;
let totalPrice = 0;
let unitPrice = 0;
let arrayForProduct = [];
let localData = [];
sumTotal = 0;
let clickedOrderTimes = 0;
let clickedProductTimes = 0;
unitPriceForAppending = 0;
let salePriceTotal = 0;

// regex values are like coupon codes so we will be using them as coupons and they are case-insensitive
const PRODUCT_REGEX = /product/i;
const ORDER_REGEX = /order/i;

const DISCOUNT_FOR_ITEMS = 0.1;

//Functions to be added on document getting ready
$(document).ready(function () {
  $('.product-item__add-btn').click(function () {
    parentElement = $(this).parent('li');
    productIdToBeAdded = parentElement.find('div.product-item__ID').text();
    productPriceToBeAdded = parentElement
      .find('div.product-item__price')
      .text()
      .replace('$', '');
    productNameToBeAdded = parentElement.find('a').text();
    addToCartForProducts(
      productIdToBeAdded,
      productNameToBeAdded,
      productPriceToBeAdded,
      productQuantityToBeAdded,
      totalPrice,
    );
    displayProductsInATable(arrayForProduct);
  });

  $('.onvalidationclick').click(onValidateCoupon);
  $('.removeProduct').click(deleteProduct);
  $('.removeQuant').click(removeQuantity);
  $('.addQuant').click(addQuantity);
  localData = JSON.parse(localStorage.getItem('myBasketForProduct'));

  if (localData) {
    arrayForProduct = localData;
    displayProductsInATable(arrayForProduct, unitPrice);
  }
});

/**
 * @param {productIdForAdding} -> product id for adding in arrayofProduct
 * @param {productName} -> product name for adding
 * @param {productPrice} -> product price  for adding
 * @param {productName} -> product name for adding
 * @param {productQuantity} -> for checking if quantity is greater than or not and pushing depending on the quantity
 */
function addToCartForProducts(
  productIdForAdding,
  productName,
  productPrice,
  productQuantity,
) {
  $('.totalPrice').text(' ');
  let findingTheIdOfProduct = arrayForProduct.find(
    (product) => product['productIdForAdding'] === productIdForAdding,
  );
  if (findingTheIdOfProduct !== undefined) {
    findingTheIdOfProduct['productQuantity'] += 1;
    findingTheIdOfProduct['productPrice'] =
      parseFloat(productPriceToBeAdded) *
      parseFloat(findingTheIdOfProduct.productQuantity);
  } else {
    arrayForProduct.push({
      productIdForAdding: productIdForAdding,
      productName: productName,
      productPrice: productPrice,
      productQuantity: productQuantity,
      productSellingPrice: productPriceToBeAdded,
    });
  }
  localStorage.setItem('myBasketForProduct', JSON.stringify(arrayForProduct));
  localStorage.getItem('deleteArraypoduct');
  addToCartValidation();
  displayProductsInATable ( arrayForProduct, unitPrice, unitPriceForAppending );
}

/**
 * @param arrayForProduct -> displaying the items of array of product
 * @param unitPrice  -> unit price is a flag value if true than it will be displaying the unit prices
 *  in a new column
 */
const displayProductsInATable = ( arrayForProduct, unitPrice, unitPriceForAppending ) => {
  $('.totalPrice').text(' ');
  $('.unitPriceTotal').text(' ');
  tableBody = $('table tbody');
  tableBody.empty();
  let rowAddingNumber = 0;
  sumTotal = 0;
  unitPriceForAppending = 0;

  for (productObjectForArray of arrayForProduct) {
    rowAddingNumber += 1;
    let productRowInsertionOfValues = `<tr data-product-id="${productObjectForArray.productIdForAdding}">
            <td>${rowAddingNumber}</td> 
            <td>${productObjectForArray.productName}</td>
            <td>${productObjectForArray.productPrice}</td>
            <td>${productObjectForArray.productQuantity}</td>
            <td><button class="removeProduct"> Remove </button></td>
            <td><button class="removeQuant"> - </button></td>
            <td><button class="addQuant"> + </button></td> `;
    if (unitPrice) {
      productObjectForArray.UnitPriceForAppending =
        productObjectForArray.productPrice -
        productObjectForArray.productPrice * DISCOUNT_FOR_ITEMS;
      productRowInsertionOfValues += `<td class="salePrice">${productObjectForArray.UnitPriceForAppending}</td>`;
    }
    ` </tr>`;
    tableBody.append(productRowInsertionOfValues);
    sumTotal += parseFloat(productObjectForArray.productPrice);
    unitPriceForAppending += parseFloat(
      productObjectForArray.UnitPriceForAppending,
    );
    salePriceTotal = unitPriceForAppending;

    document.querySelector('.totalPrice').innerText = sumTotal;
    document.querySelector('.unitPriceTotal').innerText = unitPriceForAppending || 0;

    document.querySelectorAll('.removeProduct').forEach((value) => {
      value.addEventListener('click', deleteProduct);

    document.querySelectorAll('.removeQuant').forEach((value) => {
        value.addEventListener('click', removeQuantity);
      });

    document.querySelectorAll('.addQuant').forEach((value) => {
        value.addEventListener('click', addQuantity);
      });
    });
  }
}

const addToCartValidation = () => {
  inputValidation = document.querySelectorAll('.couponValidation')[0].value;

  if (inputValidation.match(ORDER_REGEX)) {
    discountOnTotal = sumTotal - sumTotal * DISCOUNT_FOR_ITEMS;
    document.querySelector('.afterdiscount').innerHTML =
      '<b> The Total Price is :' + discountOnTotal + '</b>';
  }

  if (inputValidation.match(PRODUCT_REGEX)) {
    unitPrice = true;
    displayProductsInATable(arrayForProduct, unitPrice);
    discountOnTotal = sumTotal - sumTotal * DISCOUNT_FOR_ITEMS;
    document.querySelector('.afterdiscount').innerHTML =
      '<b> The Total Price is :' + discountOnTotal + '</b>';
  }
}

// This function will be validating the coupons and will be invoked on the basis of the regex defined
const onValidateCoupon = ( ) => {
  inputValidation = document.querySelectorAll('.couponValidation')[0].value;

  if (
    !inputValidation.match(ORDER_REGEX) &&
    !inputValidation.match(PRODUCT_REGEX)
  ) {
    document.querySelector('.appliedCouponOnce').innerHTML = 'Invalid Coupon';
  } else {
    if (inputValidation.match(ORDER_REGEX)) {
      if (clickedOrderTimes !== 1) {
        console.log(salePriceTotal);
        if (salePriceTotal > 0) {
          discountOnTotal =
            salePriceTotal - salePriceTotal * DISCOUNT_FOR_ITEMS;
          document.querySelector('.afterdiscount').innerHTML =
            '<b> The Total Price is :' + discountOnTotal + '</b>';
          let tempClickedTimes = clickedOrderTimes + 1;
          clickedOrderTimes = tempClickedTimes;
        } else if (salePriceTotal !== NaN) {
          console.log(salePriceTotal, sumTotal);
          discountOnTotal = sumTotal - sumTotal * DISCOUNT_FOR_ITEMS;
          document.querySelector('.afterdiscount').innerHTML =
            '<b> The Total Price is :' + discountOnTotal + '</b>';
          let tempClickedTimes = clickedOrderTimes + 1;
          clickedOrderTimes = tempClickedTimes;
        }
      } else {
        document.querySelector('.appliedCouponOnce').innerHTML =
          'Order Applied Already';
      }
    }

    if (inputValidation.match(PRODUCT_REGEX)) {
      if (clickedProductTimes !== 1) {
        unitPrice = true;
        displayProductsInATable(arrayForProduct, unitPrice);
        let tempClickedTimes = clickedProductTimes + 1;
        clickedProductTimes = tempClickedTimes;
      } else {
        document.querySelector('.appliedCouponOnce').innerHTML = ' Product Applied Already';
      }
    }
  }
}

//Deleting the product depending on the product quantity
const deleteProduct = ( event ) => {
  let productId = event.target.parentNode.parentNode.dataset.productId;
  let foundProduct = arrayForProduct.find( (product) => product['productIdForAdding'] === productId, );
  arrayForProduct.splice(arrayForProduct.indexOf(foundProduct), 1);
  sumTotal -= parseFloat(foundProduct.productPrice);
  discountOnTotal = sumTotal - sumTotal * DISCOUNT_FOR_ITEMS;
  document.querySelector('.afterdiscount').innerHTML = 'The Total Price is: ' + discountOnTotal;
  localStorage.setItem('myBasketForProduct', JSON.stringify(arrayForProduct));
  displayProductsInATable( arrayForProduct );
}

const removeQuantity = ( event ) => {
  let productId = event.target.parentNode.parentNode.dataset.productId;
  let foundProduct = arrayForProduct.find( (product) => product['productIdForAdding'] === productId, );
  if (Object.keys(productId).length) {
    if (foundProduct['productQuantity'] <= 5 && foundProduct['productQuantity'] > 1) {
      foundProduct['productQuantity'] -= 1;
      foundProduct['productPrice'] = foundProduct['productSellingPrice'] * foundProduct['productQuantity'];
      displayProductsInATable( arrayForProduct, unitPrice );
    }
  }
}

const addQuantity = (event) => {
  let productId = event.target.parentNode.parentNode.dataset.productId;
  let foundProduct = arrayForProduct.find( (product) => product['productIdForAdding'] === productId,);
  if (Object.keys(productId).length) {
    if (foundProduct['productQuantity'] < 5) {
      foundProduct['productQuantity'] += 1;
      foundProduct['productPrice'] = foundProduct['productSellingPrice'] * foundProduct['productQuantity'];
      displayProductsInATable( arrayForProduct, unitPrice );
    }
  }
};

const orderTotalDiscound = (event) => {
  let productId = event.target.parentNode.parentNode.dataset.productId;
  let foundProduct = arrayForProduct.find( (product) => product['productIdForAdding'] === productId,);
  if (Object.keys(productId).length) {
    // if ( ) {

    // }
  }

}