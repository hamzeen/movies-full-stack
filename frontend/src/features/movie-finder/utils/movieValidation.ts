import type { Movie } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isMovie(value: unknown): value is Movie {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.id === "number" &&
        Number.isInteger(value.id) &&
        typeof value.name === "string" &&
        typeof value.description === "string" &&
        typeof value.year === "number" &&
        Number.isInteger(value.year) &&
        isStringArray(value.genres) &&
        isStringArray(value.actors) &&
        isStringArray(value.directors) &&
        typeof value.imageUrl === "string" &&
        typeof value.thumbnailUrl === "string" &&
        typeof value.rating === "number" &&
        Number.isFinite(value.rating) &&
        typeof value.duration === "string"
    );
}

export function parseMovieResponse(value: unknown): Movie[] | null {
    if (!Array.isArray(value) || !value.every(isMovie)) {
        return null;
    }

    return value;
}

export function parseStoredMovies(value: unknown): Movie[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(isMovie);
}
