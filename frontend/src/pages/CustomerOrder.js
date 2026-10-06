import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, PRODUCTS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CustomerOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    customization: '',
    deliveryDate: '',
    deliveryAddress: '',
    contactDetails: '',
    totalAmount: 0
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Calculate total when product or quantity changes
    if (name === 'product' || name === 'quantity') {
      calculateTotal(name === 'product' ? value : formData.product, 
                    name === 'quantity' ? parseInt(value) || 0 : formData.quantity);
    }
  };

  // Calculate total amount
  const calculateTotal = (product, quantity) => {
    const selectedProduct = PRODUCTS.find(p => p.name === product);
    if (selectedProduct && quantity > 0) {
      const total = selectedProduct.price * quantity;
      setFormData(prev => ({
        ...prev,
        totalAmount: total
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        totalAmount: 0
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.product) {
      newErrors.product = 'Product is required';
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else {
      const selectedDate = new Date(formData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.deliveryDate = 'Delivery date must be in the future';
      }
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.contactDetails.trim()) {
      newErrors.contactDetails = 'Contact details are required';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Invalid total amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        totalAmount: parseFloat(formData.totalAmount)
      };

      const createdOrder = await orderApi.createOrder(orderData);
      
      // Navigate to confirmation page
      navigate(`/order-confirmation/${createdOrder.id}`);
    } catch (err) {
      console.error('Error creating order:', err);
      
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date for delivery (tomorrow)
  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return <LoadingSpinner message="Placing your order..." />;
  }

  return (
    <div className="card">
      <h2>Place Your Bakery Order</h2>
      
      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="product">Product *</label>
            <select
              id="product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              className={errors.product ? 'error' : ''}
            >
              <option value="">Select a product</option>
              {PRODUCTS.map((product) => (
                <option key={product.name} value={product.name}>
                  {product.name} - ${product.price.toFixed(2)}
                </option>
              ))}
            </select>
            {errors.product && <span className="error-text">{errors.product}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              className={errors.quantity ? 'error' : ''}
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="customization">Special Customization</label>
          <textarea
            id="customization"
            name="customization"
            value={formData.customization}
            onChange={handleInputChange}
            placeholder="Any special requests for your order (e.g., message on cake, dietary requirements)..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="deliveryDate">Delivery Date *</label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              min={getMinDeliveryDate()}
              className={errors.deliveryDate ? 'error' : ''}
            />
            {errors.deliveryDate && <span className="error-text">{errors.deliveryDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactDetails">Contact Details *</label>
            <input
              type="text"
              id="contactDetails"
              name="contactDetails"
              value={formData.contactDetails}
              onChange={handleInputChange}
              placeholder="Phone number or email"
              className={errors.contactDetails ? 'error' : ''}
            />
            {errors.contactDetails && <span className="error-text">{errors.contactDetails}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deliveryAddress">Delivery Address *</label>
          <textarea
            id="deliveryAddress"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            placeholder="Full delivery address including city and postal code"
            className={errors.deliveryAddress ? 'error' : ''}
          />
          {errors.deliveryAddress && <span className="error-text">{errors.deliveryAddress}</span>}
        </div>

        {formData.totalAmount > 0 && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-detail">
              <span>Product:</span>
              <span>{formData.product}</span>
            </div>
            <div className="order-detail">
              <span>Quantity:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="order-detail total">
              <span>Total Amount:</span>
              <span>${formData.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || formData.totalAmount <= 0}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CustomerOrder;