import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import ProTip from '@/components/ProTip';
import Copyright from '@/components/Copyright';
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          RideTribe
        </Typography>
        <Typography>
          Hello {user?.firstName} with primary email {user?.primaryEmailAddress?.emailAddress}
        </Typography>
        {/* <Link href="/about" color="secondary" component={NextLink}>
          Go to the about page
        </Link> */}
        {/* <ProTip />
        <Copyright /> */}
      </Box>
    </Container>
  );
}
