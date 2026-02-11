package com.tienda.tiendaonline.Service;

import com.tienda.tiendaonline.io.CategoryRequest;
import com.tienda.tiendaonline.io.CategoryResponse;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile file);

    List<CategoryResponse> read();

    void delete(String categoryID);

}
