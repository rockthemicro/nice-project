package com.alexandru.timemanagement.security;

import com.alexandru.timemanagement.model.User;
import com.alexandru.timemanagement.service.DBUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static com.alexandru.timemanagement.security.SecurityConstants.API_USER;
import static com.alexandru.timemanagement.security.SecurityConstants.ENDPOINT_CREATE_OR_UPDATE_NOTE_FOR_USER;
import static com.alexandru.timemanagement.security.SecurityConstants.ENDPOINT_GET_NOTES_FOR_USER;

@EnableWebSecurity
@AllArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final DBUserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors().and()
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers(API_USER).permitAll()
                    .antMatchers(ENDPOINT_CREATE_OR_UPDATE_NOTE_FOR_USER).hasAuthority(User.RoleEnum.ADMIN.toString())
                    .antMatchers(ENDPOINT_GET_NOTES_FOR_USER).hasAuthority(User.RoleEnum.ADMIN.toString())
                    .antMatchers("/api/test/ping-manager").hasAuthority(User.RoleEnum.MANAGER.toString())
                    .antMatchers("/api/test/ping-admin").hasAuthority(User.RoleEnum.ADMIN.toString())
                    .anyRequest().authenticated()
                    .and()
                .exceptionHandling().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
        return source;
    }
}
