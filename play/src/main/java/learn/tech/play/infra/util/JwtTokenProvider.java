package learn.tech.play.infra.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.infra.enums.TokenStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret-key}")
    private String secret;

    private SecretKey key;

    @Value("${jwt.access-token-validity-ms}")
    private long accessTokenValidityInMilliseconds;

    @Value("${jwt.refresh-token-validity-ms}")
    private long refreshTokenValidityInMilliseconds;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 256 bits (32 bytes) long for HS256 algorithm.");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }


    public String generateAccessToken(SecurityUser user, String refreshId) {
        Date now = new Date();

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("id", (Long) user.getId())
                .claim("name", user.getUsername())
                .claim("refreshId", refreshId)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessTokenValidityInMilliseconds))
                .signWith(key) // 0.12.xx 버전은 자동으로 알고리즘 키를 유추하여 넣어 주기때문에 기존 알고리즘 선택 방식은 올바르지 않다. -> 타입 안정성
                .compact();
    }

    public String generateRefreshToken(SecurityUser user) {
        Date now = new Date();
        return Jwts.builder()
                .subject(user.getUsername())
                .id(UUID.randomUUID().toString())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + refreshTokenValidityInMilliseconds))
                .signWith(key)//자동으로 알고리즘 키를 유추하여 넣어 주기때문에 기존 알고리즘 선택 방식은 올바르지 않다. -> 타입 안정성
                .compact();

    }

    public TokenStatus validateToken(String token) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return TokenStatus.PASS;
        } catch (SecurityException | MalformedJwtException | SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            return TokenStatus.INVALID;
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
            return TokenStatus.EXPIRED;
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
            return TokenStatus.UNSUPPORTED;
        } catch (IllegalArgumentException e) {
            log.error("JWT token compact of handler are invalid: {}", e.getMessage());
            return TokenStatus.INVALID;
        }
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("Failed to get claims from token: {}", e.getMessage());
            throw new RuntimeException("에러");
        }
    }

    public Claims getExpiredClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .clockSkewSeconds(Integer.MAX_VALUE) // 아주 큰 시간 오차를 허용하여 만료 검사 우회
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            throw new RuntimeException("에러");
        }
    }
}
