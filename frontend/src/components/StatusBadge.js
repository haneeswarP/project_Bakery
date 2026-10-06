import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'PREPARING':
        return 'Preparing';
      case 'OUT_FOR_DELIVERY':
        return 'Out for Delivery';
      case 'DELIVERED':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <span className={getStatusClass(status)}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;