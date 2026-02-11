package com.tienda.tiendaonline.controller;

import com.tienda.tiendaonline.Service.UserService;
import com.tienda.tiendaonline.io.AuthRequest;
import com.tienda.tiendaonline.io.AuthResponse;
import com.tienda.tiendaonline.io.UserRequest;
import com.tienda.tiendaonline.io.UserResponse;
import com.tienda.tiendaonline.utill.JwtUtill;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtill jwtUtill;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest Request) {
        System.out.println("DEBUG: Login attempt for: " + Request.getEmail());
        authenticate(Request.getEmail(), Request.getPassword());
        System.out.println("DEBUG: Authentication successful for: " + Request.getEmail());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(Request.getEmail());
        final String token = jwtUtill.generateToken(userDetails);
        String role = userService.getUserRole(Request.getEmail());
        System.out.println("DEBUG: Returning role: " + role);
        return new AuthResponse(Request.getEmail(), token, role);
    }

    private void authenticate(String email, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (DisabledException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User disabled", e);
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid credentials", e);
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request) { // Changed return type to String
        return passwordEncoder.encode(request.get("password"));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(@RequestBody UserRequest Request) {
        try {
            return userService.createUser(Request);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error registering user: " + e.getMessage(), e);
        }
    }
}
