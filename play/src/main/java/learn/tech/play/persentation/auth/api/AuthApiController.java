package learn.tech.play.persentation.auth.api;

import jakarta.servlet.http.HttpServletResponse;
import learn.tech.play.application.service.AuthService;
import learn.tech.play.infra.util.ApiResponse;
import learn.tech.play.infra.util.CookieUtil;
import learn.tech.play.persentation.auth.dto.LoginRequest;
import learn.tech.play.persentation.auth.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthService authService;

    @PostMapping("/api/v1/auth/login")
    public ApiResponse<LoginResponse> login(HttpServletResponse response, @RequestBody LoginRequest request) {
        //httpOnly는 리액트 및 자바스크립트에서 적용할수 없기때문에 (Express.js를 사용하면 가능) 서버측에서 보내줘야한다.
        LoginResponse login = authService.login(request);
        CookieUtil.addAccessTokenCookie(response, login.getAccessToken(), 60 * 60 * 24);
        return ApiResponse.success(login, "로그인을 성공했습니다.");
    }
}
