import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { Kid } from '@/types/types'; 

interface SelectKidsProps {
  onChange: (selectedKids: Kid[]) => void;
}

const SelectKids: React.FC<SelectKidsProps> = ({ onChange }) => {
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKids, setSelectedKids] = useState<Kid[]>([]);

  useEffect(() => {
    async function fetchKids() {
      try {
        const response = await fetch('/api/kids');
        if (!response.ok) {
          throw new Error('Failed to fetch kids');
        }
        const data = await response.json();
        setKids(data);
      } catch (error) {
        console.error('Error fetching kids:', error);
      }
    }

    fetchKids();
  }, []);

  const handleSelect = (event: React.ChangeEvent<{}>, newValue: Kid[]) => {
    setSelectedKids(newValue);
    onChange(newValue);
  };

  return (
    <Autocomplete
      multiple
      id="select-kids"
      options={kids}
      disableCloseOnSelect
      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
      value={selectedKids}
      onChange={handleSelect}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox checked={selected} style={{ marginRight: 8 }} />
          {`${option.firstName} ${option.lastName}`}
        </li>
      )}
      style={{ width: '100%' }}
      renderInput={(params) => (
        <TextField {...params} label="Kids" variant="outlined" fullWidth margin="normal"/>
      )}
    />
  );
};

export default SelectKids;
