package learn.tech.play.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String password;

    private String email;

    private Account(String name, String password, String email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public static Account of(String name, String password, String email) {
        return new Account(name, password, email);
    }
}
