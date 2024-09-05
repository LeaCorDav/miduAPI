
import { Router } from "express";
import { MovieController } from "../controllers/movies.js";


export const moviesRouter = Router()


// Retorna todas las peliculas o por genero -------------------------
moviesRouter.get("/", MovieController.getAll)

// Retorna las peliculas por id -------------------------
moviesRouter.get("/:id", MovieController.getById)

// Carga nueva pelicula -------------------------
moviesRouter.post("/", MovieController.create)

// Actualiza algunos datos de una pelicula especifica -------------------------
moviesRouter.patch("/:id", MovieController.update)

// Borra una pelicula especifica -------------------------
moviesRouter.delete("/:id", MovieController.delete)