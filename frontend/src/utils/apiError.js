export function normalizeApiError(error, fallbackMessage = "Something went wrong") {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        if (typeof first === "string") return first;
        if (first?.message) return first.message;
    }

    if (error?.message) {
        return error.message;
    }

    return fallbackMessage;
}
