package com.beatgridmedia.assignment

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
    properties = [
        "spring.datasource.url=jdbc:h2:mem:rate-limit-test;MODE=MariaDB;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "app.rate-limit.enabled=true",
        "app.rate-limit.capacity=2",
        "app.rate-limit.refill-tokens=2",
        "app.rate-limit.refill-period=PT1H",
        "app.rate-limit.cache-max-size=100",
        "app.rate-limit.cache-expire-after-access=PT1H",
    ],
)
class RateLimitIntegrationTest {

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
    }

    @Test
    fun `third request from same client is rate limited`() {
        repeat(2) {
            mockMvc.get("/api/v1/movies/search")
                .andExpect {
                    status { isOk() }
                    header { string("X-RateLimit-Limit", "2") }
                }
        }

        mockMvc.get("/api/v1/movies/search")
            .andExpect {
                status { isTooManyRequests() }
                header { exists("Retry-After") }
                jsonPath("$.code") { value("RATE_LIMIT_EXCEEDED") }
            }
    }
}
