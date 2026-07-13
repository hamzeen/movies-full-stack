import {
    useEffect,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
} from "react";
import type { SearchStatus } from "../hooks/useMovieSearch";
import type { Movie } from "../types";

type SearchProps = {
    query: string;
    movies: Movie[];
    status: SearchStatus;
    errorMessage: string | null;
    onQueryChange: (query: string) => void;
    onSelectMovie: (movie: Movie) => void;
};

export function SearchPanel({
    query,
    movies,
    status,
    errorMessage,
    onQueryChange,
    onSelectMovie,
}: SearchProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const normalizedActiveIndex =
        activeIndex >= 0 && activeIndex < movies.length ? activeIndex : -1;
    const activeMovie = normalizedActiveIndex >= 0 ? movies[normalizedActiveIndex] : undefined;
    const activeOptionId = activeMovie ? `${listboxId}-option-${activeMovie.id}` : undefined;

    const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setActiveIndex(-1);
        setShowSuggestions(true);
        onQueryChange(event.target.value);
    };

    const handleSelectMovie = (movie: Movie) => {
        setActiveIndex(-1);
        setShowSuggestions(false);
        onSelectMovie(movie);
    };

    const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
        const nextFocusedElement = event.relatedTarget;
        const focusStayedInside =
            nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement);

        if (!focusStayedInside) {
            setActiveIndex(-1);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setActiveIndex(-1);
            setShowSuggestions(false);
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setShowSuggestions(true);

            if (movies.length > 0) {
                setActiveIndex((currentIndex) =>
                    currentIndex >= movies.length - 1 ? 0 : currentIndex + 1,
                );
            }

            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setShowSuggestions(true);

            if (movies.length > 0) {
                setActiveIndex((currentIndex) =>
                    currentIndex <= 0 ? movies.length - 1 : currentIndex - 1,
                );
            }

            return;
        }

        if (event.key === "Enter" && activeMovie) {
            event.preventDefault();
            handleSelectMovie(activeMovie);
        }
    };

    const isLoading = status === "loading";
    const hasCompletedSearch = status === "success";
    const hasSearchError = status === "error";

    return (
        <header className="relative overflow-visible rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.2)] p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6">
                <div className="w-full space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700 bg-gray-100">
                            Movie search
                        </h2>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                        Explore a rich catalog of films in seconds.
                    </h1>

                    <p className="text-sm text-slate-600 sm:text-base">
                        Start typing for live suggestions, then open a pick to see the full movie
                        details.
                    </p>
                </div>

                <div className="w-full" onBlur={handleSearchBlur}>
                    <label
                        htmlFor="movie-search"
                        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 shadow-inner transition focus-within:border-fuchsia-500">
                        <svg
                            className="h-5 w-5 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true">
                            <path
                                d="M21 21l-4.35-4.35"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle cx="11" cy="11" r="6" />
                        </svg>

                        <input
                            id="movie-search"
                            ref={inputRef}
                            type="search"
                            role="combobox"
                            aria-label="Search for a movie title"
                            aria-autocomplete="list"
                            aria-expanded={showSuggestions}
                            aria-controls={listboxId}
                            aria-activedescendant={activeOptionId}
                            value={query}
                            onChange={handleQueryChange}
                            onFocus={() => setShowSuggestions(true)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search for a movie title"
                            autoComplete="off"
                            className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
                        />
                    </label>

                    <div className="mt-3 min-h-[4.25rem]">
                        {showSuggestions && (
                            <div
                                id={listboxId}
                                role="listbox"
                                aria-label="Movie suggestions"
                                className="pointer-events-auto rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-lg">
                                {isLoading && (
                                    <div
                                        role="status"
                                        className="rounded-xl px-3 py-2 text-sm text-slate-500">
                                        Loading suggestions…
                                    </div>
                                )}

                                {!isLoading && !query.trim() && movies.length === 0 && (
                                    <div className="rounded-xl px-3 py-2 text-sm text-slate-500">
                                        Your recent picks will appear here.
                                    </div>
                                )}

                                {!isLoading &&
                                    query.trim() &&
                                    movies.length === 0 &&
                                    hasCompletedSearch && (
                                        <div
                                            role="status"
                                            className="rounded-xl px-3 py-2 text-sm text-slate-500">
                                            No matches found.
                                        </div>
                                    )}

                                {!isLoading && hasSearchError && errorMessage && (
                                    <div
                                        role="alert"
                                        className="rounded-xl px-3 py-2 text-sm text-slate-500">
                                        {errorMessage}
                                    </div>
                                )}

                                {!isLoading &&
                                    !hasSearchError &&
                                    movies.map((movie, index) => {
                                        const isActive = normalizedActiveIndex === index;

                                        return (
                                            <button
                                                id={`${listboxId}-option-${movie.id}`}
                                                key={movie.id}
                                                type="button"
                                                role="option"
                                                tabIndex={-1}
                                                aria-selected={isActive}
                                                onPointerDown={(event) => event.preventDefault()}
                                                onPointerEnter={() => setActiveIndex(index)}
                                                onClick={() => handleSelectMovie(movie)}
                                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-100 ${
                                                    isActive ? "bg-slate-100" : ""
                                                }`}>
                                                <span className="font-medium text-slate-700">
                                                    {movie.name}
                                                </span>

                                                <span className="text-slate-500">{movie.year}</span>
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
