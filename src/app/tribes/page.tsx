"use client"

import React from 'react';
import Share from '@/components/Share';
import UserSearch from '@/components/UserSearch';
import ConnectionsList from '@/components/ConnectionsList';

const Tribes = () => {
  const handleAddConnection = async (userId: number): Promise<void> => {
    try {
      const response = await fetch('/api/user/connections/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add connection');
      }

      alert('Connection added successfully');
    } catch (error) {
      console.error('Error adding connection:', error);
      alert('Failed to add connection');
    }
  };

  return (
    <>
      <Share />
      <UserSearch onAddConnection={handleAddConnection} />
      <ConnectionsList />
    </>
  );
};

export default Tribes;
