import { Typography, Box, Paper, Grid } from '@mui/material';

// Define an interface for the pgUser prop
interface User {
    id?: number;
    clerkUserId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?  : string;
}

interface UserDisplayProps {
  pgUser: User | null;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ pgUser }) => {
  if (!pgUser) return null;

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        User Information
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">First Name:</Typography>
            <Typography variant="body1">{pgUser.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">User ID:</Typography>
            <Typography variant="body1">{pgUser.id}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">Primary Email:</Typography>
            <Typography variant="body1">{pgUser.email}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default UserDisplay;
