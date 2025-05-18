package learn.tech.play.infra.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.infra.util.ApiResponse;
import learn.tech.play.infra.util.JwtTokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;


public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            bearerToken = bearerToken.substring(7);
        }

        boolean isValid = jwtTokenProvider.validateToken(bearerToken);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        if (bearerToken == null || !isValid) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            String responseJson = objectMapper.writeValueAsString(ApiResponse.failure("존재하지 않은 토큰입니다.", "AUTH-E-001"));
            response.getWriter().write(responseJson);
            response.getWriter().flush();
            return;
        } else {
            Claims claims = jwtTokenProvider.getClaims(bearerToken);
            Long id = claims.get("id", Long.class);
            String name = (String) claims.get("name");
            SecurityUser securityUser = SecurityUser.of(id, name);
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    securityUser, null, securityUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }
}
