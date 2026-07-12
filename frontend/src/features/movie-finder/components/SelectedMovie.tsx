import type { Movie } from "../types";
import { formatDuration } from "../utils/formatDuration";

type SelectedMovieProps = {
    movie: Movie | null;
};

export function SelectedMovie({ movie }: SelectedMovieProps) {
    return (
        <section className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
                <h2
                    className={
                        movie
                            ? "inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600"
                            : "text-xl font-semibold text-slate-950"
                    }>
                    {movie ? "Selected movie" : "How it works"}
                </h2>
            </div>

            {movie ? (
                <div className="mt-5 space-y-5">
                    <h3 className="text-2xl font-semibold leading-tight text-slate-950">
                        {movie.name}
                    </h3>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <MovieMetric label="Year" value={movie.year} />

                        <MovieMetric label="Rating" value={movie.rating.toFixed(1)} />

                        <MovieMetric label="Duration" value={formatDuration(movie.duration)} />
                    </div>

                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_11rem] md:items-start lg:grid-cols-[minmax(0,1fr)_13rem]">
                        <div className="min-w-0 space-y-5">
                            <p className="text-sm leading-7 text-slate-600">{movie.description}</p>

                            <div className="space-y-4 text-sm text-slate-600">
                                <p>
                                    <span className="block font-semibold text-slate-900">
                                        Cast:
                                    </span>
                                    <span>{movie.actors.join(", ")}</span>
                                </p>

                                <p>
                                    <span className="block font-semibold text-slate-900">
                                        Directors:
                                    </span>
                                    <span>{movie.directors.join(", ")}</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="rounded-full bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-500">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mx-auto w-full max-w-60 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm md:mx-0">
                            <img
                                src={movie.thumbnailUrl || "/images/movie-placeholder.svg"}
                                alt={`${movie.name} movie poster`}
                                loading="lazy"
                                decoding="async"
                                onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src = "/images/movie-placeholder.svg";
                                }}
                                className="aspect-[2/3] w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm leading-7 text-slate-600">
                    Choose a movie from the suggestions panel to see its details here. The
                    experience is designed to feel polished on phones first and expand gracefully on
                    larger screens.
                </div>
            )}
        </section>
    );
}

type MovieMetricProps = {
    label: string;
    value: string | number;
};

function MovieMetric({ label, value }: MovieMetricProps) {
    return (
        <div className="rounded-2xl bg-slate-100/80 p-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>

            <p className="mt-1 font-semibold text-slate-900">{value}</p>
        </div>
    );
}
