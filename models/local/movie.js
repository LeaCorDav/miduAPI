import crypto from "node:crypto"
import movies from "../../movies.json" with { type: "json" }


export class MovieModel {
    // Retorna todas las peliculas o por genero -------------------------
    // Usa objetos de parametros para permitir extenderlo a futuro con más parametros
    static async getAll ({genre}) {
        // Validacion de acuerdo a queries
        if(genre) {
            return movies.filter(
                // Manera que convierte a minusculas el filtro y el parametro de json
                movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
            )
        }
        return movies
    }


    // Retorna las peliculas por id -------------------------
    static async getById ({id}) {
        // Validacion de acuerdo a queries
        const movie = movies.find(movie => movie.id === id)
        return movie
    }


    // Carga nueva pelicula -------------------------
    static async create({input}) {
        const newMovie = {
            // Asigna un ID unico encriptado
            id: crypto.randomUUID(),
            ...input
        }
    
        // Lo almacena al JSON de movies
        movies.push(newMovie)

        return newMovie
    }


    // Borra una pelicula especifica -------------------------
    static async delete({id}) {
        // Busca la pelicula
        const movieIndex = movies.findIndex(movie => movie.id === id)

        // Caso de error
        if(movieIndex === -1) return false

        // Elimina la pelicula del array
        movies.splice(movieIndex, 1)
        return true
    }


    // Actualiza algunos datos de una pelicula especifica -------------------------
    static async update({id, input}) {
        // Busca la pelicula
        const movieIndex = movies.findIndex(movie => movie.id === id)

        // Caso de error
        if(movieIndex === -1) return false

        // Crea objeto nuevo con la propiedad modificada
        movies[movieIndex] = {
            ...movies[movieIndex],
            ...input
        }
        // Actualiza la pelicula en el json
        return movies[movieIndex]
    }
}