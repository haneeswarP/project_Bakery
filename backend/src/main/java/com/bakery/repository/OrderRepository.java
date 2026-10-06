package com.bakery.repository;

import com.bakery.entity.Order;
import com.bakery.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find orders by status
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    
    // Find orders by delivery date
    List<Order> findByDeliveryDateOrderByCreatedAtDesc(LocalDate deliveryDate);
    
    // Find all orders ordered by creation date (most recent first)
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();
    
    // Count orders by status
    long countByStatus(OrderStatus status);
}