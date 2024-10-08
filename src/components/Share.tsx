import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import NextLink from 'next/link';
import Button from '@mui/material/Button';

export default function Share() {
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
        <Box sx={{ maxWidth: 'sm' }}>
          <Button color="secondary" variant="contained" component={NextLink} href="sms:?body=Join my Tribe for shared Rides with our Kids at RideTribe.co" sx={{ margin: .25 }}>
            Invite my Tribe
          </Button>
        </Box>
      </Box>
    </Container>
  );
}