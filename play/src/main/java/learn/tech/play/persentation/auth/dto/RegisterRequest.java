package learn.tech.play.persentation.auth.dto;

import lombok.Getter;

@Getter
public class RegisterRequest {

    private final String name;
    private final String email;
    private final String password;

    private RegisterRequest(String password, String email, String name) {
        this.password = password;
        this.email = email;
        this.name = name;
    }

    public static RegisterRequest of(String password, String email, String name) {
        return new RegisterRequest(password, email, name);
    }
}
