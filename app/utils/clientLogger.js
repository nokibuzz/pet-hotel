export async function logEvent({ level = "info", message, context = {} }) {
    try {
        await fetch("/api/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level, message, context }),
        });
    } catch (error) {
     console.error(error);   
    }
}
