import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaCandyCane,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaShoppingCart,
  FaBox,
} from 'react-icons/fa';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import RestockModal from '../components/RestockModal';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [searchQuery, setSearchQuery] = useState({ name: '', category: '', minPrice: '', maxPrice: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [searchQuery, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await axios.get('https://web-production-80c12.up.railway.app/api/sweets');
      setSweets(response.data.sweets);
      setFilteredSweets(response.data.sweets);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.name) params.append('name', searchQuery.name);
      if (searchQuery.category) params.append('category', searchQuery.category);
      if (searchQuery.minPrice) params.append('minPrice', searchQuery.minPrice);
      if (searchQuery.maxPrice) params.append('maxPrice', searchQuery.maxPrice);

      if (params.toString()) {
        const response = await axios.get(`https://web-production-80c12.up.railway.app/api/sweets/search?${params.toString()}`);
        setFilteredSweets(response.data.sweets);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (error) {
      console.error('Error searching sweets:', error);
      // Fallback to showing all sweets if search fails
      setFilteredSweets(sweets);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      await axios.post(`https://web-production-80c12.up.railway.app/api/sweets/${sweetId}/purchase`, { quantity });
      fetchSweets();
      setToast({ message: 'Purchase successful!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Purchase failed', type: 'error' });
    }
  };

  const handleRestock = async (sweetId, quantity) => {
    try {
      await axios.post(`https://web-production-80c12.up.railway.app/api/sweets/${sweetId}/restock`, { quantity });
      fetchSweets();
      setShowRestockModal(false);
      setRestockingSweet(null);
      setToast({ message: `Successfully added ${quantity} items to stock!`, type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Restock failed', type: 'error' });
    }
  };

  const handleCreate = async (sweetData) => {
    try {
      await axios.post('https://web-production-80c12.up.railway.app/api/sweets', sweetData);
      fetchSweets();
      setShowModal(false);
      setToast({ message: 'Sweet created successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to create sweet', type: 'error' });
    }
  };

  const handleUpdate = async (sweetId, sweetData) => {
    try {
      await axios.put(`https://web-production-80c12.up.railway.app/api/sweets/${sweetId}`, sweetData);
      fetchSweets();
      setShowModal(false);
      setEditingSweet(null);
      setToast({ message: 'Sweet updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to update sweet', type: 'error' });
    }
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await axios.delete(`https://web-production-80c12.up.railway.app/api/sweets/${sweetId}`);
      fetchSweets();
      setToast({ message: 'Sweet deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to delete sweet', type: 'error' });
    }
  };

  const openCreateModal = () => {
    setEditingSweet(null);
    setShowModal(true);
  };

  const openEditModal = (sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSweet(null);
  };

  const openRestockModal = (sweet) => {
    setRestockingSweet(sweet);
    setShowRestockModal(true);
  };

  const closeRestockModal = () => {
    setShowRestockModal(false);
    setRestockingSweet(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <FaCandyCane className="header-icon" />
            <h1>Sweet Shop Management</h1>
          </div>
          <div className="header-right">
            <span className="user-info">
              Welcome, <strong>{user?.username}</strong>
              {isAdmin() && <span className="admin-badge">Admin</span>}
            </span>
            <button onClick={logout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-toolbar">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {isAdmin() && (
            <button onClick={openCreateModal} className="add-button">
              <FaPlus /> Add New Sweet
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="sweets-grid">
            {filteredSweets.length === 0 ? (
              <div className="empty-state">
                <FaCandyCane className="empty-icon" />
                <p>No sweets found</p>
              </div>
            ) : (
              filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  onEdit={isAdmin() ? openEditModal : null}
                  onDelete={isAdmin() ? handleDelete : null}
                  onRestock={isAdmin() ? openRestockModal : null}
                  isAdmin={isAdmin()}
                />
              ))
            )}
          </div>
        )}
      </div>

      {showModal && (
        <SweetModal
          sweet={editingSweet}
          onClose={closeModal}
          onSave={editingSweet ? handleUpdate : handleCreate}
        />
      )}

      {showRestockModal && restockingSweet && (
        <RestockModal
          sweet={restockingSweet}
          onClose={closeRestockModal}
          onRestock={handleRestock}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

