package com.tienda.tiendaonline.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tienda.tiendaonline.entity.OrderEntity;

public interface OrderEntityRepository extends JpaRepository<OrderEntity, Long> {

    Optional<OrderEntity> findByOrderId(String orderId);

    List<OrderEntity> findAllByOrderByCreatedAtDesc();

    List<OrderEntity> findAllByOrderId(String orderId);

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Double sumSaleByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date")
    Long countByOrderDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrders(Pageable pageable);

    // User-specific queries
    List<OrderEntity> findAllByUserEmailOrderByCreatedAtDesc(String userEmail);

    @Query("SELECT SUM(o.grandTotal) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.userEmail = :email")
    Double sumSalesByDateAndUserEmail(@Param("date") LocalDate date, @Param("email") String email);

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt) = :date AND o.userEmail = :email")
    Long countByOrderDateAndUserEmail(@Param("date") LocalDate date, @Param("email") String email);

    @Query("SELECT o FROM OrderEntity o WHERE o.userEmail = :email ORDER BY o.createdAt DESC")
    List<OrderEntity> findRecentOrdersByUserEmail(@Param("email") String email, Pageable pageable);
}
