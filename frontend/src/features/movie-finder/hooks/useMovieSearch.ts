import { useCallback, useEffect, useReducer, useRef } from "react";
import type { Movie } from "../types";
import { parseMovieResponse } from "../utils/movieValidation";

const SEARCH_LIMIT = 10;
const SEARCH_ERROR_MESSAGE = "Unable to load movie suggestions. Please try again.";

export type SearchStatus = "idle" | "loading" | "success" | "error";

type SearchState = {
    results: Movie[];
    status: SearchStatus;
    errorMessage: string | null;
};

type SearchAction =
    | { type: "search-started" }
    | { type: "search-succeeded"; movies: Movie[] }
    | { type: "search-failed" }
    | { type: "search-reset" }
    | { type: "movie-selected"; movie: Movie };

const initialSearchState: SearchState = {
    results: [],
    status: "idle",
    errorMessage: null,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
    switch (action.type) {
        case "search-started":
            return {
                results: state.results,
                status: "loading",
                errorMessage: null,
            };
        case "search-succeeded":
            return {
                results: action.movies,
                status: "success",
                errorMessage: null,
            };
        case "search-failed":
            return {
                results: [],
                status: "error",
                errorMessage: SEARCH_ERROR_MESSAGE,
            };
        case "search-reset":
            return initialSearchState;
        case "movie-selected":
            return {
                results: [action.movie],
                status: "success",
                errorMessage: null,
            };
        default:
            return state;
    }
}

export function useMovieSearch() {
    const [state, dispatch] = useReducer(searchReducer, initialSearchState);
    const activeControllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef(0);
    const lastSearchQueryRef = useRef<string | null>(null);

    const cancelActiveRequest = useCallback(() => {
        activeControllerRef.current?.abort();
        activeControllerRef.current = null;
        requestIdRef.current += 1;
    }, []);

    useEffect(() => {
        return () => {
            activeControllerRef.current?.abort();
            requestIdRef.current += 1;
        };
    }, []);

    const resetSearch = useCallback(() => {
        cancelActiveRequest();
        lastSearchQueryRef.current = null;
        dispatch({ type: "search-reset" });
    }, [cancelActiveRequest]);

    const selectSearchResult = useCallback(
        (movie: Movie) => {
            cancelActiveRequest();
            lastSearchQueryRef.current = movie.name.trim();
            dispatch({ type: "movie-selected", movie });
        },
        [cancelActiveRequest],
    );

    const search = useCallback(
        async (rawQuery: string): Promise<void> => {
            const query = rawQuery.trim();

            if (!query) {
                resetSearch();
                return;
            }

            if (lastSearchQueryRef.current === query) {
                return;
            }

            activeControllerRef.current?.abort();

            const controller = new AbortController();
            const requestId = requestIdRef.current + 1;

            activeControllerRef.current = controller;
            requestIdRef.current = requestId;
            lastSearchQueryRef.current = query;
            dispatch({ type: "search-started" });

            try {
                const response = await fetch(
                    `/api/v1/movies/search?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}`,
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("Movie search request failed");
                }

                const payload: unknown = await response.json();
                const movies = parseMovieResponse(payload);

                if (!movies) {
                    throw new Error("Movie search returned an invalid response");
                }

                if (requestIdRef.current === requestId) {
                    dispatch({ type: "search-succeeded", movies });
                }
            } catch (error: unknown) {
                const isAbortError = error instanceof Error && error.name === "AbortError";

                if (!isAbortError && requestIdRef.current === requestId) {
                    lastSearchQueryRef.current = null;
                    dispatch({ type: "search-failed" });
                }
            } finally {
                if (requestIdRef.current === requestId) {
                    activeControllerRef.current = null;
                }
            }
        },
        [resetSearch],
    );

    return {
        ...state,
        search,
        resetSearch,
        selectSearchResult,
    };
}
