import cors from "cors"


const ACCEPTED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:4321",
    "http://leandro-cordero.com"
]

export const corsMiddleware = () => cors({
    origin: (origin, callback) => {
        if (ACCEPTED_ORIGINS.includes(origin)) {
            return callback(null, true)
        }

        if(!origin) {
            return callback(null, true)
        }

        return callback(new Error("No permitido por CORS"))
    }
})