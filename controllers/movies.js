import { MovieModel } from "../models/mysql/movie.js"
import { validateMovie, validatePartialMovie } from "../schemes/movies.js"

export class MovieController {
    // Retorna todas las peliculas o por genero -------------------------
    static async getAll (req, res) {
        // Extrae queries
        const { genre } = req.query

        // Usa el Modelo
        const movies = await MovieModel.getAll({genre})

        // Si no trae query params
        res.json(movies)
    }


    // Retorna las peliculas por id -------------------------
    static async getById (req, res) {
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const movie = await MovieModel.getById({id})
        if(movie) return res.json(movie)
        
        // Caso de error
        res.status(404).json({message: "No se encuentra la pelicula"})
    }


    // Carga nueva pelicula -------------------------
    static async create(req, res) {    
        // Agrega validacion con esquemas de Zot
        const result = validateMovie(req.body)
    
        // Valida si hay error en base a la validacion del esquema
        if(!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message)})
        }
    
        // Usa el Modelo
        const newMovie = await MovieModel.create({input: result.data})
    
        // Responde con un success 201 y retorna el nuevo item para actualizar el cache del cliente
        res.status(201).json(newMovie)
    }


    // Borra una pelicula especifica -------------------------
    static async delete(req, res) {
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const result = await MovieModel.delete({id})
    
        // Caso de error
        if(!result) return res.status(404).json({message: "No se encuentra la pelicula"})
        
    
        return res.json({ message: "Pelicula eliminada" })
    }


    // Actualiza algunos datos de una pelicula especifica -------------------------
    static async update(req, res) {
        // Valida el esquema de la propiedad que se quiere modificar
        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const updatedMovie = await MovieModel.update({id, input: result.data})
    
        // Caso de error
        if(!updatedMovie) return res.status(404).json({message: "No se encuentra la pelicula"})
    
        
        // Retorna el json de la pelicula modificada para actualizar cache
        return res.json(updatedMovie)    
    }
}