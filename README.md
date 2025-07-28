
# 🍕 Pizza & Punto - Sistema de Pedidos en Consola

Este es un sistema de pedidos de pizzas desarrollado en Node.js, que utiliza **MongoDB** para almacenar datos y realizar consultas avanzadas mediante **Aggregation Framework** y **transacciones**. La aplicación permite a los clientes seleccionar su nombre, elegir una o más pizzas y generar un pedido con confirmación.

---

## 🧩 Descripción del Sistema

Pizza Punto es una aplicación de consola que simula el flujo de pedidos de una pizzería. El sistema se conecta a una base de datos MongoDB y permite:

- Registrar pedidos de clientes.
- Seleccionar múltiples pizzas por pedido.
- Calcular automáticamente el total a pagar.
- Realizar consultas agregadas como:
  - Ingredientes más utilizados.
  - Promedio de precios por categoría.
  - Categoría de pizzas con más ventas.

---

## 🚀 Instrucciones para ejecutar la aplicación

1. Clona el repositorio:

```bash
git clone https://github.com/tu_usuario/pizza_punto.git
cd pizza_punto
````

2. Instala las dependencias:

```bash
npm install
```

3. Configura tu archivo `.env` con la conexión a MongoDB:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=pizza_db
```

4. Ejecuta el archivo principal con Node.js:

```bash
node index.js
```

---

## 📜 Comandos disponibles desde el menú

Una vez iniciada la app, el menú te permitirá ejecutar las siguientes opciones:

* ✅ **Realizar un pedido**
  Selecciona tu nombre y las pizzas que deseas ordenar. Se calculará el total y se insertará el pedido en la base de datos.

* 🍕 **Consultar ingredientes más usados**
  Muestra los ingredientes más recurrentes en todos los pedidos realizados el último mes.

* 📊 **Ver promedio de precios por categoría**
  Calcula el precio promedio de las pizzas agrupadas por categoría.

* 🏆 **Categoría con más ventas**
  Muestra cuál categoría de pizza ha tenido mayor número de ventas históricas.

---

## 🔄 ¿Cómo se estructuran las transacciones?

Las transacciones se utilizan al momento de **realizar un pedido**, para garantizar consistencia entre colecciones como:

* `clientes`
* `pizzas`
* `pedidos`

Se abre una sesión con MongoDB, se crea un documento de pedido con referencias a cliente y pizzas, y se asegura que todo se grabe correctamente o nada se guarde si ocurre un error.

```js
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    await pedidos.insertOne({ cliente, pizzas, fecha: new Date() }, { session });
    // Se pueden agregar más operaciones aquí
  });
} finally {
  await session.endSession();
}
```

---

## 📈 Ejemplos de consultas con Aggregation

### 1. Ingredientes más utilizados del último mes:

```js
[
  {
    $match: {
      fecha: { $gte: fechaHaceUnMes }
    }
  },
  { $unwind: "$pizzas" },
  {
    $lookup: {
      from: "pizzas",
      localField: "pizzas",
      foreignField: "_id",
      as: "pizza"
    }
  },
  { $unwind: "$pizza" },
  { $unwind: "$pizza.ingredientes" },
  {
    $group: {
      _id: "$pizza.ingredientes",
      total: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } }
]
```

---

### 2. Promedio de precios por categoría:

```js
[
  {
    $group: {
      _id: "$categoria",
      promedio: { $avg: "$precio" }
    }
  }
]
```

---

### 3. Categoría de pizzas con más ventas históricas:

```js
[
  { $unwind: "$pizzas" },
  {
    $lookup: {
      from: "pizzas",
      localField: "pizzas",
      foreignField: "_id",
      as: "pizza"
    }
  },
  { $unwind: "$pizza" },
  {
    $group: {
      _id: "$pizza.categoria",
      cantidad: { $sum: 1 }
    }
  },
  { $sort: { cantidad: -1 } },
  { $limit: 1 }
]
```

---

## 👨‍💻 Autores

* Desarrollado por: Nicole Ordoñez.
* Tecnologías: Node.js, Inquirer.js, MongoDB.

---

¡Gracias por usar Pizza Punto! 🍕


