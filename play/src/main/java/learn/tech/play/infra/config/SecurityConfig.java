package learn.tech.play.infra.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import learn.tech.play.infra.filter.JwtFilter;
import learn.tech.play.infra.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    @Bean
    @Order(1)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/api/v1/auth/**", "/api/v1/account/**")
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());

        return http.build();
    }


    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/api/v1/**")
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(
                        auth ->
                                auth.anyRequest().permitAll()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtFilter(jwtTokenProvider,objectMapper), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
