package com.tienda.tiendaonline.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.tienda.tiendaonline.Service.CategoryService;
import com.tienda.tiendaonline.io.CategoryRequest;
import com.tienda.tiendaonline.io.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController

@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString,
            @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try {
            request = objectMapper.readValue(categoryString, CategoryRequest.class);
            return categoryService.add(request, file);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Exception occurred while parsing JSON: " + exception.getMessage());
        }

    }

    @GetMapping("/categories")
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read();
    }

    @DeleteMapping("admin/categories/{categoryID}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable String categoryID) {
        try {
            categoryService.delete(categoryID);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
