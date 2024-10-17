"use client"

import React from 'react';
import RidesList from '@/components/RidesList';
import CreateRide from '@/components/CreateRide';
import CreateEvent from '@/components/CreateEvent';

const Rides: React.FC = () => {
  return (
    <>
      <CreateEvent />
      <CreateRide />
      {/* <RidesList /> */}
    </>
  );
};

export default Rides;
