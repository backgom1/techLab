package learn.tech.play.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TokenStore {

    @Id
    private String tokenId;

    @Column(nullable = false)
    private String refreshToken;

    private TokenStore(String tokenId, String refreshToken) {
        this.tokenId = tokenId;
        this.refreshToken = refreshToken;
    }

    public static TokenStore of(String tokenId, String refreshToken) {
        return new TokenStore(tokenId, refreshToken);
    }
}
