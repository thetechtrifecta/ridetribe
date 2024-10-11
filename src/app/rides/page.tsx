"use client"

import React from 'react';
import RidesList from '@/components/RidesList';
import CreateRide from '@/components/CreateRide';

const Rides: React.FC = () => {
  return (
    <>
      <CreateRide />
      <RidesList />
    </>
  );
};

export default Rides;
