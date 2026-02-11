package com.tienda.tiendaonline.io;

import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String categoryID;
    private Integer stock;
}
