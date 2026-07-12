package com.beatgridmedia.assignment

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieSearchControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    @BeforeEach
    fun setUp() {
        jdbcTemplate.execute("DROP TABLE IF EXISTS MOVIE")
        jdbcTemplate.execute(
            """
            CREATE TABLE MOVIE (
                id INT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(512) NOT NULL,
                `year` INT NOT NULL,
                genres VARCHAR(512) NOT NULL,
                actors VARCHAR(512) NOT NULL,
                directors VARCHAR(512) NOT NULL,
                image_url VARCHAR(2083) NOT NULL,
                thumbnail_url VARCHAR(2083) NOT NULL,
                rating DOUBLE NOT NULL,
                duration VARCHAR(16) NOT NULL
            )
            """.trimIndent()
        )

        insertMovie(
            id = 1,
            name = "Inception",
            year = 2010,
            rating = 8.8,
            genres = "[\"Sci-Fi\",\"Thriller\"]",
            actors = "[\"Leonardo DiCaprio\",\"Joseph Gordon-Levitt\"]",
            directors = "[\"Christopher Nolan\"]",
        )
        insertMovie(
            id = 2,
            name = "Inside Out",
            year = 2015,
            rating = 8.2,
            genres = "[\"Animation\"]",
            actors = "[\"Amy Poehler\"]",
            directors = "[\"Pete Docter\"]",
        )
        insertMovie(
            id = 3,
            name = "Interstellar",
            year = 2014,
            rating = 8.7,
            genres = "[\"Sci-Fi\"]",
            actors = "[\"Matthew McConaughey\"]",
            directors = "[\"Christopher Nolan\"]",
        )
        insertMovie(
            id = 4,
            name = "100% Wolf",
            year = 2020,
            rating = 5.6,
            genres = "[\"Animation\"]",
            actors = "[\"Ilai Swindells\"]",
            directors = "[\"Alexs Stadermann\"]",
        )
    }

    @Test
    fun `search endpoint returns matching movies and correctly parsed JSON arrays`() {
        mockMvc.get("/api/v1/movies/search") {
            param("q", "In")
            param("limit", "5")
        }
            .andExpect {
                status { isOk() }
                content { contentTypeCompatibleWith("application/json") }
                jsonPath("$[0].name") { value("Inception") }
                jsonPath("$[0].year") { value(2010) }
                jsonPath("$[0].actors[1]") { value("Joseph Gordon-Levitt") }
                jsonPath("$[1].name") { value("Interstellar") }
                jsonPath("$[2].name") { value("Inside Out") }
            }
    }

    @Test
    fun `blank query returns top rated movies`() {
        mockMvc.get("/api/v1/movies/search") {
            param("limit", "2")
        }
            .andExpect {
                status { isOk() }
                jsonPath("$.length()") { value(2) }
                jsonPath("$[0].name") { value("Inception") }
                jsonPath("$[1].name") { value("Interstellar") }
            }
    }

    @Test
    fun `SQL wildcard characters are treated literally`() {
        mockMvc.get("/api/v1/movies/search") {
            param("q", "%")
            param("limit", "10")
        }
            .andExpect {
                status { isOk() }
                jsonPath("$.length()") { value(1) }
                jsonPath("$[0].name") { value("100% Wolf") }
            }

        mockMvc.get("/api/v1/movies/search") {
            param("q", "_")
            param("limit", "10")
        }
            .andExpect {
                status { isOk() }
                jsonPath("$.length()") { value(0) }
            }
    }

    @Test
    fun `limit outside supported range returns bad request`() {
        mockMvc.get("/api/v1/movies/search") {
            param("limit", "51")
        }
            .andExpect {
                status { isBadRequest() }
                jsonPath("$.code") { value("INVALID_REQUEST") }
                jsonPath("$.violations.limit") { exists() }
            }
    }

    @Test
    fun `overlong query returns bad request`() {
        mockMvc.get("/api/v1/movies/search") {
            param("q", "a".repeat(101))
        }
            .andExpect {
                status { isBadRequest() }
                jsonPath("$.code") { value("INVALID_REQUEST") }
                jsonPath("$.violations.query") { exists() }
            }
    }

    @Test
    fun `invalid limit type returns safe bad request`() {
        mockMvc.get("/api/v1/movies/search") {
            param("limit", "not-a-number")
        }
            .andExpect {
                status { isBadRequest() }
                jsonPath("$.code") { value("INVALID_REQUEST") }
                jsonPath("$.path") { value("/api/v1/movies/search") }
            }
    }

    @Test
    fun `swagger documentation is publicly accessible`() {
        mockMvc.get("/v3/api-docs")
            .andExpect {
                status { isOk() }
                jsonPath("$.info.title") { value("Movie Search API") }
                jsonPath("$.paths['/api/v1/movies/search']") { exists() }
            }
    }

    @Test
    fun `unlisted routes and methods are denied by default`() {
        mockMvc.get("/api/admin")
            .andExpect {
                status { isForbidden() }
            }

        mockMvc.post("/api/v1/movies/search")
            .andExpect {
                status { isForbidden() }
            }
    }

    private fun insertMovie(
        id: Int,
        name: String,
        year: Int,
        rating: Double,
        genres: String,
        actors: String,
        directors: String,
    ) {
        jdbcTemplate.update(
            """
            INSERT INTO MOVIE (
                id, name, description, `year`, genres, actors, directors,
                image_url, thumbnail_url, rating, duration
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """.trimIndent(),
            id,
            name,
            "Description for $name",
            year,
            genres,
            actors,
            directors,
            "https://example.com/$id.jpg",
            "https://example.com/$id-thumb.jpg",
            rating,
            "PT2H",
        )
    }
}
