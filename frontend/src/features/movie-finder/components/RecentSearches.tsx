import type { Movie } from "../types";

type RecentSearchesProps = {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
};

export function RecentSearches({ movies, onSelectMovie }: RecentSearchesProps) {
    return (
        <aside className="rounded-[2rem] border border-slate-200/80 p-5 sm:p-6 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.2)]">
            <h2 className="text-xl font-semibold text-slate-950">Recent picks</h2>

            <ul className="mt-4 space-y-2">
                {movies.length === 0 ? (
                    <li className="rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-600">
                        No recent selections yet.
                    </li>
                ) : (
                    movies.map((movie) => (
                        <li key={movie.id}>
                            <button
                                type="button"
                                onClick={() => onSelectMovie(movie)}
                                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100">
                                <span>{movie.name}</span>

                                <span className="text-slate-500">{movie.year}</span>
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </aside>
    );
}
