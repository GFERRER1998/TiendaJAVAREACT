package com.tienda.tiendaonline.Repository;

import com.tienda.tiendaonline.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    Optional<CategoryEntity> findByCategoryID(String categoryID);

}
