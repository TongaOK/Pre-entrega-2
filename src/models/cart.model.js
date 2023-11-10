import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define el esquema del carrito
const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ], // Referencia al modelo Producto
  total: Number,
  // Otras propiedades del carrito, si es necesario
});

// Agregar el plugin de paginación al esquema del carrito
cartSchema.plugin(mongoosePaginate);

// Crear el modelo del carrito
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
