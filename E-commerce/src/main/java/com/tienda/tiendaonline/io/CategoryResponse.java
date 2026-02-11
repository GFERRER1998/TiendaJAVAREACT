package com.tienda.tiendaonline.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private String categoryID;
    private String name;
    private String description;
    private String bgColor;
    private String imgUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Integer itemCount;
}
