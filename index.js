/* const express = require('express'); */
import express from 'express'
const app = express();

// Middleware para permitir que Express lea JSON en las peticiones POST y PUT
app.use(express.json());

// Array hardcodeado (actúa como nuestra "base de datos" temporal)
let personas = [
  { id: 1, nombre: "Ana", edad: 25 },
  { id: 2, nombre: "Carlos", edad: 30 },
  { id: 3, nombre: "Lucía", edad: 22 }
];

// ==========================================
// 1. OBTENER TODAS LAS PERSONAS (Read All)
// ==========================================
app.get('/personas', (req, res) => {
  res.status(200).json(personas);
});

// ==========================================
// 2. OBTENER UNA PERSONA POR ID (Read One)
// ==========================================
app.get('/personas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const persona = personas.find(p => p.id === id);

  if (!persona) {
    return res.status(404).json({ mensaje: "Persona no encontrada" });
  }

  res.status(200).json(persona);
});

// ==========================================
// 3. CREAR UNA NUEVA PERSONA (Create)
// ==========================================
app.post('/personas', (req, res) => {
  const { nombre, edad } = req.body;

  if (!nombre || !edad) {
    return res.status(400).json({ mensaje: "Nombre y edad son requeridos" });
  }

  const nuevaPersona = {
    id: personas.length > 0 ? personas[personas.length - 1].id + 1 : 1, // Autoincremento simple
    nombre,
    edad: parseInt(edad)
  };

  personas.push(nuevaPersona);
  res.status(201).json({ mensaje: "Persona creada", persona: nuevaPersona });
});

// ==========================================
// 4. ACTUALIZAR UNA PERSONA (Update)
// ==========================================
app.put('/personas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, edad } = req.body;

  const index = personas.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Persona no encontrada" });
  }

  // Actualizamos solo los campos que vengan en la petición, si no, se quedan igual
  personas[index] = {
    ...personas[index],
    nombre: nombre || personas[index].nombre,
    edad: edad ? parseInt(edad) : personas[index].edad
  };

  res.status(200).json({ mensaje: "Persona actualizada", persona: personas[index] });
});

// ==========================================
// 5. ELIMINAR UNA PERSONA (Delete)
// ==========================================
app.delete('/personas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = personas.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Persona no encontrada" });
  }

  // Eliminamos el elemento del array
  const personaEliminada = personas.splice(index, 1);

  res.status(200).json({ mensaje: "Persona eliminada", persona: personaEliminada[0] });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor CRUD corriendo en http://localhost:${PORT}`);
});
