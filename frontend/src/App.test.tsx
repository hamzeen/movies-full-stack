import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import type { Movie } from "./features/movie-finder/types";

const RECENT_KEY = "movie-search-recent";

const dune: Movie = {
    id: 1,
    name: "Dune",
    description: "Paul Atreides joins the Fremen on Arrakis.",
    year: 2021,
    genres: ["Science Fiction", "Adventure"],
    actors: ["Timothée Chalamet", "Rebecca Ferguson"],
    directors: ["Denis Villeneuve"],
    imageUrl: "/images/dune.jpg",
    thumbnailUrl: "/images/dune-thumbnail.jpg",
    rating: 8.1,
    duration: "PT2H35M",
};

const arrival: Movie = {
    ...dune,
    id: 2,
    name: "Arrival",
    description: "A linguist works to communicate with visitors from another world.",
    year: 2016,
    actors: ["Amy Adams", "Jeremy Renner"],
    rating: 7.9,
    duration: "PT1H56M",
};

function movieResponse(movies: Movie[]): Response {
    return {
        ok: true,
        json: async () => movies,
    } as Response;
}

function invalidMovieResponse(payload: unknown): Response {
    return {
        ok: true,
        json: async () => payload,
    } as Response;
}

function failedResponse(): Response {
    return {
        ok: false,
        json: async () => ({}),
    } as Response;
}

function deferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    const promise = new Promise<T>((promiseResolve) => {
        resolve = promiseResolve;
    });

    return { promise, resolve };
}

function mockMovieSearch(movies: Movie[]) {
    vi.mocked(fetch).mockResolvedValue(movieResponse(movies));
}

async function searchForMovie(query: string) {
    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText("Search for a movie title");

    await user.type(searchInput, query);

    return { user, searchInput };
}

describe("Movie explorer", () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("shows the initial guidance and focuses the movie search", () => {
        render(<App />);

        expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
        expect(screen.getByText("No recent selections yet.")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search for a movie title")).toHaveFocus();
        expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    });

    it("searches for movies, displays the selected movie, and saves it as a recent pick", async () => {
        mockMovieSearch([dune]);
        render(<App />);

        const { user } = await searchForMovie("Dune");

        expect(await screen.findByRole("option", { name: /Dune.*2021/i })).toBeInTheDocument();
        expect(fetch).toHaveBeenLastCalledWith(
            "/api/v1/movies/search?q=Dune&limit=10",
            expect.objectContaining({ signal: expect.any(AbortSignal) }),
        );

        const requestCountBeforeSelection = vi.mocked(fetch).mock.calls.length;

        await user.click(screen.getByRole("option", { name: /Dune.*2021/i }));

        expect(screen.getByRole("heading", { name: "Selected movie" })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3, name: "Dune" })).toBeInTheDocument();
        expect(screen.getByText("8.1")).toBeInTheDocument();
        expect(screen.getByText("2 hours: 35 mins")).toBeInTheDocument();
        expect(screen.getByText(/Timothée Chalamet, Rebecca Ferguson/)).toBeInTheDocument();
        expect(screen.getByText(/Denis Villeneuve/)).toBeInTheDocument();
        expect(screen.getByText("Science Fiction")).toBeInTheDocument();
        expect(fetch).toHaveBeenCalledTimes(requestCountBeforeSelection);

        const recentPicks = screen.getByRole("heading", { name: "Recent picks" }).closest("aside");
        expect(recentPicks).not.toBeNull();
        expect(
            within(recentPicks!).getByRole("button", { name: /Dune.*2021/i }),
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]")).toEqual([dune]);
        });
    });

    it("keeps the newest search results when an older request finishes later", async () => {
        const duneRequest = deferred<Response>();
        const arrivalRequest = deferred<Response>();

        vi.mocked(fetch).mockImplementation((input) => {
            const url = String(input);

            if (url.includes("q=Dune")) {
                return duneRequest.promise;
            }

            if (url.includes("q=Arrival")) {
                return arrivalRequest.promise;
            }

            return Promise.resolve(movieResponse([]));
        });

        render(<App />);
        const searchInput = screen.getByPlaceholderText("Search for a movie title");

        fireEvent.change(searchInput, { target: { value: "Dune" } });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "/api/v1/movies/search?q=Dune&limit=10",
                expect.any(Object),
            );
        });

        fireEvent.change(searchInput, { target: { value: "Arrival" } });
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "/api/v1/movies/search?q=Arrival&limit=10",
                expect.any(Object),
            );
        });

        arrivalRequest.resolve(movieResponse([arrival]));
        expect(await screen.findByRole("option", { name: /Arrival.*2016/i })).toBeInTheDocument();

        duneRequest.resolve(movieResponse([dune]));
        await waitFor(() => {
            expect(screen.queryByRole("option", { name: /Dune.*2021/i })).not.toBeInTheDocument();
        });
    });

    it("does not repeat a search when only surrounding whitespace changes", async () => {
        mockMovieSearch([dune]);
        render(<App />);

        const searchInput = screen.getByPlaceholderText("Search for a movie title");

        fireEvent.change(searchInput, { target: { value: "Dune" } });
        await screen.findByRole("option", { name: /Dune.*2021/i });

        const requestCount = vi.mocked(fetch).mock.calls.length;

        fireEvent.change(searchInput, { target: { value: " Dune " } });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(requestCount);
        });
    });

    it("shows an empty result message when no movies match", async () => {
        mockMovieSearch([]);
        render(<App />);

        await searchForMovie("Unknown title");

        expect(await screen.findByText("No matches found.")).toBeInTheDocument();
    });

    it("shows a search error instead of reporting that no movies matched", async () => {
        vi.mocked(fetch).mockResolvedValue(failedResponse());
        render(<App />);

        await searchForMovie("Dune");

        const alert = await screen.findByRole("alert");

        expect(alert).toHaveTextContent("Unable to load movie suggestions. Please try again.");
        expect(screen.queryByText("No matches found.")).not.toBeInTheDocument();
    });

    it("rejects an invalid API response safely", async () => {
        vi.mocked(fetch).mockResolvedValue(invalidMovieResponse([{ id: 1, name: "Incomplete" }]));
        render(<App />);

        await searchForMovie("Incomplete");

        expect(
            await screen.findByText("Unable to load movie suggestions. Please try again."),
        ).toBeInTheDocument();
    });

    it("supports keyboard navigation and selection", async () => {
        mockMovieSearch([dune, arrival]);
        render(<App />);

        const { user, searchInput } = await searchForMovie("D");

        await screen.findByRole("option", { name: /Dune.*2021/i });
        await user.type(searchInput, "{ArrowDown}{Enter}");

        expect(screen.getByRole("heading", { level: 3, name: "Dune" })).toBeInTheDocument();
        expect(searchInput).toHaveValue("Dune");
    });

    it("clears the selected movie when the search query is cleared", async () => {
        mockMovieSearch([dune]);
        render(<App />);

        const { user, searchInput } = await searchForMovie("Dune");
        await user.click(await screen.findByRole("option", { name: /Dune.*2021/i }));

        expect(screen.getByRole("heading", { name: "Selected movie" })).toBeInTheDocument();

        await user.clear(searchInput);

        expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { level: 3, name: "Dune" })).not.toBeInTheDocument();
    });

    it("restores only valid entries from the six most recent stored picks", async () => {
        const storedMovies = Array.from(
            { length: 7 },
            (_, index): Movie => ({
                ...dune,
                id: index + 1,
                name: `Movie ${index + 1}`,
                year: 2000 + index,
            }),
        );

        window.localStorage.setItem(
            RECENT_KEY,
            JSON.stringify([...storedMovies, { id: "invalid" }]),
        );
        render(<App />);

        const recentPicks = screen.getByRole("heading", { name: "Recent picks" }).closest("aside");
        expect(recentPicks).not.toBeNull();

        await waitFor(() => {
            expect(within(recentPicks!).getAllByRole("button")).toHaveLength(6);
        });

        expect(within(recentPicks!).getByText("Movie 1")).toBeInTheDocument();
        expect(within(recentPicks!).queryByText("Movie 7")).not.toBeInTheDocument();

        await waitFor(() => {
            expect(JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]")).toHaveLength(6);
        });
    });
});
