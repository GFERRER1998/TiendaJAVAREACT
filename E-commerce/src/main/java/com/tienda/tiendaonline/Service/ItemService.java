package com.tienda.tiendaonline.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tienda.tiendaonline.io.ItemRequest;
import com.tienda.tiendaonline.io.ItemResponse;

@Service
public interface ItemService {
    
    ItemResponse add(ItemRequest request, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemID);

}
