package com.tienda.tiendaonline.Service;

import com.tienda.tiendaonline.Repository.UserRepository;
import com.tienda.tiendaonline.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("email not found"));
        return new User(existingUser.getEmail(),
                existingUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + existingUser.getRole())));
    }

}
