import React, { createContext, useState } from 'react';

const RoomContext = createContext();

const MOCK_ROOMS = [
  {
    id: 'r1',
    name: 'City View Deluxe',
    type: 'deluxe',
    price: 129,
    beds: 2,
    guests: 3,
    image: 'https://media.istockphoto.com/id/533338000/photo/interior-of-a-hotel-bedroom.webp?a=1&b=1&s=612x612&w=0&k=20&c=5G-nPW2oxTBWMljIGrr09eRiAn6LsWbFxE8EGsSNz6Q='
  },
  {
    id: 'r2',
    name: 'Suite with Balcony',
    type: 'suite',
    price: 229,
    beds: 2,
    guests: 4,
    image: 'https://plus.unsplash.com/premium_photo-1681487479203-464a22302b27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdGVscyUyMHJvb218ZW58MHx8MHx8fDA%3D'
  },
  {
    id: 'r3',
    name: 'Cozy Single Room',
    type: 'single',
    price: 79,
    beds: 1,
    guests: 1,
    image: 'https://plus.unsplash.com/premium_photo-1678297270523-8775c817d0b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWxzJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D'
  }
];

export const RoomProvider = ({ children }) => {
  // initialize rooms from localStorage if available
  const [rooms, setRooms] = useState(() => {
    try {
      const raw = localStorage.getItem('rooms');
      return raw ? JSON.parse(raw) : MOCK_ROOMS;
    } catch (err) {
      return MOCK_ROOMS;
    }
  });

  const persistRooms = (next) => {
    try {
      localStorage.setItem('rooms', JSON.stringify(next));
    } catch (err) {
      // ignore storage errors
    }
  };

  const getRoomById = (id) => rooms.find((r) => String(r.id) === String(id));

  const searchRooms = (filters) => {
    return rooms.filter((r) => {
      if (filters.guests && r.guests < filters.guests) return false;
      if (filters.type && filters.type !== 'any' && r.type !== filters.type) return false;
      return true;
    });
  };

  const addRoom = (room) => {
    setRooms((prev) => {
      const next = [room, ...prev];
      persistRooms(next);
      return next;
    });
  };

  const updateRoom = (id, updates) => {
    setRooms((prev) => {
      const next = prev.map((r) => (String(r.id) === String(id) ? { ...r, ...updates } : r));
      persistRooms(next);
      return next;
    });
  };

  const deleteRoom = (id) => {
    setRooms((prev) => {
      const next = prev.filter((r) => String(r.id) !== String(id));
      persistRooms(next);
      return next;
    });
  };

  return (
    <RoomContext.Provider value={{ rooms, getRoomById, searchRooms, addRoom, updateRoom, deleteRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
