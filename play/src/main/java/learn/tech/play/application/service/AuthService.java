package learn.tech.play.application.service;

import learn.tech.play.domain.Account;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.infra.repository.AccountJpaRepository;
import learn.tech.play.infra.util.JwtTokenProvider;
import learn.tech.play.persentation.auth.dto.LoginRequest;
import learn.tech.play.persentation.auth.dto.LoginResponse;
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


    /*
        Todo: 1. Spring Security를 연동
              2. 로그인이 완료되면 SecurityContext의 사용자 정보 담기
              3. 토큰 반환
              4. 토큰 검증시 레디스 활용
     */
    public LoginResponse login(LoginRequest request){
        Account account = accountJpaRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(()->new UsernameNotFoundException("사용자 및 비밀번호가 올바르지 않습니다."));

        SecurityUser userDetails = SecurityUser.of(account);

        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return new LoginResponse(accessToken);
    }
}
