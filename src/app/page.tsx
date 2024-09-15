import * as React from 'react';
import SyncUser from '@/components/SyncUser';
import CreateRide from '@/components/CreateRide';
import { currentUser } from "@clerk/nextjs/server";
import Title from '@/components/Title';
import CreateKid from '@/components/CreateKid';
import UserSessionInfo from '@/components/UserSessionInfo';
import RidesList from '@/components/RidesList';

export default async function Home() {
  const user = await currentUser()
  if (!user) return (
    <Title />
  );
  return (
    <>
      <Title />
      <SyncUser />
      <UserSessionInfo />
      <RidesList />
      <CreateRide />
      <CreateKid />
    </>
  )
}
