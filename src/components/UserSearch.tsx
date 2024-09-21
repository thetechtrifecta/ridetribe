import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Button, Box, Typography } from '@mui/material';

interface UserSearchProps {
  onAddConnection: (userId: number) => Promise<void>;
}

const UserSearch: React.FC<UserSearchProps> = ({ onAddConnection }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (inputValue) {
      fetch(`/api/user/search?query=${encodeURIComponent(inputValue)}`)
        .then(response => response.json())
        .then(data => setOptions(data))
        .catch(error => {
          console.error('Fetching error:', error);
          setOptions([]); // Reset on error
        });
    }
  }, [inputValue]);

  return (
    <Box
      sx={{
        my: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Create my Tribe</Typography>
      <Autocomplete
        value={selectedUser}
        onChange={(event, newValue) => setSelectedUser(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Search Parents" variant="outlined" />}
        style={{ width: 300 }}
      />
      <Button
        onClick={() => selectedUser && onAddConnection(selectedUser.id)}
        disabled={!selectedUser}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Parent
      </Button>
    </Box>
  );
};

export default UserSearch;
