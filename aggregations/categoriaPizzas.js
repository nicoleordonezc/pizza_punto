import { pedidos } from "../db/pesistencia.js";

export async function categoriaPizza() {
    const pedidoInfo = await pedidos();

    const busqueda = await pedidoInfo.aggregate([
    { $unwind: "$pizzas" },
    {
        $lookup: {
        from: "pizzas",
        localField: "pizzas", 
        foreignField: "nombre",
        as: "pizzaInfo"
        }
    },
    { $unwind: "$pizzaInfo" },
    {
        $group: {
        _id: "$pizzaInfo.categoria",
        totalVendidas: { $sum: 1 }
        }
    },
    { $sort: { totalVendidas: -1 } },
    { $limit: 1 }
    ]).toArray();
    
    console.log(busqueda);
}