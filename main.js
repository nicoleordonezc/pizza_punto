import inquirer from "inquirer";
import { calcularIngredientes } from "./aggregations/ingredientesMasUsados.js";
import { promedioCategoria } from "./aggregations/promedio.js";
import { categoriaPizza } from "./aggregations/categoriaPizzas.js";
import { realizarPedido } from "./transacciones/realizarpedido.js";
import { clientes, pizzas } from "./db/pesistencia.js";

async function mostrarMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([
      {
        type: "list",
        name: "opcion",
        message: "🍕 Bienvenido al sistema de pedidos de Pizza & Punto. ¿Qué deseas hacer?",
        choices: [
          "1. Ver ingredientes más usados",
          "2. Ver promedio de precios por categoría",
          "3. Ver categoría con más ventas históricas",
          "4. Realizar un pedido",
          "5. Salir"
        ],
      },
    ]);

    switch (opcion) {
      case "1. Ver ingredientes más usados":
        await calcularIngredientes();
        break;

      case "2. Ver promedio de precios por categoría":
        await promedioCategoria();
        break;

      case "3. Ver categoría con más ventas históricas":
        await categoriaPizza();
        break;

      case "4. Realizar un pedido":
        await flujoRealizarPedido();
        break;

      case "5. Salir":
        salir = true;
        console.log("👋 ¡Gracias por usar Pizza & Punto!");
        break;
    }
  }
}


async function flujoRealizarPedido() {
  const clientesCol = await clientes();
  const listaClientes = await clientesCol.find().toArray();

  const { clienteElegido } = await inquirer.prompt([
    {
      type: "list",
      name: "clienteElegido",
      message: "Selecciona tu nombre:",
      choices: listaClientes.map(c => ({
        name: `${c.nombre}`
      })),
    },
  ]);

  const pizzasCol = await pizzas();
  const listaPizzas = await pizzasCol.find().toArray();

  const { pizzasSeleccionadas } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "pizzasSeleccionadas",
      message: "Selecciona las pizzas que deseas ordenar:",
      choices: listaPizzas.map(p => ({
        name: `${p.nombre} - $${p.precio}`,
        value: p.nombre,
      })),
    },
  ]);

  if (pizzasSeleccionadas.length === 0) {
    console.log("⚠️ No seleccionaste ninguna pizza.");
    return;
  }

  // Calcular total a pagar
  const pizzasElegidas = listaPizzas.filter(p => pizzasSeleccionadas.includes(p.nombre));
  const total = pizzasElegidas.reduce((sum, pizza) => sum + pizza.precio, 0);

  console.log("\n🧾 Resumen del pedido:");
  pizzasElegidas.forEach(pizza => {
    console.log(`🍕 ${pizza.nombre} - $${pizza.precio}`);
  });
  console.log(`\n💰 Total a pagar: $${total}\n`);

  // Confirmar pedido
  const { confirmar } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmar",
      message: "¿Deseas confirmar el pedido?",
    },
  ]);

  if (confirmar) {
    await realizarPedido(clienteElegido, pizzasSeleccionadas);
    console.log("✅ Pedido realizado con éxito.\n");
  } else {
    console.log("❌ Pedido cancelado.\n");
  }
}

mostrarMenu();
