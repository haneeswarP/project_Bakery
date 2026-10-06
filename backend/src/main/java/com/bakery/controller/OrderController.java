package com.bakery.controller;

import com.bakery.dto.OrderRequestDTO;
import com.bakery.dto.OrderResponseDTO;
import com.bakery.dto.OrderStatusUpdateDTO;
import com.bakery.entity.OrderStatus;
import com.bakery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    
    private final OrderService orderService;
    
    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    /**
     * Create a new order
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO orderRequest) {
        OrderResponseDTO createdOrder = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
    
    /**
     * Get all orders
     * GET /api/orders
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        List<OrderResponseDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    
    /**
     * Get order by ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id) {
        OrderResponseDTO order = orderService.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
    
    /**
     * Update order status
     * PUT /api/orders/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id, 
            @Valid @RequestBody OrderStatusUpdateDTO statusUpdate) {
        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(id, statusUpdate);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
    
    /**
     * Get orders by status
     * GET /api/orders?status={status}
     */
    @GetMapping(params = "status")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@RequestParam OrderStatus status) {
        List<OrderResponseDTO> orders = orderService.getOrdersByStatus(status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }
    
    /**
     * Get order count by status
     * GET /api/orders/count?status={status}
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getOrderCountByStatus(@RequestParam OrderStatus status) {
        long count = orderService.getOrderCountByStatus(status);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}