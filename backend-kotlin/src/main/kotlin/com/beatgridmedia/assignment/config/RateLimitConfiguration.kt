package com.beatgridmedia.assignment.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import io.github.bucket4j.Bucket
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RateLimitConfiguration {

    @Bean
    fun rateLimitBuckets(properties: RateLimitProperties): Cache<String, Bucket> {
        require(!properties.refillPeriod.isZero && !properties.refillPeriod.isNegative) {
            "app.rate-limit.refill-period must be positive"
        }
        require(!properties.cacheExpireAfterAccess.isZero && !properties.cacheExpireAfterAccess.isNegative) {
            "app.rate-limit.cache-expire-after-access must be positive"
        }

        return Caffeine.newBuilder()
            .maximumSize(properties.cacheMaxSize)
            .expireAfterAccess(properties.cacheExpireAfterAccess)
            .build<String, Bucket>()
    }

    @Bean
    fun rateLimitFilterRegistration(
        rateLimitFilter: RateLimitFilter,
    ): FilterRegistrationBean<RateLimitFilter> =
        FilterRegistrationBean(rateLimitFilter).apply {
            isEnabled = false
        }

    @Bean
    fun rateLimitFilter(
        properties: RateLimitProperties,
        buckets: Cache<String, Bucket>,
        objectMapper: ObjectMapper,
    ): RateLimitFilter =
        RateLimitFilter(properties, buckets, objectMapper)
}
