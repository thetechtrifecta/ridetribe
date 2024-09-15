import * as React from 'react';
import SyncUser from '@/components/SyncUser';
import { currentUser } from "@clerk/nextjs/server";
import Title from '@/components/Title';
import UserSessionInfo from '@/components/UserSessionInfo';

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
    </>
  )
}
