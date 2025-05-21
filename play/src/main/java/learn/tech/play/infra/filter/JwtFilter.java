package learn.tech.play.infra.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import learn.tech.play.domain.SecurityUser;
import learn.tech.play.infra.enums.TokenStatus;
import learn.tech.play.infra.util.ApiResponse;
import learn.tech.play.infra.util.CookieUtil;
import learn.tech.play.infra.util.JwtTokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static learn.tech.play.infra.enums.TokenStatus.*;


public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String accessToken = CookieUtil.getAccessTokenCookie(request.getCookies());

        TokenStatus tokenStatus = jwtTokenProvider.validateToken(accessToken);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        switch (tokenStatus) {
                    case INVALID -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        String responseJson = objectMapper.writeValueAsString(ApiResponse.failure(INVALID.getDescription(), INVALID.getCode()));
                        response.getWriter().write(responseJson);
                        response.getWriter().flush();
                        return;
                    }
                    case EXPIRED -> {
                        response.setStatus(HttpServletResponse.SC_OK);
                        String responseJson = objectMapper.writeValueAsString(ApiResponse.failure(EXPIRED.getDescription(), EXPIRED.getCode()));
                        response.getWriter().write(responseJson);
                        response.getWriter().flush();
                        return;
                    }

                    case REQUIRED_REFRESH_TOKEN -> {
                        response.setStatus(HttpServletResponse.SC_OK);
                        String responseJson = objectMapper.writeValueAsString(ApiResponse.failure(REQUIRED_REFRESH_TOKEN.getDescription(), REQUIRED_REFRESH_TOKEN.getDescription()));
                        response.getWriter().write(responseJson);
                        response.getWriter().flush();
                        return;
                    }
                    default -> {
                        Claims claims = jwtTokenProvider.getClaims(accessToken);
                        Long id = claims.get("id", Long.class);
                        String name = (String) claims.get("name");
                SecurityUser securityUser = SecurityUser.of(id, name);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        securityUser, null, securityUser.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            }
        }
    }
}
