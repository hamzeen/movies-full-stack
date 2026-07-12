package com.beatgridmedia.assignment.config

import com.beatgridmedia.assignment.error.ApiError
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.benmanes.caffeine.cache.Cache
import io.github.bucket4j.Bucket
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.filter.OncePerRequestFilter
import java.util.concurrent.TimeUnit
import kotlin.math.max

class RateLimitFilter(
    private val properties: RateLimitProperties,
    private val buckets: Cache<String, Bucket>,
    private val objectMapper: ObjectMapper,
) : OncePerRequestFilter() {

    override fun shouldNotFilter(request: HttpServletRequest): Boolean =
        !properties.enabled ||
            request.method != "GET" ||
            request.requestURI != MOVIE_SEARCH_PATH

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val clientKey = request.remoteAddr ?: "unknown"
        val bucket = buckets.get(clientKey) { createBucket() }
        val probe = bucket.tryConsumeAndReturnRemaining(1)

        response.setHeader("X-RateLimit-Limit", properties.capacity.toString())
        response.setHeader("X-RateLimit-Remaining", probe.remainingTokens.toString())

        if (probe.isConsumed) {
            filterChain.doFilter(request, response)
            return
        }

        val retryAfterSeconds = max(
            1,
            TimeUnit.NANOSECONDS.toSeconds(probe.nanosToWaitForRefill),
        )

        response.status = HttpStatus.TOO_MANY_REQUESTS.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.characterEncoding = Charsets.UTF_8.name()
        response.setHeader(HttpHeaders.RETRY_AFTER, retryAfterSeconds.toString())

        objectMapper.writeValue(
            response.writer,
            ApiError(
                status = HttpStatus.TOO_MANY_REQUESTS.value(),
                code = "RATE_LIMIT_EXCEEDED",
                message = "Too many requests. Retry later.",
                path = request.requestURI,
            ),
        )
    }

    private fun createBucket(): Bucket =
        Bucket.builder()
            .addLimit { limit ->
                limit
                    .capacity(properties.capacity)
                    .refillGreedy(properties.refillTokens, properties.refillPeriod)
            }
            .build()

    private companion object {
        const val MOVIE_SEARCH_PATH = "/api/v1/movies/search"
    }
}
