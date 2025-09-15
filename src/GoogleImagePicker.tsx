import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  TextField
} from "@mui/material";
import { useCallback,useEffect, useState } from "react";

// Types
declare global {
  interface ImportMetaEnv {
    readonly VITE_GOOGLE_CSE_API_KEY?: string;
    readonly VITE_GOOGLE_CSE_CX_ID?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

type GoogleImagePickerProps = {
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultValue?: string;
};

type ImageItem = {
  link: string;
  title?: string;
};

// Replace hardcoded keys with Vite env variables
const API_KEY = import.meta.env.VITE_GOOGLE_CSE_API_KEY as string;
const CX_ID = import.meta.env.VITE_GOOGLE_CSE_CX_ID as string;

export default function GoogleImagePicker({
  onClose,
  onSelect,
  defaultValue
}: GoogleImagePickerProps) {
  const [query, setQuery] = useState<string>(defaultValue ?? "");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);

  const searchImages = useCallback(async() => {
    if (!query) return;
    if (!API_KEY || !CX_ID) {
      console.warn(
        "Missing env vars VITE_GOOGLE_CSE_API_KEY or VITE_GOOGLE_CSE_CX_ID"
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          query
        )}&cx=${CX_ID}&key=${API_KEY}&searchType=image&num=10`
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

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Pick an Image</DialogTitle>
      <DialogContent>
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
            {images.map((img) => (
              <ImageListItem
                key={img.link}
                onClick={() => onSelect(img.link)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={img.link}
                  alt={img.title || "search result"}
                  style={{ borderRadius: 8 }}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </DialogContent>
    </Dialog>
  );
}
