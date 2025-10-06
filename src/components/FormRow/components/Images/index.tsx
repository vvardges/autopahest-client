import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
} from "@mui/material";
import { useState } from "react";

import Search from "./components/Search";
import Upload from "./components/Upload";

type GoogleImagePickerProps = {
  onSelect: (url: string[]) => void;
  defaultValue: string;
  toggle: () => void;
  defaultSelected?: string[];
};

export default function Images({
  onSelect,
  defaultValue,
  toggle,
  defaultSelected = [],
}: GoogleImagePickerProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  const toggleSelect = (url: string) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  const handleSelect = (urls: string[]) => {
    setSelected([...selected, ...urls]);
  };

  const handleSave = () => {
    onSelect(selected);
    toggle();
  };

  return (
    <Dialog
      open={true}
      onClose={toggle}
      fullWidth
      maxWidth="md"
      disablePortal
      fullScreen
    >
      <DialogContent>
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          height="100%"
        >
          <Box flex={1}>
            <Search defaultValue={defaultValue} onSelect={handleSelect} />
          </Box>
          <Box width={220}>
            <Upload onSubmit={handleSelect} />
            <Box
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {selected.length === 0 ? (
                <span style={{ color: "#666" }}>No images selected</span>
              ) : (
                selected.map((url) => (
                  <div
                    key={url}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img
                      src={url}
                      alt="selected"
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #eee",
                      }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleSelect(url)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
