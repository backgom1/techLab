package learn.tech.play.application.service;

import learn.tech.play.domain.Account;
import learn.tech.play.infra.repository.AccountJpaRepository;
import learn.tech.play.persentation.auth.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountJpaRepository accountJpaRepository;

    @Transactional
    public void register(RegisterRequest request) {
        Account account = Account.of(request.getName(), request.getPassword(), request.getEmail());
        accountJpaRepository.save(account);
    }
}
