import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await orderApi.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading order details..." />;
  }

  if (error) {
    return (
      <div className="card">
        <div className="message message-error">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">
          Place New Order
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card">
        <div className="message message-error">
          Order not found.
        </div>
        <Link to="/" className="btn btn-primary">
          Place New Order
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#28a745', marginBottom: '0.5rem' }}>
          🎉 Order Confirmed!
        </h2>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Thank you for your order! We'll start working on it soon.
        </p>
      </div>

      <div className="order-summary">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Order Details</h3>
          <StatusBadge status={order.status} />
        </div>

        <div className="order-detail">
          <span><strong>Order ID:</strong></span>
          <span>#{order.id}</span>
        </div>

        <div className="order-detail">
          <span><strong>Product:</strong></span>
          <span>{order.product}</span>
        </div>

        <div className="order-detail">
          <span><strong>Quantity:</strong></span>
          <span>{order.quantity}</span>
        </div>

        {order.customization && (
          <div className="order-detail" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span><strong>Customization:</strong></span>
            <span style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#666' }}>
              "{order.customization}"
            </span>
          </div>
        )}

        <div className="order-detail">
          <span><strong>Delivery Date:</strong></span>
          <span>{formatDate(order.deliveryDate)}</span>
        </div>

        <div className="order-detail" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <span><strong>Delivery Address:</strong></span>
          <span style={{ marginTop: '0.5rem' }}>{order.deliveryAddress}</span>
        </div>

        <div className="order-detail">
          <span><strong>Contact Details:</strong></span>
          <span>{order.contactDetails}</span>
        </div>

        <div className="order-detail">
          <span><strong>Order Placed:</strong></span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>

        <div className="order-detail total">
          <span><strong>Total Amount:</strong></span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>What's Next?</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>📋 Current Status: </strong>
            <StatusBadge status={order.status} />
          </div>
          
          <div style={{ color: '#666', lineHeight: '1.6' }}>
            <p><strong>📞 We'll contact you</strong> at {order.contactDetails} if we need any clarification about your order.</p>
            <p><strong>🚚 Delivery</strong> is scheduled for {formatDate(order.deliveryDate)} to the address you provided.</p>
            <p><strong>📱 Track your order</strong> by visiting the Baker Dashboard or contact us for updates.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <Link to="/" className="btn btn-primary">
          Place Another Order
        </Link>
        <Link to="/baker-dashboard" className="btn btn-secondary">
          View All Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;