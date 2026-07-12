<!-- bootstrap-project:start -->

- Inspected: README.md, backend-kotlin/build.gradle.kts, backend-kotlin/settings.gradle.kts, backend-kotlin/gradle/wrapper/gradle-wrapper.properties, backend-kotlin/src/main/kotlin/com/beatgridmedia/assignment/Application.kt, backend-kotlin/src/main/resources/application.yaml, frontend/package.json, frontend/vite.config.ts, database/docker-compose.yml, database/init.sql.
- Backend: Kotlin + Spring Boot 3.5.8, Kotlin 1.9.25, Gradle wrapper 8.7, Java 17 target, app entry at backend-kotlin/src/main/kotlin/com/beatgridmedia/assignment/Application.kt, datasource configured for MariaDB at localhost:53306/assignment.
- Backend commands: `cd backend-kotlin && ./gradlew bootRun`, `./gradlew test`, `./gradlew clean build`. Static-analysis/formatting commands: unknown; no matching plugins/scripts were found in the inspected manifests.
- Frontend: Vite 7 + React + TypeScript, package manager npm (package-lock.json present), scripts `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`.
- Database: `database/docker-compose.yml` runs MariaDB 10.11 on port 53306; `database/init.sql` creates the `assignment` database and seeds the `MOVIE` table. Safe inspection commands: `docker compose ps`, `docker compose logs`, `docker compose exec database mariadb -u root`.
- Startup order: `cd database && docker compose up -d`; `cd backend-kotlin && ./gradlew bootRun`; `cd frontend && npm install && npm run dev`.
- Not run: app startup or build/test commands, per scope instructions; only repository manifests and scripts were inspected.
  <!-- bootstrap-project:end -->
