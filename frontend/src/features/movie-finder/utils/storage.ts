import type { Movie } from "../types";
import { parseStoredMovies } from "./movieValidation";

export const RECENT_KEY = "movie-search-recent";
export const MAX_RECENT_MOVIES = 6;

function getLocalStorage(): Storage | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

export function readRecentMovies(): Movie[] {
    const storage = getLocalStorage();

    if (!storage) {
        return [];
    }

    try {
        const storedMovies = storage.getItem(RECENT_KEY);

        if (!storedMovies) {
            return [];
        }

        const parsedMovies = parseStoredMovies(JSON.parse(storedMovies));
        const seenMovieIds = new Set<number>();

        return parsedMovies
            .filter((movie) => {
                if (seenMovieIds.has(movie.id)) {
                    return false;
                }

                seenMovieIds.add(movie.id);
                return true;
            })
            .slice(0, MAX_RECENT_MOVIES);
    } catch {
        return [];
    }
}

export function writeRecentMovies(movies: Movie[]): void {
    const storage = getLocalStorage();

    if (!storage) {
        return;
    }

    try {
        if (movies.length === 0) {
            storage.removeItem(RECENT_KEY);
            return;
        }

        storage.setItem(
            RECENT_KEY,
            JSON.stringify(movies.slice(0, MAX_RECENT_MOVIES)),
        );
    } catch {
        // Storage can be unavailable or full. The in-memory experience still works.
    }
}

