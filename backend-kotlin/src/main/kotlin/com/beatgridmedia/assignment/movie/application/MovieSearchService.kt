package com.beatgridmedia.assignment.movie.application

import com.beatgridmedia.assignment.movie.domain.Movie
import com.beatgridmedia.assignment.movie.domain.MovieRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Locale

@Service
class MovieSearchService(
    private val movieRepository: MovieRepository,
) {

    @Transactional(readOnly = true, timeout = 3)
    fun search(query: String, limit: Int): List<Movie> {
        require(query.length <= MovieSearchLimits.MAX_QUERY_LENGTH) {
            "Search query exceeds the supported length"
        }
        require(limit in MovieSearchLimits.MIN_LIMIT..MovieSearchLimits.MAX_LIMIT) {
            "Search limit is outside the supported range"
        }

        val normalizedQuery = query.trim().lowercase(Locale.ROOT)

        return if (normalizedQuery.isBlank()) {
            movieRepository.findTopRated(limit)
        } else {
            movieRepository.searchByName(normalizedQuery, limit)
        }
    }
}
