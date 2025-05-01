import axios from "axios";

export async function logEvent({ message, level = "info", userId = undefined , error = undefined }) {
    try {
        axios.post(`/api/log`, { message: message, level: level, userId: userId, error: error });
    } catch (error) {
        console.error('Fatal error for sending log to server:', error); 
    }
}
