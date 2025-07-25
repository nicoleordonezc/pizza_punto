let repartidor1 = db.repartidores.insertOne({
    nombre: "Sofía Martínez",
    zona: "Centro",
    estado: "disponible"
  }).insertedId;
  
  let repartidor2 = db.repartidores.insertOne({
    nombre: "Juan Pérez",
    zona: "Norte",
    estado: "ocupado"
  }).insertedId;
  
  let repartidor3 = db.repartidores.insertOne({
    nombre: "Camila Rodríguez",
    zona: "Sur",
    estado: "ocupado"
  }).insertedId;
  
  let repartidor4 = db.repartidores.insertOne({
    nombre: "Diego González",
    zona: "Este",
    estado: "disponible"
  }).insertedId;
  
  let repartidor5 = db.repartidores.insertOne({
    nombre: "Valeria López",
    zona: "Oeste",
    estado: "disponible"
  }).insertedId;
  