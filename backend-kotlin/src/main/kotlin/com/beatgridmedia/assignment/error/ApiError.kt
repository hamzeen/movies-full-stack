package com.beatgridmedia.assignment.error

import io.swagger.v3.oas.annotations.media.Schema
import java.time.Instant

@Schema(description = "Consistent API error response")
data class ApiError(
    @field:Schema(example = "2026-07-11T08:00:00Z")
    val timestamp: Instant = Instant.now(),

    @field:Schema(example = "400")
    val status: Int,

    @field:Schema(example = "INVALID_REQUEST")
    val code: String,

    @field:Schema(example = "One or more request parameters are invalid")
    val message: String,

    @field:Schema(example = "/api/v1/movies/search")
    val path: String,

    val violations: Map<String, String> = emptyMap(),
)
