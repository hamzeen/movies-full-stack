package com.beatgridmedia.assignment.config

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated
import java.time.Duration

@Validated
@ConfigurationProperties("app.rate-limit")
data class RateLimitProperties(
    val enabled: Boolean = true,

    @field:Min(1)
    @field:Max(100_000)
    val capacity: Long = 60,

    @field:Min(1)
    @field:Max(100_000)
    val refillTokens: Long = 60,

    val refillPeriod: Duration = Duration.ofMinutes(1),

    @field:Min(100)
    @field:Max(1_000_000)
    val cacheMaxSize: Long = 100_000,

    val cacheExpireAfterAccess: Duration = Duration.ofHours(1),
)
