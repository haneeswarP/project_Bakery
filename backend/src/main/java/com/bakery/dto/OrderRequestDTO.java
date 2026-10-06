package com.bakery.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class OrderRequestDTO {
    
    @NotBlank(message = "Product is required")
    private String product;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    private String customization;
    
    @NotNull(message = "Delivery date is required")
    @Future(message = "Delivery date must be in the future")
    private LocalDate deliveryDate;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    @NotBlank(message = "Contact details are required")
    private String contactDetails;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;
    
    // Constructors
    public OrderRequestDTO() {}
    
    public OrderRequestDTO(String product, Integer quantity, String customization,
                          LocalDate deliveryDate, String deliveryAddress,
                          String contactDetails, BigDecimal totalAmount) {
        this.product = product;
        this.quantity = quantity;
        this.customization = customization;
        this.deliveryDate = deliveryDate;
        this.deliveryAddress = deliveryAddress;
        this.contactDetails = contactDetails;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public String getProduct() {
        return product;
    }
    
    public void setProduct(String product) {
        this.product = product;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public String getCustomization() {
        return customization;
    }
    
    public void setCustomization(String customization) {
        this.customization = customization;
    }
    
    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }
    
    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }
    
    public String getDeliveryAddress() {
        return deliveryAddress;
    }
    
    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
    
    public String getContactDetails() {
        return contactDetails;
    }
    
    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}