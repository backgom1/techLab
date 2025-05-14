package learn.tech.play.application.service;

import learn.tech.play.domain.Account;
import learn.tech.play.infra.repository.AccountJpaRepository;
import learn.tech.play.persentation.auth.dto.RegisterRequest;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
class AccountServiceTest {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AccountJpaRepository accountJpaRepository;

    @AfterEach
    void tearDown() {
        accountJpaRepository.deleteAll();
    }

    @Test
    @DisplayName("회원가입이 올바르게 되었는지 테스트")
    void register() {
        //given
        RegisterRequest request = RegisterRequest.of("1234", "test@test.com", "홍길동");

        //when
        accountService.register(request);

        //then
        Account account = accountJpaRepository.findByEmail("test@test.com");
        assertThat(account.getEmail()).isEqualTo("test@test.com");
        assertThat(account.getPassword()).isEqualTo("1234");
        assertThat(account.getName()).isEqualTo("홍길동");
    }

}