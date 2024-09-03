const express = require("express")
const crypto = require("node:crypto")
const movies = require("./movies.json")
const { validateMovie, validatePartialMovie } = require("./schemes/movies")

const app = express()
app.use(express.json())
app.disable("x-powered-by")

// HOME
app.get("/", (req, res) => {
    res.json({ message: "hola mundo" })
})


// Retorna todas las peliculas o por genero
app.get("/movies", (req, res) => {
    // Extrae queries
    const { genre } = req.query

    // Validacion de acuerdo a queries
    if(genre) {
        const filteredMovies = movies.filter(
            // Manera facil pero case sensitive
            //movie => movie.genre.includes(genre)

            // Manera que convierte a minusculas el filtro y el parametro de json
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }

    // Si no trae query params
    res.json(movies)
})


// Retorna las peliculas por id
app.get("/movies/:id", (req, res) => {
    // Extrae el parametro dinamico
    const  { id } = req.params
    // Aisla la validacion
    const movie = movies.find(movie => movie.id === id)

    // Retorna el json de la pelicula especifica
    if(movie) return res.json(movie)
    
    // Caso de error
    res.status(404).json({message: "No se encuentra la pelicula"})
})


const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:4321",
    "http://leandro-cordero.com"
]
// Carga nueva pelicula
app.post("/movies", (req, res) => {
    /* Evita error de CORS: Opcion 1 ------------------------------- */
    // Entrega en el header de la peticion quien puede acceder al recurso
    res.header("Access-Control-Allow-Origin", "http://localhost:8080")
    
    /* Evita error de CORS: Opcion 2 ------------------------------- */
    // Extrae la url de quien hace la peticion
    const origin = req.header("origin")
    // Valida si esta incluida en las urls aceptadas o si es la misma url del servidor porque cuando lo es, no manda el origin en el header
    if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin)
    }

    // Extrae los datos del body de la peticion
    /* const {
        title,
        year,
        director,
        duration,
        poster,
        genre,
        rate
    } = req.body */
    
    // Agrega validacion con esquemas de Zot
    const result = validateMovie(req.body)

    // Valida si hay error en base a la validacion del esquema
    if(result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    const newMovie = {
        // Asigna un ID unico encriptado
        id: crypto.randomUUID(),
        /* title,
        year,
        director,
        duration,
        poster,
        genre,
        rate */
        ...result.data
    }

    // Lo almacena al JSON de movies
    movies.push(newMovie)

    // Responde con un success 201 y retorna el nuevo item para actualizar el cache del cliente
    res.status(201).json(newMovie)
})


// Retorna las peliculas por id
app.patch("/movies/:id", (req, res) => {
    // Valida el esquema de la propiedad que se quiere modificar
    const result = validatePartialMovie(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    
    // Extrae el parametro dinamico
    const  { id } = req.params
    // Busca la pelicula
    const movieIndex = movies.findIndex(movie => movie.id === id)
    
    // Caso de error
    if(movieIndex === -1) return res.status(404).json({message: "No se encuentra la pelicula"})

    // Crea objeto nuevo con la propiedad modificada
    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    // Actualiza la pelicula en el json
    movies[movieIndex] = updatedMovie

    // Retorna el json de la pelicula modificada para actualizar cache
    return res.json(updatedMovie)    
})


// LISTEN
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
    console.log(`Server escuchando al puerto http://localhost:${PORT}`);
})