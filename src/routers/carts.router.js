import { Router } from "express";
import CartModel from "../models/cart.model.js";
//import CartManager from "../utils/cartManager.js";
//import ProductManager from "../utils/productManager.js";
const router = Router();
//const cartManager = new CartManager("./carts.json");
//const productManager = new ProductManager("./products.json");

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    console.log('Cart:', cart);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.producto.toString() === req.params.pid
    );
    console.log('Product Index:', productIndex);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const { products } = req.body; // Debes enviar un arreglo de productos

  try {
    const cart = await CartModel.findById(cartId);
    console.log(cart);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Actualizar los productos del carrito
    cart.products = products;
    await cart.save();

    res.json({ message: 'Carrito actualizado con nuevos productos' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(
      (product) => product.producto.toString() === req.params.pid
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    product.quantity = req.body.quantity;
    await cart.save();

    res.json({ message: 'Cantidad del producto actualizada en el carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


/*router.post("/", async (req, res) => {
  const cart = await cartManager.addCart();
  res.json(cart);
});

router.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  console.log(req.params);
  const cart = await cartManager.getCartById(parseInt(req.params.cid));
  console.log("cart", cart);
  const product = await productManager.getProductById(parseInt(req.params.pid));
  console.log("product", product);
  if (!cart || !product) {
    res.status(404).json({ error: "Carrito o producto no encontrado" });
  }
  cartManager.addProductToCart(
    parseInt(req.params.cid),
    parseInt(req.params.pid)
  );
  res.status(200).json({ message: "Producto agregado al carrito" });
});*/

export default router;
