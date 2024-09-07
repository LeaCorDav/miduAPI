import mysql from "mysql2/promise"
/* import dotenv from 'dotenv';
dotenv.config(); */

// Config para BD local
const DEFALUT_CONFIG = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Grandragon1",
    database: "moviesdb"
}
const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

const connection = await mysql.createConnection(DB_CONFIG)


export class MovieModel {
    // Retorna todas las peliculas o por genero -------------------------
    static async getAll ({genre}) {
        if(genre) {
            const lowercaseGenre = genre.toLowerCase()

            // Extrae los ids de genres de DB usando el genre que se intenta buscar
            const [genres] = await connection.query(
                // Selecciona el ID y el nombre del genero de la DB usando el nombre
                "SELECT id, name FROM genre WHERE LOWER(name) = ?;", [lowercaseGenre]
            )

            // Si no se encuentra el genre
            if(genres.length === 0) return []

            // Extrae el ID del genero
            const [{ id }] = genres
            
            // JOIN
            const [moviesByGenre] = await connection.query(
                `SELECT title 
                FROM movie 
                INNER JOIN movie_genres ON movie.id = movie_genres.movie_id 
                WHERE movie_genres.genre_id = ?;`, [id]
            )
            
            return moviesByGenre            
        }


        const [movies] = await connection.query(
            "SELECT BIN_TO_UUID(id), title, year, director, duration, poster, rate FROM movie;"
        )
        return movies        
    }


    // Retorna las peliculas por id -------------------------
    static async getById ({id}) {
        // Extrae toda la info de una pelicula por su ID
        const [movie] = await connection.query(
            "SELECT * FROM movie WHERE id = UUID_TO_BIN(?);", [id]
        )

        if(movie.length === 0) return "No existe la pelicula"

        return movie
    }


    // Carga nueva pelicula -------------------------
    static async create({input}) {
        // Extrae los campos del input del usuario
        const {
            title,
            year,
            director,
            duration,
            poster,
            genre,
            rate
        } = input

        // Genera un UUID
        const [uuidResult] = await connection.query("SELECT UUID() uuid;")
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
                VALUES (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);`, [uuid, title, year, director, duration, poster, rate]
            )
        } catch(err) {
            console.log(err);
        }
        
        // Retorna la pelicula
        const [movie] = await connection.query(
            "SELECT * FROM movie WHERE id = UUID_TO_BIN(?);", [uuid]
        )
        return movie        
    }


    // Borra una pelicula especifica -------------------------
    static async delete({id}) {
        // Busca la pelicula a eliminar
        const [movie] = await connection.query(
            "SELECT * FROM movie WHERE id = UUID_TO_BIN(?);", [id]
        )

        // Caso que no exista la pelicula
        if(movie.length === 0) return false

        // Si encuentra la pelicula trata de eliminarla
        await connection.query(
            "DELETE FROM movie WHERE id = UUID_TO_BIN(?);", [id]
        )
        return true
    }


    // Actualiza algunos datos de una pelicula especifica -------------------------
    static async update({id, input}) {
        // Busca la pelicula
        const [movie] = await connection.query(
            "SELECT * FROM movie WHERE id = UUID_TO_BIN(?);", [id]
        )

        // Caso de error
        if(movie.length === 0) return false

        // Extrae el key y el valor del input
        const keys = Object.keys(input)
        const values = Object.values(input)

        // Construye la consulta SQL cuando hay varios inputs
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        
        // Actualiza la pelicula
        await connection.query(
            `UPDATE movie 
            SET ${setClause} 
            WHERE id = UUID_TO_BIN(?);`, [...values, id]
        )
        
        // Consulta la pelicula actualizada
        const [updatedMovie] = await connection.query(
            "SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);", 
            [id]
        )
        return updatedMovie
    }
}