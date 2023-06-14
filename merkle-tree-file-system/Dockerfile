FROM gradle:8.1.1-jdk17-focal as builder
USER root
WORKDIR /builder
ADD . /builder
RUN gradle build --stacktrace

FROM openjdk:17
WORKDIR /app
EXPOSE 8080
COPY --from=builder /builder/build/libs/merkle-tree-file-system-0.0.1-SNAPSHOT.jar server.jar
CMD ["java", "-jar", "server.jar"]