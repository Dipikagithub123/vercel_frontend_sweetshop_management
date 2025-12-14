import React from 'react';
import { FaEdit, FaTrash, FaShoppingCart, FaBox } from 'react-icons/fa';
import './SweetCard.css';

const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, onRestock, isAdmin }) => {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className={`sweet-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="sweet-card-header">
        <h3>{sweet.name}</h3>
        <span className="sweet-category">{sweet.category}</span>
      </div>

      <div className="sweet-card-body">
        <div className="sweet-price">${sweet.price.toFixed(2)}</div>
        <div className="sweet-quantity">
          <FaBox /> {sweet.quantity} in stock
        </div>
      </div>

      <div className="sweet-card-actions">
        <button
          onClick={() => onPurchase(sweet._id, 1)}
          className="purchase-button"
          disabled={isOutOfStock}
        >
          <FaShoppingCart /> Purchase
        </button>

        {isAdmin && (
          <div className="admin-actions">
            <button onClick={() => onEdit(sweet)} className="edit-button" title="Edit">
              <FaEdit />
            </button>
            <button onClick={() => onDelete(sweet._id)} className="delete-button" title="Delete">
              <FaTrash />
            </button>
            <button
              onClick={() => onRestock(sweet)}
              className="restock-button"
              title="Restock"
            >
              <FaBox />
            </button>
          </div>
        )}
      </div>

      {isOutOfStock && (
        <div className="out-of-stock-badge">Out of Stock</div>
      )}
    </div>
  );
};

export default SweetCard;

