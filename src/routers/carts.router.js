import { Router } from "express";
import CartManager from "../utils/cartManager.js";
import ProductManager from "../utils/productManager.js";
const router = Router();
const cartManager = new CartManager("./carts.json");
const productManager = new ProductManager("./products.json");

router.post("/", async (req, res) => {
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
});

export default router;
