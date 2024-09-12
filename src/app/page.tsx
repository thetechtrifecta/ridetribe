import * as React from 'react';
import SyncUser from '@/components/SyncUser';
import CreateRide from '@/components/CreateRide';
import { currentUser } from "@clerk/nextjs/server";
import Title from '@/components/Title';
import Share from '@/components/Share';
// import UserSessionInfo from '@/components/UserSessionInfo';

export default async function Home() {
  const user = await currentUser()
  if (!user) return (
    <Title />
  );
  return (
    <>
      <Title />
      <Share />
      <SyncUser />
      {/* <UserSessionInfo /> */}
      <CreateRide />
    </>
  )
}
