"use client"

import React from 'react';
import CreateEvent from '@/components/CreateEvent';
import EventsList from '@/components/EventsList';

const Rides: React.FC = () => {
  return (
    <>
      <CreateEvent />
      <EventsList />
    </>
  );
};

export default Rides;
