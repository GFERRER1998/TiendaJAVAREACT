package com.tienda.tiendaonline.io;

import java.math.BigDecimal;
import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemResponse {
    private String itemID;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String image;
    private String categoryName;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String categoryID;
    private String imageURL;
}
