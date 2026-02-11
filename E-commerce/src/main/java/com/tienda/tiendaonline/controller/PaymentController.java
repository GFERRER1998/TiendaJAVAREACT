package com.tienda.tiendaonline.controller;

import com.stripe.exception.StripeException;
import com.tienda.tiendaonline.Service.OrderService;
import com.tienda.tiendaonline.Service.StripeService;
import com.tienda.tiendaonline.io.OrderResponse;
import com.tienda.tiendaonline.io.PaymentRequest;
import com.tienda.tiendaonline.io.PaymentVerificationRequest;
import com.tienda.tiendaonline.io.StripePaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final StripeService stripeService;
    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<StripePaymentResponse> createPayment(@RequestBody PaymentRequest paymentRequest)
            throws StripeException {
        StripePaymentResponse response = stripeService.createPayment(paymentRequest.getAmount(),
                paymentRequest.getCurrency());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request) {
        return orderService.verifyPayment(request);
    }
}
