"use client"

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'; 
import { useUser } from '@clerk/clerk-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const pages = [
  { name: 'Rides', path: '/rides' },
  { name: 'Tribes', path: '/tribes' },
  { name: 'Kids', path: '/kids' }
];

function ResponsiveAppBar() {
  const router = useRouter(); // Get the router object
  const { isSignedIn, user } = useUser();

  const handleNavigation = (path: string) => {
    router.push(path); // Use router.push to navigate
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 0,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer', // Make it appear clickable
            }}
            onClick={() => handleNavigation('/')} // Navigate to home page on click
          >
            RIDETRIBE
          </Typography>
          
          {
            isSignedIn &&
              pages.map((page) => (
                <Button
                  key={page.name}
                  sx={{
                    color: 'white', 
                    display: 'block', 
                    marginLeft: 2,
                    textDecoration: 'none',  // Removing underline
                    '&:hover, &:focus': {
                      textDecoration: 'none',  // Ensures no underline on hover or focus
                    }
                  }}
                  onClick={() => handleNavigation(page.path)} // Add onClick event to handle navigation
                >
                  {page.name}
                </Button>
              ))
          }

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <SignedOut>
              <SignInButton>
                <Button color="inherit">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
