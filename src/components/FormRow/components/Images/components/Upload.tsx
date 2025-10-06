import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useCallback, useRef, useState } from "react";

import supabase from "@/supabese";

type UploadProps = {
  // Called after a successful upload with the list of public URLs
  onSubmit: (urls: string[]) => void | Promise<void>;
};

function generateUniquePath(file: File) {
  const ext =
    (file.type && file.type.split("/")[1]) ||
    (file.name.includes(".") ? file.name.split(".").pop() : "jpg") ||
    "jpg";
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2);
  return `uploads/${stamp}-${rand}-${safeName}.${ext}`;
}

async function uploadFiles(files: File[]): Promise<string[]> {
  const uploads = files.map(async (file) => {
    const path = generateUniquePath(file);

    const { error } = await supabase.storage.from("images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  });

  return Promise.all(uploads);
}

const Upload: React.FC<UploadProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickFiles = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFiles = useCallback(
    async (filesList: FileList | null) => {
      if (!filesList || filesList.length === 0) return;

      const files = Array.from(filesList).filter((f) =>
        f.type.startsWith("image/"),
      );

      if (files.length === 0) {
        setError("Please select image files only.");
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        const urls = await uploadFiles(files);
        await onSubmit(urls);
      } catch (e: any) {
        setError(e?.message || "Failed to upload images.");
      } finally {
        setIsUploading(false);
      }
    },
    [onSubmit],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void handleFiles(e.target.files);
      // Allow re-selecting the same file
      e.target.value = "";
    },
    [handleFiles],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      void handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging],
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <Stack spacing={1.5}>
      <Box
        role="button"
        tabIndex={0}
        onClick={pickFiles}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") pickFiles();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        sx={(theme) => ({
          border: "2px dashed",
          borderColor: isDragging
            ? theme.palette.primary.main
            : alpha(theme.palette.text.primary, 0.3),
          bgcolor: isDragging
            ? alpha(theme.palette.primary.main, 0.06)
            : "transparent",
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          cursor: "pointer",
          transition: "all .15s ease",
          outline: "none",
          "&:focus-visible": {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        })}
        aria-label="Upload images by clicking or dragging and dropping onto this area"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onInputChange}
          style={{ display: "none" }}
        />
        <Stack alignItems="center" spacing={1}>
          <CloudUploadIcon
            color={isDragging ? "primary" : "action"}
            fontSize="large"
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Drag and drop images here or click to select
          </Typography>
        </Stack>
      </Box>

      {isUploading && <LinearProgress />}

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Stack>
  );
};

export default Upload;
