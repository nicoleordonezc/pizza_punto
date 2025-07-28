import { pizzas } from "../db/pesistencia.js";

export async function promedioCategoria() {
    const pizzasInfo = await pizzas ();

    const busqueda = await pizzasInfo.aggregate([
    {$group: {
      _id: "$categoria",
      promedioPrecio: { $avg: "$precio" }
    }},
    {$sort: { promedioPrecio: -1 }}

    ]).toArray();

    if (busqueda.length > 0) {
      console.log("📊 Promedio de precios por categoría de pizza:\n");
      busqueda.forEach((categoria, index) => {
          console.log(`${index + 1}. 🍕 Categoría: ${categoria._id} - 💰 Promedio: $${categoria.promedioPrecio}`);
      });
  } else {
      console.log("❌ No se encontraron categorías de pizza para calcular el promedio.");
  }
}