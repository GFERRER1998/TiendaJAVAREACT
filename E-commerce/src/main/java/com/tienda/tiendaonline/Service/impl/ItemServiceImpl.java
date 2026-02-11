package com.tienda.tiendaonline.Service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.tienda.tiendaonline.Repository.CategoryRepository;
import com.tienda.tiendaonline.Repository.ItemRepository;
import com.tienda.tiendaonline.Service.ItemService;
import com.tienda.tiendaonline.entity.CategoryEntity;
import com.tienda.tiendaonline.entity.ItemEntity;
import com.tienda.tiendaonline.io.ItemRequest;
import com.tienda.tiendaonline.io.ItemResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            String imgUrl = "http://localhost:8080/api/uploads/" + fileName;

            ItemEntity newItem = convertToEntity(request);
            CategoryEntity existingCategory = categoryRepository.findByCategoryID(request.getCategoryID())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

            newItem.setCategory(existingCategory);
            newItem.setImageURL(imgUrl);
            newItem = itemRepository.save(newItem);
            return convertToResponse(newItem);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file locally", e);
        }
    }

    private ItemResponse convertToResponse(ItemEntity item) {
        return ItemResponse.builder()
                .itemID(item.getItemID())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imageURL(item.getImageURL())
                .categoryName(item.getCategory().getName())
                .categoryID(item.getCategory().getCategoryID())
                .stock(item.getStock())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemID(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll().stream().map(itemEntity -> convertToResponse(itemEntity))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemID) {
        ItemEntity existingItem = itemRepository.findByItemID(itemID)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));

        String imgUrl = existingItem.getImageURL();
        if (imgUrl != null && !imgUrl.isEmpty()) {
            try {
                String fileName = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
                Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
                Path filePath = uploadPath.resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log and continue or throw depending on importance
                e.printStackTrace();
            }
        }

        itemRepository.delete(existingItem);
    }
}
