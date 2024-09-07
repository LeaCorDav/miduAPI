import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router()

    // Instancia el modelo que usará el controller
    const movieController = new MovieController({ movieModel })
    
    // Retorna todas las peliculas o por genero -------------------------
    moviesRouter.get("/", movieController.getAll)
    
    // Retorna las peliculas por id -------------------------
    moviesRouter.get("/:id", movieController.getById)
    
    // Carga nueva pelicula -------------------------
    moviesRouter.post("/", movieController.create)
    
    // Actualiza algunos datos de una pelicula especifica -------------------------
    moviesRouter.patch("/:id", movieController.update)
    
    // Borra una pelicula especifica -------------------------
    moviesRouter.delete("/:id", movieController.delete)

    
    // La funcion retorna el router con los metodos
    return moviesRouter
}
