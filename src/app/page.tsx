"use client"

import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Splash from '@/components/Splash';
import Intro from '@/components/Intro';

export default function Home() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/syncuser', { 
        method: 'POST',
        credentials: 'include' // Necessary for including session cookies in the request
      })
      .then(response => response.json())
      .then(data => console.log('Sync status:', data))
      .catch(error => console.error('Error syncing user:', error));
    }
  }, [isSignedIn]);

  if (!isSignedIn) return <Splash />;
  return <Intro />;
}

