import React, { createContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

const RES_KEY = 'hrs_reservations';

const loadReservations = () => {
  try {
    const raw = localStorage.getItem(RES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(loadReservations);

  useEffect(() => {
    localStorage.setItem(RES_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const createReservation = (reservation) => {
    const newRes = { id: Date.now().toString(), ...reservation };
    setReservations(prev => [newRes, ...prev]);
    return newRes;
  };

  const cancelReservation = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ReservationContext.Provider value={{ reservations, createReservation, cancelReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
