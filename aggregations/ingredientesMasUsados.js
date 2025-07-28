import { pedidos } from "../db/pesistencia.js";

export async function calcularIngredientes() {
    const pedidoInfo = await pedidos()

    const busqueda = await pedidoInfo.aggregate([
    {$match: {
        fecha:{
            $gte: new Date("2025-06-27"), 
            $lte: new Date("2025-07-27")}
    }},
    {$lookup: {
      from: "pizzas",
      localField: "pizzas",
      foreignField: "nombre",
      as: "pizzaInfo"
    }
    },
    {
        $unwind: "$pizzaInfo"
    },
    {
        $unwind: "$pizzaInfo.ingredientes"
    },
    {
        $group: {
        _id: "$pizzaInfo.ingredientes",
        cantidadUsos: { $sum: 1 }
        }
    },
    {
        $sort: { cantidadUsos: -1 }
    }]).toArray();

    console.log(busqueda);
    
}