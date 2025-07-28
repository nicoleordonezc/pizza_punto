import { ingredientes, pizzas, pedidos, repartidores, client } from "../db/pesistencia.js";

export async function realizarPedido(clienteId, pizzasSolicitadas) {
    const pizzasColeccion = await pizzas();
    const pedidosColeccion = await pedidos();
    const repartidoresColeccion = await repartidores();
    const ingredientesColeccion = await ingredientes()

    const session = client.startSession();

    try {
        await session.withTransaction(async ()=>{
            // 1. Obtener detalles de las pizzas solicitada
        const pizzasDetalles = await pizzasColeccion
        .find({ nombre: { $in: pizzasSolicitadas } })
        .toArray();

      if (pizzasDetalles.length !== pizzasSolicitadas.length) {
        throw new Error("Una o más pizzas no existen.");
      }
       // 2. Contar ingredientes necesarios
          const ingredientesRequeridos = {};

      for (const pizza of pizzasDetalles) {
        for (const ing of pizza.ingredientes) {
          ingredientesRequeridos[ing] = (ingredientesRequeridos[ing] || 0) + 1;
        }
      }

      // 3. Verificar inventario de ingredientes
      const ingredientesInventario = await ingredientesColeccion
        .find({ nombre: { $in: Object.keys(ingredientesRequeridos) } })
        .toArray();

      for (const ing of ingredientesInventario) {
        const requerido = ingredientesRequeridos[ing.nombre];
        if (ing.stock < requerido) {
          throw new Error(`Ingrediente insuficiente: ${ing.nombre}`);
        }
      }

      
      // 4. Descontar ingredientes del inventario
      for (const [nombre, cantidad] of Object.entries(ingredientesRequeridos)) {
        await ingredientesColeccion.updateOne(
          { nombre },
          { $inc: { stock: -cantidad } },
          { session }
        );
      }

      // 5. Buscar repartidor disponible
      const repartidor = await repartidoresColeccion.findOne(
        { estado: "disponible" },
        { session }
      );

      if (!repartidor) {
        throw new Error("No hay repartidores disponibles.");
      }

      // 6. Marcar repartidor como ocupado
      await repartidoresColeccion.updateOne(
        { _id: repartidor._id },
        { $set: { estado: "ocupado" } },
        { session }
      );

      // 7. Calcular total
      const total = pizzasDetalles.reduce((sum, pizza) => sum + pizza.precio, 0);

      // 8. Registrar el pedido
      await pedidosColeccion.insertOne(
        {
          clienteId,
          pizzas: pizzasSolicitadas,
          total,
          fecha: new Date(),
          repartidorAsignado: repartidor._id,
        },
        { session }
      );

      console.log("✅ Pedido registrado con éxito");
        })
    } catch (error) {
      console.log("Error en la transacción: ", error)
    }
}
