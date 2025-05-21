package learn.tech.play.application.service;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import learn.tech.play.domain.Account;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.infra.repository.AccountJpaRepository;
import learn.tech.play.infra.util.CookieUtil;
import learn.tech.play.infra.util.JwtTokenProvider;
import learn.tech.play.persentation.auth.dto.LoginRequest;
import learn.tech.play.persentation.auth.dto.LoginResponse;
import learn.tech.play.persentation.auth.dto.RefreshResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountJpaRepository accountJpaRepository;
    private final JwtTokenProvider jwtTokenProvider;


    public LoginResponse login(LoginRequest request) {
        Account account = accountJpaRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new UsernameNotFoundException("사용자 및 비밀번호가 올바르지 않습니다."));

        SecurityUser userDetails = SecurityUser.of(account);

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return new LoginResponse(accessToken);
    }

    public RefreshResponse refreshToken(HttpServletRequest request) {
        String accessToken = CookieUtil.getAccessTokenCookie(request.getCookies());
        Claims claims = jwtTokenProvider.getExpiredClaims(accessToken);
        Long id = claims.get("id", Long.class);
        String name = claims.get("name", String.class);
        SecurityUser securityUser = SecurityUser.of(id, name);
        String newAccessToken = jwtTokenProvider.generateAccessToken(securityUser);
        return new RefreshResponse(newAccessToken);
    }
}
