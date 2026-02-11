package com.tienda.tiendaonline.Service.impl;

import com.tienda.tiendaonline.Repository.UserRepository;
import com.tienda.tiendaonline.Service.UserService;
import com.tienda.tiendaonline.entity.UserEntity;
import com.tienda.tiendaonline.io.UserRequest;
import com.tienda.tiendaonline.io.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    @Override
    public String getUserRole(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return existingUser.getRole();
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> convertToResponse(user))
                .collect(Collectors.toList());

    }

    @Override
    public void deleteUser(String userId) {
        UserEntity existingUser = userRepository.findByUserID(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepository.delete(existingUser);
    }

    private UserResponse convertToResponse(UserEntity userEntity) {
        return UserResponse.builder()
                .userID(userEntity.getUserID())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .role(userEntity.getRole())
                .createdAt(userEntity.getCreatedAt())
                .updatedAt(userEntity.getUpdatedAt())
                .build();
    }

    private UserEntity convertToEntity(UserRequest userRequest) {
        return UserEntity.builder()
                .userID(UUID.randomUUID().toString())
                .name(userRequest.getName())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(userRequest.getRole().toUpperCase().replace("ROLE_", ""))
                .build();
    }
}
