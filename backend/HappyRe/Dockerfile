FROM openjdk:17-jdk
RUN chmod +x gradlew
RUN ./gradlew build
COPY build/libs/HappyRe-0.0.1-SNAPSHOT.jar /happyre.jar
ENTRYPOINT ["java", "-jar", "/happyre.jar"]
