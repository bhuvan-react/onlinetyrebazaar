# ── Stage 1: Full build (Node + Maven + Java 21) ─────────────────────────────
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# 1. Resolve Maven dependencies first (cached unless pom.xml changes)
COPY pom.xml ./
RUN mvn dependency:go-offline -B --no-transfer-progress

# 2. Copy only the web sub-project (mobile is Expo-standalone, not in the JAR)
COPY frontend/web ./frontend/web

# 3. Copy the Spring Boot Java sources + resources
COPY backend/src ./backend/src

# 4. Build everything: npm install → npm run build → mvn package
#    The frontend-maven-plugin handles Node/npm; output lands in target/
RUN mvn clean package -DskipTests -B --no-transfer-progress

# ── Stage 2: Lean runtime image ───────────────────────────────────────────────
FROM eclipse-temurin:21-jre-jammy

# Non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

WORKDIR /app

# Copy the fat JAR produced by Stage 1
COPY --from=builder /app/target/tyreplus-dealer-app-*.jar app.jar

RUN chown spring:spring app.jar
USER spring:spring

EXPOSE 8080

# Container-aware JVM flags: use up to 75 % of available RAM
ENTRYPOINT ["java", \
            "-XX:+UseContainerSupport", \
            "-XX:MaxRAMPercentage=75.0", \
            "-jar", "app.jar"]
