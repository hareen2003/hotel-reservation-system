import React, { useState, useContext } from 'react';
import '../../styles/ReservationManagement.css';
import ReservationContext from '../../context/ReservationContext';

const ReservationManagement = () => {
  const { reservations } = useContext(ReservationContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock additional reservation data for demo
  const enrichedReservations = (reservations || []).map((res, idx) => ({
    ...res,
    guestName: res.userName || `Guest ${idx + 1}`,
    status: res.status || 'confirmed',
    checkInDate: res.checkIn || '2024-11-20',
    checkOutDate: res.checkOut || '2024-11-25',
    nights: res.nights || 5,
    totalPrice: res.totalPrice || 500,
    room: res.roomName || `Room ${201 + idx}`,
    guestEmail: `guest${idx + 1}@example.com`,
    guestPhone: `+1 (555) ${100 + idx}-${2000 + idx}`,
  }));

  const filteredReservations = enrichedReservations.filter(res => {
    const matchesStatus = filter === 'all' || res.status === filter;
    const matchesSearch = res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         res.id.toString().includes(searchTerm) ||
                         res.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalReservations = enrichedReservations.length;
  const confirmedCount = enrichedReservations.filter(r => r.status === 'confirmed').length;
  const pendingCount = enrichedReservations.filter(r => r.status === 'pending').length;
  const totalRevenue = enrichedReservations.reduce((sum, r) => sum + r.totalPrice, 0);

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': 'status-confirmed',
      'pending': 'status-pending',
      'checked-in': 'status-checked-in',
      'checked-out': 'status-checked-out',
      'cancelled': 'status-cancelled',
    };
    return colors[status] || '';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'confirmed': '✓',
      'pending': '⏳',
      'checked-in': '→',
      'checked-out': '✓✓',
      'cancelled': '✕',
    };
    return icons[status] || '•';
  };

  const handleCancelReservation = (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      alert('Reservation cancelled successfully');
      setShowModal(false);
    }
  };

  return (
    <div className="reservation-management-container">
      <div className="management-header">
        <h1>Reservation Management</h1>
        <p className="subtitle">Monitor and manage all reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-content">
            <h4>Total Reservations</h4>
            <p className="stat-value">{totalReservations}</p>
            <span className="stat-label">All time bookings</span>
          </div>
          <div className="stat-icon">📅</div>
        </div>

        <div className="stat-card stat-confirmed">
          <div className="stat-content">
            <h4>Confirmed</h4>
            <p className="stat-value">{confirmedCount}</p>
            <span className="stat-label">Ready to check-in</span>
          </div>
          <div className="stat-icon">✓</div>
        </div>

        <div className="stat-card stat-pending">
          <div className="stat-content">
            <h4>Pending</h4>
            <p className="stat-value">{pendingCount}</p>
            <span className="stat-label">Awaiting confirmation</span>
          </div>
          <div className="stat-icon">⏳</div>
        </div>

        <div className="stat-card stat-revenue">
          <div className="stat-content">
            <h4>Total Revenue</h4>
            <p className="stat-value">${totalRevenue.toFixed(2)}</p>
            <span className="stat-label">From reservations</span>
          </div>
          <div className="stat-icon">💰</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by guest name, room, or reservation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'checked-in' ? 'active' : ''}`}
            onClick={() => setFilter('checked-in')}
          >
            Checked In
          </button>
        </div>
      </div>

      {/* Reservations Table - Desktop */}
      <div className="table-wrapper">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Guest Name</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map(res => (
              <tr key={res.id}>
                <td className="id-cell">#{res.id}</td>
                <td className="guest-cell">{res.guestName}</td>
                <td>{res.room}</td>
                <td>{res.checkInDate}</td>
                <td>{res.checkOutDate}</td>
                <td className="center">{res.nights}</td>
                <td className="amount">${res.totalPrice.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(res.status)}`}>
                    {getStatusIcon(res.status)} {res.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => {
                        setSelectedReservation(res);
                        setShowModal(true);
                      }}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button className="btn-icon" title="Edit">✎</button>
                    <button className="btn-icon" title="Send Email">✉️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reservations Cards - Mobile */}
      <div className="reservations-cards">
        {filteredReservations.map(res => (
          <div key={res.id} className="reservation-card">
            <div className="card-header">
              <div>
                <h3>{res.guestName}</h3>
                <p className="card-id">#{res.id}</p>
              </div>
              <span className={`status-badge ${getStatusColor(res.status)}`}>
                {getStatusIcon(res.status)} {res.status}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span>Room</span>
                <strong>{res.room}</strong>
              </div>
              <div className="detail-row">
                <span>Check-in</span>
                <strong>{res.checkInDate}</strong>
              </div>
              <div className="detail-row">
                <span>Check-out</span>
                <strong>{res.checkOutDate}</strong>
              </div>
              <div className="detail-row">
                <span>Nights</span>
                <strong>{res.nights}</strong>
              </div>
              <div className="detail-row">
                <span>Total Price</span>
                <strong className="amount">${res.totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setSelectedReservation(res);
                  setShowModal(true);
                }}
              >
                Details
              </button>
              <button className="btn btn-sm btn-secondary">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="empty-state">
          <p>📅 No reservations found matching your search criteria.</p>
        </div>
      )}

      {/* Reservation Detail Modal */}
      {showModal && selectedReservation && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservation Details</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Reservation Information</h3>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Reservation ID</label>
                    <p>#{selectedReservation.id}</p>
                  </div>
                  <div className="info-field">
                    <label>Status</label>
                    <p>
                      <span className={`status-badge ${getStatusColor(selectedReservation.status)}`}>
                        {getStatusIcon(selectedReservation.status)} {selectedReservation.status}
                      </span>
                    </p>
                  </div>
                  <div className="info-field">
                    <label>Room</label>
                    <p>{selectedReservation.room}</p>
                  </div>
                  <div className="info-field">
                    <label>Total Price</label>
                    <p className="amount">${selectedReservation.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Guest Information</h3>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Guest Name</label>
                    <p>{selectedReservation.guestName}</p>
                  </div>
                  <div className="info-field">
                    <label>Email</label>
                    <p>{selectedReservation.guestEmail}</p>
                  </div>
                  <div className="info-field">
                    <label>Phone</label>
                    <p>{selectedReservation.guestPhone}</p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Stay Details</h3>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Check-in Date</label>
                    <p>{selectedReservation.checkInDate}</p>
                  </div>
                  <div className="info-field">
                    <label>Check-out Date</label>
                    <p>{selectedReservation.checkOutDate}</p>
                  </div>
                  <div className="info-field">
                    <label>Number of Nights</label>
                    <p>{selectedReservation.nights}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn btn-primary">Send Confirmation</button>
              {selectedReservation.status !== 'cancelled' && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancelReservation(selectedReservation.id)}
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
