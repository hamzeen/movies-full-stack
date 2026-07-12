package com.beatgridmedia.assignment.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.access.intercept.AuthorizationFilter
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfiguration(
    private val corsProperties: CorsProperties,
    private val rateLimitFilter: RateLimitFilter,
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .csrf { it.disable() }
            .cors { }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .requestCache { it.disable() }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .logout { it.disable() }
            .authorizeHttpRequests { requests ->
                requests
                    .requestMatchers(HttpMethod.GET, "/api/v1/movies/search").permitAll()
                    .requestMatchers(
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                    ).permitAll()
                    .anyRequest().denyAll()
            }
            .headers { headers ->
                headers.frameOptions { it.deny() }
                headers.referrerPolicy {
                    it.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)
                }
                headers.permissionsPolicy {
                    it.policy("camera=(), microphone=(), geolocation=()")
                }
            }
            .addFilterBefore(rateLimitFilter, AuthorizationFilter::class.java)
            .build()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOrigins = corsProperties.allowedOrigins
            allowedMethods = listOf("GET", "OPTIONS")
            allowedHeaders = listOf("Accept", "Content-Type", "Origin")
            exposedHeaders = listOf(
                "X-RateLimit-Limit",
                "X-RateLimit-Remaining",
                "Retry-After",
            )
            allowCredentials = false
            maxAge = 3_600
        }

        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/api/**", configuration)
        }
    }
}
