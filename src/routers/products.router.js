import { Router } from "express";
import ProductManager from "../utils/productManager.js";
import io from "../server.js";
import { __dirname } from "../utilities.js";
import path from "path";



const router = Router();
const productManager = new ProductManager(path.join(__dirname,'./products.json'));

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await productManager.getProducts();
    console.log(products);

    if (limit && !isNaN(parseInt(limit, 10))) {
      const limitNumber = parseInt(limit, 10);
      products = products.slice(0, limitNumber);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(parseInt(productId));

    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  console.log(product);
  const addedProduct = await productManager.addProduct(product);
  console.log(addedProduct);
  io.emit("newProduct", addedProduct);
  res.status(201).json(addedProduct);
});

router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    // Llamada a la función de actualización en el ProductManager
    const result = await productManager.updateProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      parseInt(productId)
    );

    if (result.error) {
      return res.status(404).send(result.error); // Producto no encontrado
    }

    return res.status(200).json(result); // Producto actualizado con éxito
  } catch (error) {
    return res.status(500).send("Error al actualizar el producto"); // Error interno del servidor
  }
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    await productManager.deleteProduct(parseInt(productId));
    io.emit("deleteProduct", productId);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "Producto eliminado" });
});

export default router;
