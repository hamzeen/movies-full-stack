package com.beatgridmedia.assignment.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Contact
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfiguration {

    @Bean
    fun movieSearchOpenApi(): OpenAPI =
        OpenAPI().info(
            Info()
                .title("Movie Search API")
                .description("Public, read-only API used by the React movie search frontend.")
                .version("v1")
                .contact(Contact().name("Beatgrid Media Assignment"))
        )
}
