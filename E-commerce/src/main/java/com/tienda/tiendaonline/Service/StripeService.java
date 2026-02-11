package com.tienda.tiendaonline.Service;

import com.stripe.exception.StripeException;
import com.tienda.tiendaonline.io.StripePaymentResponse;

public interface StripeService {
    StripePaymentResponse createPayment(double amount, String currency) throws StripeException;

    StripePaymentResponse confirmPayment(String paymentIntentId) throws StripeException;
}
