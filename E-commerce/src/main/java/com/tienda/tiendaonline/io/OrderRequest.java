package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String orderId;
    private String customerName;
    private String mobileNumber;
    private String userEmail;
    private double totalAmount;
    private double taxAmount;
    private double grandTotal;
    private List<OrderItemRequest> items;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private PaymentDetails paymentDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        private String name;
        private double price;
        private int quantity;
        private String itemId;
    }

}
