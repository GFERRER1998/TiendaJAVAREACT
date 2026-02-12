package com.tienda.tiendaonline;

import com.tienda.tiendaonline.Repository.UserRepository;
import com.tienda.tiendaonline.entity.UserEntity;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@SpringBootApplication
public class TiendaonlineApplication {

	public static void main(String[] args) {
		SpringApplication.run(TiendaonlineApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@admin.com").isEmpty()) {
				UserEntity admin = UserEntity.builder()
						.userID(UUID.randomUUID().toString())
						.name("Administrador")
						.email("admin@admin.com")
						.password(passwordEncoder.encode("admin"))
						.role("ADMIN")
						.build();
				userRepository.save(admin);
				System.out.println("DEBUG: Initial admin user created: admin@admin.com / admin");
			}
		};
	}

}
