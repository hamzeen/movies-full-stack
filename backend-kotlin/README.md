# Movie Search API

Kotlin + Spring Boot backend for the React movie search frontend.

## Architecture

```text
HTTP controller -> application service -> repository interface -> JDBC repository -> MariaDB
```

The frontend-compatible public endpoint remains:

```http
GET /api/v1/movies/search?q=Inception&limit=10
```

## Requirements

- Java 17 or later
- MariaDB running on port `53306`
- Database named `assignment`
- The assignment database initialized with its original movie data

The backend intentionally keeps the assignment's original local database configuration:

```yaml
url: jdbc:mariadb://localhost:53306/assignment
username: root
password:
```

## Run

From the `backend-kotlin` directory:

```bash
chmod +x gradlew
./gradlew bootRun
```

The API starts at:

```text
http://localhost:8080
```

Test the movie endpoint:

```bash
curl "http://localhost:8080/api/v1/movies/search?q=Inception&limit=10"
```

## Run tests

```bash
./gradlew clean test
```

## Swagger / OpenAPI

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

The root database account is retained only to keep this assignment immediately runnable with the supplied local database setup. A dedicated least-privilege database account would be preferable for a production deployment.
