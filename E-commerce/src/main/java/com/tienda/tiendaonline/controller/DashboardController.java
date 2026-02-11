package com.tienda.tiendaonline.controller;

import com.tienda.tiendaonline.Service.OrderService;
import com.tienda.tiendaonline.io.DashboardResponse;
import com.tienda.tiendaonline.io.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final OrderService orderService;

    @GetMapping
    public DashboardResponse getDashboardData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        String role = auth.getAuthorities().stream()
                .map(r -> r.getAuthority())
                .findFirst()
                .orElse("USER")
                .replace("ROLE_", "");

        LocalDate today = LocalDate.now();
        Double todaySale = orderService.sumSalesByDate(today, email, role);
        Long todayOrderCount = orderService.countByOrderDate(today, email, role);
        List<OrderResponse> recentOrders = orderService.findRecentOrders(email, role);

        return new DashboardResponse(
                todaySale != null ? todaySale : 0.0,
                todayOrderCount != null ? todayOrderCount : 0L,
                recentOrders);
    }
}
