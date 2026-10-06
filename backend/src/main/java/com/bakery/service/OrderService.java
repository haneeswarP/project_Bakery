package com.bakery.service;

import com.bakery.dto.OrderRequestDTO;
import com.bakery.dto.OrderResponseDTO;
import com.bakery.dto.OrderStatusUpdateDTO;
import com.bakery.entity.Order;
import com.bakery.entity.OrderStatus;
import com.bakery.exception.OrderNotFoundException;
import com.bakery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
    
    /**
     * Create a new order
     */
    public OrderResponseDTO createOrder(OrderRequestDTO orderRequest) {
        Order order = new Order(
            orderRequest.getProduct(),
            orderRequest.getQuantity(),
            orderRequest.getCustomization(),
            orderRequest.getDeliveryDate(),
            orderRequest.getDeliveryAddress(),
            orderRequest.getContactDetails(),
            orderRequest.getTotalAmount()
        );
        
        Order savedOrder = orderRepository.save(order);
        return convertToResponseDTO(savedOrder);
    }
    
    /**
     * Get all orders
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAllOrderByCreatedAtDesc();
        return orders.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
    }
    
    /**
     * Get order by ID
     */
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        return convertToResponseDTO(order);
    }
    
    /**
     * Update order status
     */
    public OrderResponseDTO updateOrderStatus(Long id, OrderStatusUpdateDTO statusUpdate) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + id));
        
        order.setStatus(statusUpdate.getStatus());
        Order updatedOrder = orderRepository.save(order);
        return convertToResponseDTO(updatedOrder);
    }
    
    /**
     * Get orders by status
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
    }
    
    /**
     * Get order count by status
     */
    @Transactional(readOnly = true)
    public long getOrderCountByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
    
    /**
     * Convert Order entity to OrderResponseDTO
     */
    private OrderResponseDTO convertToResponseDTO(Order order) {
        return new OrderResponseDTO(
            order.getId(),
            order.getProduct(),
            order.getQuantity(),
            order.getCustomization(),
            order.getDeliveryDate(),
            order.getDeliveryAddress(),
            order.getContactDetails(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getCreatedAt(),
            order.getUpdatedAt()
        );
    }
}