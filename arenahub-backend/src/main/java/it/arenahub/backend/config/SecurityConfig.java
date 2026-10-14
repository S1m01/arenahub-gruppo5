package it.arenahub.backend.config;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.formLogin(form -> form.disable())
				.httpBasic(basic -> basic.disable())
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.POST, "/api/auth/registrazione", "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/categorie", "/api/tornei", "/api/tornei/top", "/api/tornei/live",
								"/api/tornei/*", "/api/tornei/*/squadre", "/api/tornei/*/partite", "/api/partite/*",
								"/api/tornei/*/classifica", "/api/tornei/*/classifica-giocatori", "/api/classifica",
								"/api/classifica/top", "/api/classifica/categorie/*", "/api/giocate").permitAll()
						.requestMatchers("/error").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/tornei").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/tornei/*").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PATCH, "/api/tornei/*/stato").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/api/tornei/*/iscritti").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/tornei/*/partite").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/partite/*/punti").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/tornei/*/giocate").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/giocate/*").hasRole("ADMIN")
						.anyRequest().authenticated())
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint((req, res, e) -> scriviErrore(res, 401, "Utente non autenticato"))
						.accessDeniedHandler((req, res, e) -> scriviErrore(res, 403, "Operazione non consentita")));
		return http.build();
	}

	private void scriviErrore(HttpServletResponse res, int status, String messaggio) throws IOException {
		res.setStatus(status);
		res.setContentType("application/json;charset=UTF-8");
		res.getWriter().write("{\"errore\":\"" + messaggio + "\"}");
	}
}
