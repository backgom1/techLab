package learn.tech.play.infra.repository;

import learn.tech.play.domain.TokenStore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenStoreJpaRepository extends JpaRepository<TokenStore, String> {
}
