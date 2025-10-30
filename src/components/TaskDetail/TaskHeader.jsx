import React from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import { Edit, Check } from "@mui/icons-material";

export default function TaskHeader({ taskName, setTaskName, isEditingName, setIsEditingName, handleSaveName }) {
  return (
    <Box display="flex" alignItems="center" mb={3}>
      {isEditingName ? (
        <TextField
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          size="small"
          variant="outlined"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
          sx={{ mr: 1 }}
        />
      ) : (
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          sx={{ mr: 1, lineHeight: "1.2", display: "flex", alignItems: "center" }}
        >
          {taskName}
        </Typography>
      )}
      <IconButton onClick={isEditingName ? handleSaveName : () => setIsEditingName(true)} sx={{ p: 1 }}>
        {isEditingName ? <Check /> : <Edit />}
      </IconButton>
    </Box>
  );
}
