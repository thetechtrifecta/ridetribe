"use client"

import React from 'react';
// import RidesList from '@/components/RidesList';
import CreateRide from '@/components/CreateRide';
import CreateEvent from '@/components/CreateEvent';
import EventsList from '@/components/EventsList';

const Rides: React.FC = () => {
  return (
    <>
      <CreateEvent />
      {/* <CreateRide /> */}
      <EventsList />
      {/* <RidesList /> */}
    </>
  );
};

export default Rides;
