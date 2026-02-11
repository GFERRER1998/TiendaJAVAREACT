package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String userID;
    private String name;
    private String email;
    private String role;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
