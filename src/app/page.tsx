import * as React from 'react';
import SyncUser from '@/components/SyncUser';
import { currentUser } from "@clerk/nextjs/server";
import Splash from '@/components/Splash';
import Intro from '@/components/Intro';

export default async function Home() {
  const user = await currentUser()
  if (!user) return (
    <Splash />
  )
  return (
    <>
      <SyncUser />
      <Intro />
    </>
  )
}
