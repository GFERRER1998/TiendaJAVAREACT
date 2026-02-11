package com.tienda.tiendaonline.io;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDetails {
    private String stripePaymentId;
    private String stripeClientSecret;
    private String stripePaymentUrl;
    private PaymentStatus status;

    public enum PaymentStatus {
        PENDING,
        SUCCESS,
        FAILED,
        COMPLETED
    }
}
