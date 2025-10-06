import {
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import supabase from "@/supabese";

function proxyImageUrl(originalUrl: string) {
  // Remove protocol if needed (weserv.nl requires that sometimes)
  const cleanUrl = originalUrl.replace(/^https?:\/\//, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}`;
}

async function transfer(url: string) {
  const response = await fetch(proxyImageUrl(url));
  if (!response.ok) throw new Error(`Failed to fetch: ${url}`);

  const blob = await response.blob();
  const ext = blob.type.split("/")[1] || "jpg";
  const fileName = `from-google/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
    });

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);
  return data.publicUrl;
}

type ImageItem = {
  link: string;
  title?: string;
};

// Replace hardcoded keys with Vite env variables
const API_KEY = import.meta.env.VITE_GOOGLE_CSE_API_KEY as string;
const CX_ID = import.meta.env.VITE_GOOGLE_CSE_CX_ID as string;

type Props = {
  defaultValue: string;
  onSelect: (urls: string[]) => void;
};

function Search({ defaultValue, onSelect }: Props) {
  const [query, setQuery] = useState<string>(defaultValue);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const searchImages = useCallback(async () => {
    if (!query) return;
    if (!API_KEY || !CX_ID) {
      console.warn(
        "Missing env vars VITE_GOOGLE_CSE_API_KEY or VITE_GOOGLE_CSE_CX_ID",
      );
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

  const handleSelect = async (url: string) => {
    try {
      const newUrl = await transfer(url);
      onSelect([newUrl]);
    } catch (error) {
      console.error("Error transferring image:", error);
    }
  };

  return (
    <>
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
        <ImageList cols={5} gap={8}>
          {images.map((img) => {
            return (
              <ImageListItem
                key={img.link}
                onClick={() => handleSelect(img.link)}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                }}
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
    </>
  );
}

export default Search;
