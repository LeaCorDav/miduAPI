/* const z = require("zod") */
import z from "zod"

// Esquema de como se debe ingresar una nueva movie
const movieScheme = z.object({
    title: z.string({
        invalid_type_error: "La pelicula debe ser string",
        required_error: "El titulo es requerido"
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url().endsWith(".jpg" || ".png" || ".jpeg"),
    genre: z.array(
        z.enum(["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Thriller", "Sci-Fi", "Anime"])
    ),
    rate: z.number().min(0).max(10)
}) 

// Valida todos los inputs
export function validateMovie(input) {
    return movieScheme.safeParse(input)
}

// Valida los inputs que se necesiten
export function validatePartialMovie(input) {
    return movieScheme.partial().safeParse(input)
}

/* module.exports = {
    validateMovie,
    validatePartialMovie
} */