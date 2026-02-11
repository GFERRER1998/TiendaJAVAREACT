package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class AuthResponse {
    private String email;
    private String token;
    private String role;
}
