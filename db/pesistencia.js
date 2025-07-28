import { MongoClient } from "mongodb";

const uri = "mongodb+srv://nicoloe24:NIcol12345@nicole.m2m1ow1.mongodb.net/"

const client = new MongoClient(uri);

export async function ingredientes() {
    await client.connect()
    const db = client.db("pizza_punto");
    const coleccion = db.collection("ingredientes")
    return coleccion
};

export async function clientes() {
    await client.connect()
    const db = client.db("pizza_punto");
    const coleccion = db.collection("clientes")
    return coleccion
};

export async function pedidos() {
    await client.connect()
    const db = client.db("pizza_punto");
    const coleccion = db.collection("pedidos")
    return coleccion
};

export async function pizzas() {
    await client.connect()    
    const db = client.db("pizza_punto");
    const coleccion = db.collection("pizzas")
    return coleccion
};

export async function repartidores() {
    await client.connect()
    const db = client.db("pizza_punto");
    const coleccion = db.collection("repartidores")
    return coleccion
};