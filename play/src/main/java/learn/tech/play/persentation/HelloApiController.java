package learn.tech.play.persentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloApiController {

    @GetMapping("/api/v1/hello")
    public String hello() {
        return "Hello World!";
    }
}
