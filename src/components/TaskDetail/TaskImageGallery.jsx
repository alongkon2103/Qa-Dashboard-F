import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Checkbox,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { deleteTaskImages } from "../../api/taskApi";

export default function TaskImageGallery({ images, taskId }) {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedGoodImages, setSelectedGoodImages] = useState([]);
  const [selectedBadImages, setSelectedBadImages] = useState([]);

  const [localImages, setLocalImages] = useState(images);

  const baseIp = "203.159.94.6";

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleOpenImage = (img) => {
    setSelectedImage(img);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage(null);
  };

  // 🔹 toggle เลือกรูป
  const toggleSelectGood = (id) => {
    setSelectedGoodImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectBad = (id) => {
    setSelectedBadImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 🔹 ลบรูปฝั่ง Good
  const handleDeleteGood = async () => {
    if (selectedGoodImages.length === 0) return;
    const confirmDelete = window.confirm(
      `Delete ${selectedGoodImages.length} good image(s)?`
    );
    if (!confirmDelete) return;

    try {
      await deleteTaskImages(taskId, selectedGoodImages);
      window.location.reload();
      setSelectedGoodImages([]);
    } catch (err) {
      console.error("Failed to delete images:", err);
      alert("Delete failed");
    }
  };

  // 🔹 ลบรูปฝั่ง Bad
  const handleDeleteBad = async () => {
    if (selectedBadImages.length === 0) return;
    const confirmDelete = window.confirm(
      `Delete ${selectedBadImages.length} bad image(s)?`
    );
    if (!confirmDelete) return;

    try {
      await deleteTaskImages(taskId, selectedBadImages);
      window.location.reload();
      setSelectedBadImages([]);
    } catch (err) {
      console.error("Failed to delete images:", err);
      alert("Delete failed");
    }
  };

  // 🔹 แยก good / bad
  const goodImages = localImages.filter((img) => img.imgtype === "good");
  const badImages = localImages.filter((img) => img.imgtype === "bad");

  return (
    <Grid container spacing={3}>
      {/* Good Images */}
      <Grid item xs={12} md={6}>
        <ImageCard
          title="Good Images"
          images={goodImages}
          selectedImages={selectedGoodImages}
          toggleSelectImage={toggleSelectGood}
          handleOpenImage={handleOpenImage}
          handleDeleteSelected={handleDeleteGood}
          baseIp={baseIp}
        />
      </Grid>

      {/* Bad Images */}
      <Grid item xs={12} md={6}>
        <ImageCard
          title="Bad Images"
          images={badImages}
          selectedImages={selectedBadImages}
          toggleSelectImage={toggleSelectBad}
          handleOpenImage={handleOpenImage}
          handleDeleteSelected={handleDeleteBad}
          baseIp={baseIp}
        />
      </Grid>

      {/* Dialog สำหรับ preview */}
      <Dialog open={openImage} onClose={handleCloseImage} maxWidth="lg">
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            bgcolor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={handleCloseImage}
            sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
          >
            <Close />
          </IconButton>
          {selectedImage && (
            <img
              src={`http://${baseIp}:3000/${selectedImage.path}`}
              alt={selectedImage.name}
              style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

/* 🔹 Card แสดงภาพ + checkbox + delete */
function ImageCard({
  title,
  images,
  selectedImages,
  toggleSelectImage,
  handleOpenImage,
  handleDeleteSelected,
  baseIp,
}) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {images.length > 0 ? (
          <>
            <Box display="grid" gridTemplateColumns="repeat(4, 120px)" gap={2}>
              {images.map((img) => (
                <Box
                  key={img.id}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    border: selectedImages.includes(img.id)
                      ? "2px solid red"
                      : "1px solid #ddd",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <Checkbox
                    checked={selectedImages.includes(img.id)}
                    onChange={() => toggleSelectImage(img.id)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                      color: "white",
                    }}
                  />
                  <img
                    src={`http://${baseIp}:3000/${img.path}`}
                    alt={img.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onClick={() => handleOpenImage(img)}
                  />
                </Box>
              ))}
            </Box>

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteSelected}
                disabled={selectedImages.length === 0}
              >
                Delete Selected ({selectedImages.length})
              </Button>
            </Stack>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No images uploaded yet.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
