package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StripePaymentResponse {
    private String id;
    private String entity;
    private long amount;
    private String currency;
    private String status;
    private String createdAt;
    private String receipt;
    private String paymentUrl;
    private String clientSecret;
}
