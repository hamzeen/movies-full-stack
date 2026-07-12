# Movie Finder — Change Log

This document summarizes the key improvements made across the frontend, backend, and database layers of the Movie Finder application.

## Frontend

- Introduced a composition-based component architecture.
- Reorganized the application using a feature-based folder structure.
- Built a responsive, mobile-first user interface.
- Lighthouse score on prod build: **> 97%**

## Backend

### Architecture

- Implemented the Repository Pattern.
- Separated responsibilities into controller, service, and repository layers.

### Security

- Kept the movie search endpoint explicitly public.
- Denied access to all unlisted routes by default.
- Added an exact-origin CORS allow-list.

### Validation and Reliability

- Added validation for search query length.
- Added validation for result limits.
- Added safe and consistent JSON error responses without exposing stack traces.

- Added per-client request rate limiting: **60 requests per client per minute**.

    After the limit is exceeded, it should return: `429 Too Many Requests`

- Within the network, the Spring Boot application is bound to localhost.

    Prevents direct API access from other machines; requests must go through frontend proxy.

### Performance and Resource Limits

- Bounded the database connection pool.
- Added a database query timeout.
- Added Tomcat limits for:
    - Requests
    - Connections
    - Headers
    - Parameters
    - Threads

### Database Access

- Kept all SQL queries parameterized.
- Escaped `%` and `_` wildcard characters in `LIKE` searches.

### API Documentation

- Added Swagger/OpenAPI documentation.
- Setup API versioning - helps when moving to newer versions.
- Added interactive endpoint testing through Swagger UI.

Local Swagger UI: [localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Database

- `MOVIE` table: indexed on the movie name column to improve movie search performance.

## Next Steps

- Set up automated vulnerability scanning for third-party dependencies - helps fight XSS attacks and so on. `npm audit` & `npm audit fix` can be used in the front-end project in the interim. Can be achieved by combiing these 2 tools: Consider [Dependency Check](https://owasp.org/www-project-dependency-check/), [Dependency Track](https://dependencytrack.org/).

- Load and stress testing with a tool such as [AutoCannon](https://github.com/mcollina/autocannon) would be a valuable next step to validate the API’s performance, and stability under heavy traffic, particularly if it is exposed as a public API.
