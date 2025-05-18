package learn.tech.play.infra.repository;

import learn.tech.play.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;


public interface AccountJpaRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByEmail(String email);

    Optional<Account> findByEmailAndPassword(String email, String password);
}
