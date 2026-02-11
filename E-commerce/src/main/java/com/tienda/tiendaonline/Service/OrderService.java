package com.tienda.tiendaonline.Service;

import com.tienda.tiendaonline.io.OrderRequest;
import com.tienda.tiendaonline.io.OrderResponse;
import com.tienda.tiendaonline.io.PaymentVerificationRequest;
import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders(String email, String role);

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    double sumSalesByDate(LocalDate date, String email, String role);

    Long countByOrderDate(LocalDate date, String email, String role);

    List<OrderResponse> findRecentOrders(String email, String role);
}
