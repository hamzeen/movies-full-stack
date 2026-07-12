package com.beatgridmedia.assignment.movie.api

import com.beatgridmedia.assignment.movie.domain.Movie
import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Movie returned by the search API")
data class MovieSummaryResponse(
    @field:Schema(example = "1")
    val id: Int,

    @field:Schema(example = "Inception")
    val name: String,

    @field:Schema(example = "A thief who steals corporate secrets through dream-sharing technology.")
    val description: String,

    @field:Schema(example = "2010")
    val year: Int,

    @field:Schema(example = "[\"Sci-Fi\", \"Thriller\"]")
    val genres: List<String>,

    @field:Schema(example = "[\"Leonardo DiCaprio\"]")
    val actors: List<String>,

    @field:Schema(example = "[\"Christopher Nolan\"]")
    val directors: List<String>,

    @field:Schema(example = "https://example.com/inception.jpg")
    val imageUrl: String,

    @field:Schema(example = "https://example.com/inception-thumb.jpg")
    val thumbnailUrl: String,

    @field:Schema(example = "8.8")
    val rating: Double,

    @field:Schema(example = "PT2H28M")
    val duration: String,
) {
    companion object {
        fun from(movie: Movie): MovieSummaryResponse =
            MovieSummaryResponse(
                id = movie.id,
                name = movie.name,
                description = movie.description,
                year = movie.year,
                genres = movie.genres,
                actors = movie.actors,
                directors = movie.directors,
                imageUrl = movie.imageUrl,
                thumbnailUrl = movie.thumbnailUrl,
                rating = movie.rating,
                duration = movie.duration,
            )
    }
}
