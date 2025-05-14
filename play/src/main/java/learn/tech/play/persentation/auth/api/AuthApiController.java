package learn.tech.play.persentation.auth.api;

import learn.tech.play.application.service.AuthService;
import learn.tech.play.infra.util.ApiResponse;
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
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request), "로그인을 성공했습니다.");
    }
}
