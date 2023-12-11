import { Router } from 'express';
import ProductModel from '../models/product.model.js';
import io from "../server.js";

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, group, sort } = req.query; // sort: asc | desc
  const opts = { page, limit, sort: { price: sort || 'asc' } };
  const criteria = {};
  if (group) {
    criteria.group = group;
  }
  const result = await ProductModel.paginate(criteria, opts);
  console.log(result);
  res.render('products', buildResponse({ ...result, group, sort }));
  /*const response = buildResponse({ ...result, group, sort });
  res.json(response); */
});

router.post("/", async (req, res) => {
  const product = req.body;
  console.log(product);

  const addedProduct = await ProductModel.create(product);
  console.log(addedProduct);
  io.emit("newProduct", addedProduct);
  // await addedProduct.save()
  res.status(201).json(addedProduct);
  /*const addedProduct = await productManager.addProduct(product);
  console.log(addedProduct);
  io.emit("newProduct", addedProduct);
  res.status(201).json(addedProduct);*/
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    await ProductModel.deleteOne({ _id: productId });
    /*await productManager.deleteProduct(parseInt(productId));*/
    io.emit("deleteProduct", productId);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "Producto eliminado" });
});

const buildResponse = (data) => {
  return {
    status: 'success',
    payload: data.docs.map(product => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.prevPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    nextLink: data.hasNextPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.nextPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
  };
};
export default router;