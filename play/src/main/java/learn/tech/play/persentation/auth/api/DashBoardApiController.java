package learn.tech.play.persentation.auth.api;

import learn.tech.play.domain.SecurityUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class DashBoardApiController {


    @GetMapping("/api/v1/dashboard")
    public String dashboard(@AuthenticationPrincipal SecurityUser userDetail ) {
        log.info("userDetailUserId : {}", userDetail.getId());
        return "대시보드 ㅎㅎ";
    }
}
