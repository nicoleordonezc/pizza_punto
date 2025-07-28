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

    console.log(busqueda);
}