package learn.tech.play.application.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwsHeader;
import jakarta.servlet.http.HttpServletRequest;
import learn.tech.play.domain.Account;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.domain.TokenStore;
import learn.tech.play.infra.repository.AccountJpaRepository;
import learn.tech.play.infra.repository.TokenStoreJpaRepository;
import learn.tech.play.infra.util.CookieUtil;
import learn.tech.play.infra.util.JwtTokenProvider;
import learn.tech.play.persentation.auth.dto.LoginRequest;
import learn.tech.play.persentation.auth.dto.LoginResponse;
import learn.tech.play.persentation.auth.dto.RefreshResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountJpaRepository accountJpaRepository;
    private final TokenStoreJpaRepository tokenStoreJpaRepository;
    private final JwtTokenProvider jwtTokenProvider;


    @Transactional
    public LoginResponse login(LoginRequest request) {
        Account account = accountJpaRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new UsernameNotFoundException("사용자 및 비밀번호가 올바르지 않습니다."));

        SecurityUser userDetails = SecurityUser.of(account);

        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);
        Claims claims = jwtTokenProvider.getClaims(refreshToken);
        String refreshId = claims.getId();

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails, refreshId);

        //DB Or Redis 저장
        TokenStore tokenStore = TokenStore.of(refreshId, refreshToken);
        tokenStoreJpaRepository.save(tokenStore);

        return new LoginResponse(accessToken);
    }

    @Transactional
    public RefreshResponse refreshToken(HttpServletRequest request) {
        String accessToken = CookieUtil.getAccessTokenCookie(request.getCookies());
        Claims claims = jwtTokenProvider.getExpiredClaims(accessToken);
        Long id = claims.get("id", Long.class);
        String name = claims.get("name", String.class);
        String refreshId = claims.get("refreshId", String.class);
        //검증
        TokenStore tokenStore = tokenStoreJpaRepository.findById(refreshId)
                .orElseThrow(() -> new IllegalArgumentException("올바르지 않은 리프래시 토큰입니다."));

        //deviceId와같은 추가 검증 필요

        //만약 리프래시 토큰이 만료 기간 안에 올 경우 새로고침 작업 진행

        //갱신
        SecurityUser securityUser = SecurityUser.of(id, name);
        String newAccessToken = jwtTokenProvider.generateAccessToken(securityUser, refreshId);
        return new RefreshResponse(newAccessToken);
    }
}
