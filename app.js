/* con MODULES */
import express from "express"
import { moviesRouter } from "./routes/movies.js"
import { corsMiddleware } from "./middlewares/cors.js"


const app = express()
app.use(express.json())
app.use(corsMiddleware())
app.disable("x-powered-by")

// HOME
app.get("/", (req, res) => {
    res.json({ message: "hola mundo" })
})


// USA ENRUTADO
app.use("/movies", moviesRouter)


// LISTEN
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
    console.log(`Server escuchando al puerto http://localhost:${PORT}`);
})