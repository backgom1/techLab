package learn.tech.play.application.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("dev")
@SpringBootTest
class AuthServiceTest {


    @Test
    @DisplayName("로그인을 성공적으로 하고 토큰을 반환하는 테스트")
    void login() {
    }


    @Test
    @DisplayName("아이디 및 패스워드 실패 예외 테스트")
    void loginFail() {
    }

    @Test
    @DisplayName("로그아웃이 정상적으로 되었는지 테스트")
    void logoutSuccess() {
    }
}