import React from 'react';
import RidesList from '@/components/RidesList';
import CreateRide from '@/components/CreateRide';

const Rides = () => {
  return (
    <>
        <CreateRide />
        <RidesList />
    </>
  )
};

export default Rides;
