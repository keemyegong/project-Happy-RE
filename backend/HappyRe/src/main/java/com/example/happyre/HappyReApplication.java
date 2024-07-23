package com.example.happyre;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(info = @Info(title = "Happyre Backend", version = "dev_0.0.0.1", description = "HappyRE 의 Spring Backend RESTful Server"))
@SpringBootApplication
public class HappyReApplication {

    public static void main(String[] args) {
        SpringApplication.run(HappyReApplication.class, args);
    }

}
