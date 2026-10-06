import React, { useState, useEffect } from 'react';
import { orderApi, ORDER_STATUS } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const BakerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderApi.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [orderId]: true }));
      
      const updatedOrder = await orderApi.updateOrderStatus(orderId, newStatus);
      
      // Update the orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );

      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      [ORDER_STATUS.PENDING]: ORDER_STATUS.CONFIRMED,
      [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PREPARING,
      [ORDER_STATUS.PREPARING]: ORDER_STATUS.OUT_FOR_DELIVERY,
      [ORDER_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.DELIVERED,
      [ORDER_STATUS.DELIVERED]: null
    };
    return statusFlow[currentStatus];
  };

  const getStatusActionText = (currentStatus) => {
    const actionTexts = {
      [ORDER_STATUS.PENDING]: 'Confirm Order',
      [ORDER_STATUS.CONFIRMED]: 'Start Preparing',
      [ORDER_STATUS.PREPARING]: 'Out for Delivery',
      [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Mark Delivered',
      [ORDER_STATUS.DELIVERED]: 'Completed'
    };
    return actionTexts[currentStatus];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <div>
      <div className="card">
        <h2>Baker Dashboard</h2>
        
        {error && (
          <div className="message message-error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            <h3>No orders yet!</h3>
            <p>Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <>
            {/* Order Statistics */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              {Object.values(ORDER_STATUS).map(status => (
                <div key={status} style={{ 
                  textAlign: 'center', 
                  padding: '1rem', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px' 
                }}>
                  <StatusBadge status={status} />
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    {getOrdersByStatus(status).length}
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Placed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <button 
                        className="btn" 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#8B4513', 
                          textDecoration: 'underline',
                          padding: 0,
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        #{order.id}
                      </button>
                    </td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>{formatDate(order.deliveryDate)}</td>
                    <td><StatusBadge status={order.status} /></td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>
                      {getNextStatus(order.status) && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                          disabled={updating[order.id]}
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                        >
                          {updating[order.id] ? 'Updating...' : getStatusActionText(order.status)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
                style={{ padding: '0.5rem 1rem' }}
              >
                ✕ Close
              </button>
            </div>

            <div className="order-summary">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4>Order Information</h4>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="order-detail">
                <span><strong>Product:</strong></span>
                <span>{selectedOrder.product}</span>
              </div>

              <div className="order-detail">
                <span><strong>Quantity:</strong></span>
                <span>{selectedOrder.quantity}</span>
              </div>

              {selectedOrder.customization && (
                <div className="order-detail" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span><strong>Customization:</strong></span>
                  <span style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#666' }}>
                    "{selectedOrder.customization}"
                  </span>
                </div>
              )}

              <div className="order-detail">
                <span><strong>Delivery Date:</strong></span>
                <span>{formatDate(selectedOrder.deliveryDate)}</span>
              </div>

              <div className="order-detail" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <span><strong>Delivery Address:</strong></span>
                <span style={{ marginTop: '0.5rem' }}>{selectedOrder.deliveryAddress}</span>
              </div>

              <div className="order-detail">
                <span><strong>Contact Details:</strong></span>
                <span>{selectedOrder.contactDetails}</span>
              </div>

              <div className="order-detail">
                <span><strong>Order Placed:</strong></span>
                <span>{formatDateTime(selectedOrder.createdAt)}</span>
              </div>

              <div className="order-detail total">
                <span><strong>Total Amount:</strong></span>
                <span>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {getNextStatus(selectedOrder.status) && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate(selectedOrder.id, getNextStatus(selectedOrder.status))}
                  disabled={updating[selectedOrder.id]}
                  style={{ width: '100%' }}
                >
                  {updating[selectedOrder.id] ? 'Updating...' : getStatusActionText(selectedOrder.status)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BakerDashboard;