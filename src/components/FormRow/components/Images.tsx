import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

// Types
declare global {
  interface ImportMetaEnv {
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_URL: string;
    readonly VITE_GOOGLE_CSE_API_KEY?: string;
    readonly VITE_GOOGLE_CSE_CX_ID?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

type GoogleImagePickerProps = {
  onSelect: (url: string) => void;
  defaultValue: string;
  toggle: () => void;
};

type ImageItem = {
  link: string;
  title?: string;
};

// Replace hardcoded keys with Vite env variables
const API_KEY = import.meta.env.VITE_GOOGLE_CSE_API_KEY as string;
const CX_ID = import.meta.env.VITE_GOOGLE_CSE_CX_ID as string;

export default function Images({ onSelect, defaultValue, toggle }: GoogleImagePickerProps) {
  const [query, setQuery] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const searchImages = useCallback(async () => {
    if (!query) return;
    if (!API_KEY || !CX_ID) {
      console.warn("Missing env vars VITE_GOOGLE_CSE_API_KEY or VITE_GOOGLE_CSE_CX_ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          query,
        )}&cx=${CX_ID}&key=${API_KEY}&searchType=image&num=10`,
      );
      const data = (await res.json()) as {
        items?: ImageItem[];
      };
      setImages(data.items || []);
    } catch (err) {
      console.error("Google Search API error:", err);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    void searchImages();
  }, [searchImages]);

  const toggleSelect = (url: string) => {
    setSelected((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  };

  const handleSave = () => {
    if (selected.length > 0) {
      // If multiple selected, use the first one for onSelect
      onSelect(selected[0]);
    }
  };

  return (
    <Dialog open={true} onClose={toggle} fullWidth maxWidth="md" disablePortal>
      <DialogTitle>Pick an Image</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          <Box flex={1}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <TextField
                variant="standard"
                label="Search images"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={searchImages}>
                Search
              </Button>
            </div>

            {loading ? (
              <CircularProgress />
            ) : (
              <ImageList cols={4} gap={8}>
                {images.map((img) => {
                  const isSelected = selected.includes(img.link);
                  return (
                    <ImageListItem
                      key={img.link}
                      onClick={() => toggleSelect(img.link)}
                      style={{
                        cursor: "pointer",
                        outline: isSelected ? "3px solid #1976d2" : "none",
                        borderRadius: 8,
                      }}
                      title={isSelected ? "Click to unselect" : "Click to select"}
                    >
                      <img
                        src={img.link}
                        alt={img.title || "search result"}
                        style={{
                          borderRadius: 8,
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
            )}
          </Box>
          <Box width={220}>
            <strong>Selected</strong>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {selected.length === 0 ? (
                <span style={{ color: "#666" }}>No images selected</span>
              ) : (
                selected.map((url) => (
                  <div key={url} style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    <Button size="small" variant="outlined" onClick={() => toggleSelect(url)}>
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={selected.length === 0}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
