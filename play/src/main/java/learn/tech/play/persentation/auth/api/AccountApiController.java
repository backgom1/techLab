package learn.tech.play.persentation.auth.api;

import learn.tech.play.application.service.AccountService;
import learn.tech.play.infra.util.ApiResponse;
import learn.tech.play.persentation.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AccountApiController {
    private final AccountService accountService;

    @PostMapping("/api/v1/account/register")
    public ApiResponse<Void> register(@RequestBody RegisterRequest request) {
        accountService.register(request);
        return ApiResponse.success("회원가입이 완료되었습니다.");
    }
}
