package learn.tech.play.infra.repository;

import learn.tech.play.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AccountJpaRepository extends JpaRepository<Account, Long> {
    Account findByEmail(String email);
}
