package com.tienda.tiendaonline.Service.impl;

import org.springframework.util.StringUtils;
import java.io.IOException;
import com.tienda.tiendaonline.Repository.CategoryRepository;
import com.tienda.tiendaonline.Repository.ItemRepository;
import com.tienda.tiendaonline.Service.CategoryService;
import com.tienda.tiendaonline.Service.FileUploadService;
import com.tienda.tiendaonline.entity.CategoryEntity;
import com.tienda.tiendaonline.io.CategoryRequest;
import com.tienda.tiendaonline.io.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private FileUploadService fileUploadService;

    @Override
    public CategoryResponse add(CategoryRequest request, MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String imgUrl = "http://localhost:8080/api/uploads/" + fileName;

            CategoryEntity newCategory = mapToEntity(request);
            newCategory.setImgUrl(imgUrl);
            newCategory = categoryRepository.save(newCategory);
            return mapToResponse(newCategory);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not store file. Error: " + e.getMessage(), e);
        }
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryEntity -> mapToResponse(categoryEntity))
                .collect(Collectors.toList());
    }

    private CategoryEntity mapToEntity(CategoryRequest request) {
        return CategoryEntity.builder()
                .categoryID(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor())
                .imgUrl(request.getImgUrl())
                .build();
    }

    private CategoryResponse mapToResponse(CategoryEntity category) {
        Integer itemCount = itemRepository.countByCategory_CategoryID(category.getCategoryID());
        return CategoryResponse.builder()
                .categoryID(category.getCategoryID())
                .name(category.getName())
                .description(category.getDescription())
                .bgColor(category.getBgColor())
                .imgUrl(category.getImgUrl())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .itemCount(itemCount)
                .build();
    }

    @Override
    public void delete(String categoryID) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryID(categoryID)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found: " + categoryID));

        // Check for associated products
        Integer itemCount = itemRepository.countByCategory_CategoryID(categoryID);
        if (itemCount > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete category because it has " + itemCount + " associated products.");
        }

        String imgUrl = existingCategory.getImgUrl();
        if (imgUrl != null && !imgUrl.isEmpty()) {
            try {
                String fileName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
                Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
                Path filePath = uploadPath.resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        categoryRepository.delete(existingCategory);
    }
}
