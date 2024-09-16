import * as React from 'react';
import SyncUser from '@/components/SyncUser';
import { currentUser } from "@clerk/nextjs/server";
import UserSessionInfo from '@/components/UserSessionInfo';
import Box from '@mui/material/Box';
import Image from 'next/image';
import logo from '../../public/images/carpooling.png';  

export default async function Home() {
  const user = await currentUser()
  if (!user) return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={logo} alt="Logo" width={200} height={200} />
    </Box>
  )
  return (
    <>
      <SyncUser />
      <UserSessionInfo />
    </>
  )
}
