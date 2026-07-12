package com.beatgridmedia.assignment.movie.infrastructure

import com.beatgridmedia.assignment.movie.domain.Movie
import com.beatgridmedia.assignment.movie.domain.MovieRepository
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository

@Repository
class JdbcMovieRepository(
    private val jdbcTemplate: JdbcTemplate,
    private val objectMapper: ObjectMapper,
) : MovieRepository {

    private val stringListType = object : TypeReference<List<String>>() {}

    private val rowMapper = RowMapper<Movie> { resultSet, _ ->
        Movie(
            id = resultSet.getInt("id"),
            name = resultSet.getString("name"),
            description = resultSet.getString("description"),
            year = resultSet.getInt("year"),
            genres = parseJsonList(resultSet.getString("genres"), "genres"),
            actors = parseJsonList(resultSet.getString("actors"), "actors"),
            directors = parseJsonList(resultSet.getString("directors"), "directors"),
            imageUrl = resultSet.getString("image_url"),
            thumbnailUrl = resultSet.getString("thumbnail_url"),
            rating = resultSet.getDouble("rating"),
            duration = resultSet.getString("duration"),
        )
    }

    override fun findTopRated(limit: Int): List<Movie> =
        jdbcTemplate.query(
            """
            SELECT id, name, description, `year`, genres, actors, directors,
                   image_url, thumbnail_url, rating, duration
            FROM MOVIE
            ORDER BY rating DESC, name ASC
            LIMIT ?
            """.trimIndent(),
            rowMapper,
            limit,
        )

    override fun searchByName(normalizedQuery: String, limit: Int): List<Movie> =
        jdbcTemplate.query(
            """
            SELECT id, name, description, `year`, genres, actors, directors,
                   image_url, thumbnail_url, rating, duration
            FROM MOVIE
            WHERE LOWER(name) LIKE ? ESCAPE '!'
            ORDER BY CASE WHEN LOWER(name) = ? THEN 0 ELSE 1 END,
                     rating DESC,
                     name ASC
            LIMIT ?
            """.trimIndent(),
            rowMapper,
            "%${escapeLike(normalizedQuery)}%",
            normalizedQuery,
            limit,
        )

    private fun escapeLike(value: String): String =
        value
            .replace("!", "!!")
            .replace("%", "!%")
            .replace("_", "!_")

    private fun parseJsonList(value: String?, columnName: String): List<String> {
        if (value.isNullOrBlank()) return emptyList()

        return try {
            objectMapper.readValue(value, stringListType)
        } catch (exception: Exception) {
            throw MovieDataMappingException(
                "Invalid JSON stored in MOVIE.$columnName",
                exception,
            )
        }
    }
}
