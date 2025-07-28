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

      if (busqueda.length > 0) {
        console.log("🧾 Ingredientes más utilizados del 27 de junio al 27 de julio de 2025:\n");
        busqueda.forEach((ingrediente, index) => {
            console.log(`${index + 1}. 🧂 ${ingrediente._id} - ${ingrediente.cantidadUsos} usos`);
        });
    } else {
        console.log("❌ No se encontraron datos de ingredientes utilizados en el rango de fechas especificado.");
    }
}