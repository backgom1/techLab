package learn.tech.play.infra.enums;

import lombok.Getter;

@Getter
public enum TokenStatus {

    PASS("TOKEN-P-001", "토큰 인증 성공"),
    INVALID("TOKEN-E-001", "존재하지 않는 토큰입니다."),
    EXPIRED("TOKEN-E-002", "만료된 토큰입니다."),
    REQUIRED_REFRESH_TOKEN("TOKEN-E-003", "갱신이 필요한 토큰입니다."),
    UNSUPPORTED("TOKEN-E-004","지원하지 않는 토큰입니다.");

    private final String code;
    private final String description;

    TokenStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }
}
