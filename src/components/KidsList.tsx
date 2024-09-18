import React from 'react';
import { Typography, Paper, Box, Grid } from '@mui/material';
import DeleteKid from './DeleteKid'
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function KidsList() {
  const clerkUser = await currentUser();
  if (!clerkUser) return;

  const pgUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id }
  });

  const kids = await prisma.kid.findMany({
    where: { creatorId: pgUser?.id },
  });

  return (
    <Box sx={{ margin: 2 }}>
      {kids.map((kid) => (
        <Paper key={kid.id} elevation={3} sx={{ margin: 2, padding: 2, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Kid: {kid.firstName} {kid.lastName}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">Age:</Typography>
              <Typography variant="body1">{kid.age}</Typography>
            </Grid>
            {kid.phone && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Phone:</Typography>
                <Typography variant="body1">{kid.phone}</Typography>
              </Grid>
            )}
          </Grid>
          <DeleteKid kidId={kid.id} />
        </Paper>
      ))}
    </Box>
  );
};
