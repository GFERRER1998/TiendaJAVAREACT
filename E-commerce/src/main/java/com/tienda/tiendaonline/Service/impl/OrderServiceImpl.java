package com.tienda.tiendaonline.Service.impl;

import com.tienda.tiendaonline.Repository.OrderEntityRepository;
import com.tienda.tiendaonline.Repository.ItemRepository;
import com.tienda.tiendaonline.io.OrderRequest;
import com.tienda.tiendaonline.io.OrderResponse;
import com.tienda.tiendaonline.io.PaymentVerificationRequest;

import com.tienda.tiendaonline.entity.OrderEntity;
import com.tienda.tiendaonline.entity.OrderItemEntity;
import com.tienda.tiendaonline.io.PaymentMethod;
import com.tienda.tiendaonline.io.PaymentDetails;
import com.tienda.tiendaonline.Service.StripeService;
import com.tienda.tiendaonline.io.StripePaymentResponse;
import com.tienda.tiendaonline.Service.OrderService;
import com.stripe.exception.StripeException;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderEntityRepository orderEntityRepository;
    private final StripeService stripeService;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        OrderEntity newOrder = convertToOrderEntity(request);

        // Get email from authentication to ensure security
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        newOrder.setUserEmail(currentUserEmail);

        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStatus(request.getPaymentMethod() == PaymentMethod.CASH ? PaymentDetails.PaymentStatus.SUCCESS
                : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);

        List<OrderItemEntity> orderItems = request.getItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());
        newOrder.setItems(orderItems);

        // Reduce stock if payment is CASH
        if (request.getPaymentMethod() == PaymentMethod.CASH) {
            reduceStock(orderItems);
        }

        newOrder = orderEntityRepository.save(newOrder);
        return convertToOrderResponse(newOrder);
    }

    @Override
    @Transactional
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!verifyStripePayment(request.getPaymentIntentId())) {
            throw new RuntimeException("Payment verification failed");
        }

        PaymentDetails paymentDetails = existingOrder.getPaymentDetails();
        paymentDetails.setStripePaymentId(request.getPaymentIntentId());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);
        existingOrder.setPaymentDetails(paymentDetails);

        // Reduce stock on successful verification
        reduceStock(existingOrder.getItems());

        existingOrder = orderEntityRepository.save(existingOrder);
        return convertToOrderResponse(existingOrder);
    }

    private void reduceStock(List<OrderItemEntity> items) {
        for (OrderItemEntity orderItem : items) {
            com.tienda.tiendaonline.entity.ItemEntity item = itemRepository.findById(orderItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + orderItem.getItemId()));

            if (item.getStock() < orderItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName() +
                        " (Available: " + item.getStock() + ", Requested: " + orderItem.getQuantity() + ")");
            }

            item.setStock(item.getStock() - orderItem.getQuantity());
            itemRepository.save(item);
        }
    }

    private boolean verifyStripePayment(String paymentIntentId) {
        try {
            StripePaymentResponse stripeResponse = stripeService.confirmPayment(paymentIntentId);
            return "succeeded".equals(stripeResponse.getStatus());
        } catch (StripeException e) {
            return false;
        }
    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        Long numericId = itemRepository.findByItemID(orderItemRequest.getItemId())
                .map(item -> item.getId())
                .orElseThrow(() -> new RuntimeException("Item not found: " + orderItemRequest.getItemId()));

        return OrderItemEntity.builder()
                .Name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .itemId(numericId)
                .totalAmount(orderItemRequest.getPrice() * orderItemRequest.getQuantity())
                .build();
    }

    private OrderResponse convertToOrderResponse(OrderEntity newOrder) {
        return OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .mobileNumber(newOrder.getMobileNumber())
                .userEmail(newOrder.getUserEmail())
                .totalAmount(newOrder.getTotalAmount())
                .taxAmount(newOrder.getTaxAmount())
                .grandTotal(newOrder.getGrandTotal())
                .paymentMethod(newOrder.getPaymentMethod())
                .items(newOrder.getItems().stream().map(this::convertToItemResponse).collect(Collectors.toList()))
                .paymentDetails(newOrder.getPaymentDetails())
                .createdAt(newOrder.getCreatedAt())
                .build();
    }

    private OrderEntity convertToOrderEntity(OrderRequest orderRequest) {
        return OrderEntity.builder()
                .customerName(orderRequest.getCustomerName())
                .mobileNumber(orderRequest.getMobileNumber())
                .userEmail(orderRequest.getUserEmail())
                .totalAmount(orderRequest.getTotalAmount())
                .taxAmount(orderRequest.getTaxAmount())
                .grandTotal(orderRequest.getGrandTotal())
                .paymentMethod(orderRequest.getPaymentMethod())
                .items(new ArrayList<>())
                .build();
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder()
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .itemId(String.valueOf(orderItemEntity.getItemId()))
                .build();
    }

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderEntityRepository.delete(existingOrder);

    }

    @Override
    public List<OrderResponse> getLatestOrders(String email, String role) {
        List<OrderEntity> orders;
        if ("ADMIN".equals(role)) {
            orders = orderEntityRepository.findAllByOrderByCreatedAtDesc();
        } else {
            orders = orderEntityRepository.findAllByUserEmailOrderByCreatedAtDesc(email);
        }
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public double sumSalesByDate(LocalDate date, String email, String role) {
        Double total;
        if ("ADMIN".equals(role)) {
            total = orderEntityRepository.sumSaleByDate(date);
        } else {
            total = orderEntityRepository.sumSalesByDateAndUserEmail(date, email);
        }
        return total != null ? total : 0.0;
    }

    @Override
    public Long countByOrderDate(LocalDate date, String email, String role) {
        Long count;
        if ("ADMIN".equals(role)) {
            count = orderEntityRepository.countByOrderDate(date);
        } else {
            count = orderEntityRepository.countByOrderDateAndUserEmail(date, email);
        }
        return count != null ? count : 0L;
    }

    @Override
    public List<OrderResponse> findRecentOrders(String email, String role) {
        List<OrderEntity> orders;
        if ("ADMIN".equals(role)) {
            orders = orderEntityRepository.findRecentOrders(PageRequest.of(0, 5));
        } else {
            orders = orderEntityRepository.findRecentOrdersByUserEmail(email, PageRequest.of(0, 5));
        }
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

}
