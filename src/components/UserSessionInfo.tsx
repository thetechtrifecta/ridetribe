import * as React from 'react';
import Typography from '@mui/material/Typography';
import { currentUser } from "@clerk/nextjs/server";

export default async function UserSessionInfo() {
  const user = await currentUser()
  if (!user) return
  return (
    <Typography>
      Hello {user?.firstName} with primary email {user?.primaryEmailAddress?.emailAddress}
    </Typography>
  );
}
