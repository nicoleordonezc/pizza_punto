let cliente1 = db.clientes.insertOne({ "nombre": "Ana Torres", "telefono": "123-123-1234", "direccion": "calle 101#1-1" }).insertedId;
let cliente2 = db.clientes.insertOne({ "nombre": "Laura Rojas",  "telefono": "234-234-2345", "direccion": "calle 102#2-2" }).insertedId;
let cliente3 = db.clientes.insertOne({ "nombre": "Sofia Pérez", "telefono": "345-345-3456", "direccion": "calle 102#3-3" }).insertedId;
let cliente4 = db.clientes.insertOne({ "nombre": "María Díaz", "telefono": "456-456-4567", "direccion": "calle 104#4-4" }).insertedId;
let cliente5 = db.clientes.insertOne({ "nombre": "Camila Ruiz","telefono": "567-567-5678", "direccion": "calle 105#5-5" }).insertedId;