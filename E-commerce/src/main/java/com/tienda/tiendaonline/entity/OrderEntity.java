package com.tienda.tiendaonline.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.tienda.tiendaonline.io.PaymentDetails;
import com.tienda.tiendaonline.io.PaymentMethod;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "tbl_orders")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderId;
    private String customerName;
    private String mobileNumber;
    private String userEmail;
    private double totalAmount;
    private double taxAmount;
    private double grandTotal;
    private LocalDateTime createdAt;

    @Embedded
    private PaymentDetails paymentDetails;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItemEntity> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.orderId = "ORD" + System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
    }

}
