package com.tienda.tiendaonline.Service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.tienda.tiendaonline.Service.StripeService;
import com.tienda.tiendaonline.io.StripePaymentResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Service
public class StripeServiceImpl implements StripeService {

        @Value("${stripe.secret.key}")
        private String stripeSecretKey;

        @PostConstruct
        public void init() {
                Stripe.apiKey = stripeSecretKey;
        }

        @Override
        public StripePaymentResponse createPayment(double amount, String currency) throws StripeException {
                long amountInCents = BigDecimal.valueOf(amount)
                                .multiply(BigDecimal.valueOf(100))
                                .longValue();

                String receiptId = "order_rcptid_" + System.currentTimeMillis();

                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                                .setAmount(amountInCents)
                                .setCurrency(currency)
                                .addPaymentMethodType("card")
                                .build();

                PaymentIntent paymentIntent = PaymentIntent.create(params);

                String createdAt = DateTimeFormatter.ISO_OFFSET_DATE_TIME
                                .withZone(ZoneOffset.UTC)
                                .format(Instant.now());

                return StripePaymentResponse.builder()
                                .id(paymentIntent.getId())
                                .entity("payment_intent")
                                .amount(amountInCents)
                                .currency(currency.toUpperCase())
                                .status(paymentIntent.getStatus())
                                .createdAt(createdAt)
                                .receipt(receiptId)
                                .clientSecret(paymentIntent.getClientSecret())
                                .build();
        }

        @Override
        public StripePaymentResponse confirmPayment(String paymentIntentId) throws StripeException {
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

                String createdAt = DateTimeFormatter.ISO_OFFSET_DATE_TIME
                                .withZone(ZoneOffset.UTC)
                                .format(Instant.ofEpochSecond(paymentIntent.getCreated()));

                return StripePaymentResponse.builder()
                                .id(paymentIntent.getId())
                                .entity("payment_intent")
                                .amount(paymentIntent.getAmount())
                                .currency(paymentIntent.getCurrency().toUpperCase())
                                .status(paymentIntent.getStatus())
                                .createdAt(createdAt)
                                .clientSecret(paymentIntent.getClientSecret())
                                .build();
        }
}
