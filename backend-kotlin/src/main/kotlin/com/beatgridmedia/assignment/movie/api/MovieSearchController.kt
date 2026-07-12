package com.beatgridmedia.assignment.movie.api

import com.beatgridmedia.assignment.error.ApiError
import com.beatgridmedia.assignment.movie.application.MovieSearchLimits
import com.beatgridmedia.assignment.movie.application.MovieSearchService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/movies")
@Tag(name = "Movies", description = "Public movie discovery endpoints")
class MovieSearchController(
    private val movieSearchService: MovieSearchService,
) {

    @Operation(
        summary = "Search movies",
        description = "Searches movie titles case-insensitively. A blank query returns top-rated movies.",
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Movies returned successfully",
                content = [Content(array = ArraySchema(schema = Schema(implementation = MovieSummaryResponse::class)))],
            ),
            ApiResponse(
                responseCode = "400",
                description = "Invalid query or limit",
                content = [Content(schema = Schema(implementation = ApiError::class))],
            ),
            ApiResponse(
                responseCode = "429",
                description = "Client rate limit exceeded",
                content = [Content(schema = Schema(implementation = ApiError::class))],
            ),
            ApiResponse(
                responseCode = "500",
                description = "Unexpected server error",
                content = [Content(schema = Schema(implementation = ApiError::class))],
            ),
        ],
    )
    @GetMapping("/search")
    fun search(
        @Parameter(
            name = "q",
            description = "Partial or complete movie title. Maximum 100 characters.",
            example = "Inception",
            `in` = ParameterIn.QUERY,
        )
        @RequestParam("q", defaultValue = "")
        @Size(max = MovieSearchLimits.MAX_QUERY_LENGTH)
        query: String,

        @Parameter(
            name = "limit",
            description = "Maximum number of movies to return (1-50).",
            example = "10",
            `in` = ParameterIn.QUERY,
        )
        @RequestParam("limit", defaultValue = "10")
        @Min(1)
        @Max(50)
        limit: Int,
    ): List<MovieSummaryResponse> =
        movieSearchService.search(query, limit).map(MovieSummaryResponse::from)
}
