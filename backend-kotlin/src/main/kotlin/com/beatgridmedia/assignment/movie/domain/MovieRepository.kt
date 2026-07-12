package com.beatgridmedia.assignment.movie.domain

interface MovieRepository {
    fun findTopRated(limit: Int): List<Movie>

    fun searchByName(normalizedQuery: String, limit: Int): List<Movie>
}
