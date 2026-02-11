package com.tienda.tiendaonline.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tienda.tiendaonline.entity.ItemEntity;
import com.tienda.tiendaonline.entity.CategoryEntity;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {
    Optional<ItemEntity> findByItemID(String itemID);

    Integer countByCategory_CategoryID(String categoryID);
}
