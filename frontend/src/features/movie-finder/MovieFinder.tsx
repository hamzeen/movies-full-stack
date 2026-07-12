import { useEffect, useState } from "react";
import { RecentSearches } from "./components/RecentSearches";
import { SearchPanel } from "./components/SearchPanel";
import { SelectedMovie } from "./components/SelectedMovie";
import { useMovieSearch } from "./hooks/useMovieSearch";
import type { Movie } from "./types";
import {
    MAX_RECENT_MOVIES,
    readRecentMovies,
    writeRecentMovies,
} from "./utils/storage";

export function MovieFinder() {
    const [query, setQuery] = useState("");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [recentMovies, setRecentMovies] = useState<Movie[]>(readRecentMovies);

    const {
        results,
        status,
        errorMessage,
        search,
        resetSearch,
        selectSearchResult,
    } = useMovieSearch();

    useEffect(() => {
        writeRecentMovies(recentMovies);
    }, [recentMovies]);

    const visibleMovies = query.trim() ? results : recentMovies;

    const handleQueryChange = (value: string) => {
        setQuery(value);

        if (!value.trim()) {
            setSelectedMovie(null);
            resetSearch();
            return;
        }

        void search(value);
    };

    const selectMovie = (movie: Movie) => {
        setQuery(movie.name);
        setSelectedMovie(movie);
        selectSearchResult(movie);

        setRecentMovies((currentMovies) =>
            [
                movie,
                ...currentMovies.filter(
                    (currentMovie) => currentMovie.id !== movie.id,
                ),
            ].slice(0, MAX_RECENT_MOVIES),
        );
    };

    return (
        <div className="min-h-screen bg-transparent text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
                <SearchPanel
                    query={query}
                    movies={visibleMovies}
                    status={status}
                    errorMessage={errorMessage}
                    onQueryChange={handleQueryChange}
                    onSelectMovie={selectMovie}
                />

                <main className="mt-6 grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.75fr]">
                    <SelectedMovie movie={selectedMovie} />

                    <RecentSearches movies={recentMovies} onSelectMovie={selectMovie} />
                </main>
            </div>
        </div>
    );
}
