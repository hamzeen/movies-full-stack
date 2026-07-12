package com.beatgridmedia.assignment.error

import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.ConstraintViolationException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.HandlerMethodValidationException
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException

@RestControllerAdvice
class ApiExceptionHandler {

    private val logger = LoggerFactory.getLogger(ApiExceptionHandler::class.java)

    @ExceptionHandler(HandlerMethodValidationException::class)
    fun handleMethodValidation(
        exception: HandlerMethodValidationException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiError> {
        val violations = exception.parameterValidationResults
            .flatMap { result ->
                result.resolvableErrors.map { error ->
                    result.methodParameter.parameterName.orEmpty() to
                        (error.defaultMessage ?: "Invalid value")
                }
            }
            .toMap()

        return badRequest(request, violations)
    }

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleConstraintViolation(
        exception: ConstraintViolationException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiError> {
        val violations = exception.constraintViolations.associate { violation ->
            violation.propertyPath.toString().substringAfterLast('.') to violation.message
        }

        return badRequest(request, violations)
    }

    @ExceptionHandler(
        MethodArgumentTypeMismatchException::class,
        MissingServletRequestParameterException::class,
        IllegalArgumentException::class,
    )
    fun handleInvalidRequest(
        exception: Exception,
        request: HttpServletRequest,
    ): ResponseEntity<ApiError> =
        badRequest(
            request,
            mapOf("request" to (exception.message ?: "Invalid request")),
        )

    @ExceptionHandler(Exception::class)
    fun handleUnexpectedError(
        exception: Exception,
        request: HttpServletRequest,
    ): ResponseEntity<ApiError> {
        logger.error("Unhandled API error for {}", request.requestURI, exception)

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiError(
                status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
                code = "INTERNAL_SERVER_ERROR",
                message = "The request could not be completed",
                path = request.requestURI,
            )
        )
    }

    private fun badRequest(
        request: HttpServletRequest,
        violations: Map<String, String>,
    ): ResponseEntity<ApiError> =
        ResponseEntity.badRequest().body(
            ApiError(
                status = HttpStatus.BAD_REQUEST.value(),
                code = "INVALID_REQUEST",
                message = "One or more request parameters are invalid",
                path = request.requestURI,
                violations = violations,
            )
        )
}
