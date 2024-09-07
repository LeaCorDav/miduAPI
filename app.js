/* con MODULES */
import 'dotenv/config';  //Debe importarse antes que nada
import express from "express"
import { corsMiddleware } from "./middlewares/cors.js"
import { createMovieRouter } from "./routes/movies.js"
import { MovieModel } from "./models/mysql/movie.js"


const app = express()
app.use(express.json())
app.use(corsMiddleware())
app.disable("x-powered-by")

// HOME
app.get("/", (req, res) => {
    res.json({ message: "hola mundo" })
})


// USA ENRUTADO
app.use("/movies", createMovieRouter({ movieModel: MovieModel }))


// LISTEN
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
    console.log(`Server escuchando al puerto http://localhost:${PORT}`);
})