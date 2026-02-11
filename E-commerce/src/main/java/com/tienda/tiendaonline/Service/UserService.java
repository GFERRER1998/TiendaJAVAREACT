package com.tienda.tiendaonline.Service;

import com.tienda.tiendaonline.io.UserRequest;
import com.tienda.tiendaonline.io.UserResponse;
import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);

    String getUserRole(String email);

    List<UserResponse> readUsers();

    void deleteUser(String userId);
}
