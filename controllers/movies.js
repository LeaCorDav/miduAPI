import { validateMovie, validatePartialMovie } from "../schemes/movies.js"

// Patron de diseño: Inyeccion de Dependencias
export class MovieController {
    // Constructor
    constructor({ movieModel }) {
        this.movieModel = movieModel
    }

    // Retorna todas las peliculas o por genero -------------------------
    getAll = async (req, res) => {
        // Extrae queries
        const { genre } = req.query

        // Usa el Modelo
        const movies = await this.movieModel.getAll({genre})

        // Si no trae query params
        res.json(movies)
    }


    // Retorna las peliculas por id -------------------------
    getById = async (req, res) => {
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const movie = await this.movieModel.getById({id})
        if(movie) return res.json(movie)
        
        // Caso de error
        res.status(404).json({message: "No se encuentra la pelicula"})
    }


    // Carga nueva pelicula -------------------------
    create = async(req, res) => {    
        // Agrega validacion con esquemas de Zot
        const result = validateMovie(req.body)
    
        // Valida si hay error en base a la validacion del esquema
        if(!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message)})
        }
    
        // Usa el Modelo
        const newMovie = await this.movieModel.create({input: result.data})
    
        // Responde con un success 201 y retorna el nuevo item para actualizar el cache del cliente
        res.status(201).json(newMovie)
    }


    // Borra una pelicula especifica -------------------------
    delete = async(req, res) => {
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const result = await this.movieModel.delete({id})
    
        // Caso de error
        if(!result) return res.status(404).json({message: "No se encuentra la pelicula"})
        
    
        return res.json({ message: "Pelicula eliminada" })
    }


    // Actualiza algunos datos de una pelicula especifica -------------------------
    update = async(req, res) => {
        // Valida el esquema de la propiedad que se quiere modificar
        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        
        // Extrae el parametro dinamico
        const  { id } = req.params
        
        // Usa el Modelo
        const updatedMovie = await this.movieModel.update({id, input: result.data})
    
        // Caso de error
        if(!updatedMovie) return res.status(404).json({message: "No se encuentra la pelicula"})
    
        
        // Retorna el json de la pelicula modificada para actualizar cache
        return res.json(updatedMovie)    
    }
}