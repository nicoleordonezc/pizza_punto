import { pizzas } from "../db/pesistencia";
import { pedidos } from "../db/pesistencia";

export async function calcularIngredientes() {
    const pizzas = await pizzas()
    const pedidos = await pedidos()

    const busqueda = await pedidos.aggregate([
        {
            $lookup:{
                from: pizzas,
                localField: ""
            }
        }
    ])
}