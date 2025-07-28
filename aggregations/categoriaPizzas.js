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
    
    if (busqueda.length > 0) {
        const { _id: categoria, totalVendidas } = busqueda[0];
        console.log(`🍕 La categoría de pizzas con más ventas históricas es: **${categoria.toUpperCase()}**, con un total de **${totalVendidas} ventas**.`);
    } else {
        console.log("❌ No se encontraron datos de ventas.");
    }
}