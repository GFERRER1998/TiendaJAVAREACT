package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.tienda.tiendaonline.io.PaymentMethod;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String orderId;
    private String userEmail;
    private String customerName;
    private String mobileNumber;
    private double totalAmount;
    private double taxAmount;
    private double grandTotal;
    private List<OrderResponse.OrderItemResponse> items;
    private PaymentMethod paymentMethod;
    private PaymentDetails paymentDetails;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private java.time.LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponse {
        private String name;
        private double price;
        private int quantity;
        private String itemId;
    }

}
