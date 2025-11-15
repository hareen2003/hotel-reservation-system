import React, { useState } from "react";
import "../../styles/RoomManagement.css";
import useRooms from "../../hooks/useRooms";
import Icon from "../common/Icon";

const emptyRoom = {
  id: null,
  name: "",
  type: "",
  price: "",
  beds: "",
  guests: "",
  image: ""
};

const RoomManagement = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyRoom);
  const [imagePreview, setImagePreview] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyRoom);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingId(room.id);
    setForm({
      id: room.id,
      name: room.name,
      type: room.type,
      price: room.price,
      beds: room.beds,
      guests: room.guests,
      image: room.image
    });
    setImagePreview(room.image || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      beds: Number(form.beds),
      guests: Number(form.guests)
    };

    if (editingId) {
      updateRoom(editingId, payload);
    } else {
      addRoom({ ...payload, id: Date.now().toString() });
    }

    closeModal();
  };

  const handleDelete = (id) => {
    // open confirm dialog instead of native confirm
    setConfirmDeleteId(id);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const roomToDelete = rooms.find((r) => r.id === confirmDeleteId);

  const closeConfirm = () => setConfirmDeleteId(null);

  const confirmDelete = () => {
    if (confirmDeleteId) {
      deleteRoom(confirmDeleteId);
    }
    setConfirmDeleteId(null);
  };

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="admin-hero card" aria-hidden>
        <div className="hero-content">
          <h1>Room Management</h1>
          <p className="muted">
            Manage rooms, pricing and availability in one place.
          </p>
          <button className="btn primary" onClick={openAddModal}>
            <Icon name="plus" />
            <span style={{ marginLeft: 6 }}>Add room</span>
          </button>
        </div>
        <div className="hero-illustration">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
            alt="rooms"
          />
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="grid room-grid" style={{ marginTop: 16 }}>
        {rooms.map((r) => (
          <div key={r.id} className="room-item">
            {/* IMAGE */}
            <div className="room-image">
              <img src={r.image} alt={r.name} />
              <span className="badge badge-soft">
                {r.availability || "Available"}
              </span>
            </div>

            {/* BODY */}
            <div className="room-body">
              <div className="room-title">
                <h3>{r.name}</h3>
                <div className="meta">
                  <span className="badge badge-info">{r.type}</span>
                  <strong style={{ marginLeft: 8 }}>
                    ${r.price?.toLocaleString?.()}
                  </strong>
                </div>
              </div>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                {r.beds} beds • Sleeps {r.guests}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="room-actions">
              <button className="btn ghost" title="View">
                <Icon name="eye" />
              </button>
              <button
                className="btn secondary"
                title="Edit"
                onClick={() => openEditModal(r)}
              >
                <Icon name="edit" />
              </button>
              <button
                className="btn danger"
                title="Delete"
                onClick={() => handleDelete(r.id)}
              >
                <Icon name="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>{editingId ? "Edit room" : "Add new room"}</h2>
              <button className="icon-btn" onClick={closeModal}>
                <Icon name="x" />
              </button>
            </div>

            <form className="modal-body grid form-grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type</label>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Deluxe, Suite..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (USD / night)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Beds</label>
                <input
                  name="beds"
                  type="number"
                  min="1"
                  value={form.beds}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <input
                  name="guests"
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="preview" />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingId ? "Save changes" : "Create room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && roomToDelete && (
        <div className="modal-backdrop" onClick={closeConfirm}>
          <div
            className="modal card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>Delete Room</h2>
              <button className="icon-btn" onClick={closeConfirm}>
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-message">
                <p className="warning-icon">⚠️</p>
                <p className="confirmation-text">
                  Are you sure you want to delete <strong>{roomToDelete.name}</strong>?
                </p>
                <p className="confirmation-subtitle">
                  This action cannot be undone. The room will be permanently removed from the system.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn ghost" onClick={closeConfirm}>Cancel</button>
              <button className="btn danger" onClick={confirmDelete}>Delete Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
