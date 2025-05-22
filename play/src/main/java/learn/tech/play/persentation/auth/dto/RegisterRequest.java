package learn.tech.play.persentation.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RegisterRequest {

    private String name;
    private String email;
    private String password;

    private RegisterRequest(String password, String email, String name) {
        this.password = password;
        this.email = email;
        this.name = name;
    }

    public static RegisterRequest of(String password, String email, String name) {
        return new RegisterRequest(password, email, name);
    }
}
