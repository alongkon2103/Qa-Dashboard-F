import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Button,
  Chip,
  Box,
  Grid,
  IconButton,
  TextField
} from "@mui/material";
import { CloudUpload, CameraAlt, Close, Edit, Save, Cancel, Check } from "@mui/icons-material";
import TaskCamera from "./TaskCamera";
import TaskCameraBad from "./TaskCameraBad";

export default function TaskInfoCard({
  task,
  cameraOnGood,
  cameraOnBad,
  handleUploadGood,
  handleUploadBad,
  handleCameraToggleGood,
  handleCameraToggleBad,
  handleCameraCaptureGood,
  handleCameraCaptureBad,
  handleSaveGoal,
}) {
  const [cameraGoodOn, setCameraGoodOn] = React.useState(false);
  const [cameraBadOn, setCameraBadOn] = React.useState(false);

  const toggleGoodCamera = () => {
    setCameraGoodOn((prev) => !prev);
    if (cameraBadOn) setCameraBadOn(false);
  };

  const toggleBadCamera = () => {
    setCameraBadOn((prev) => !prev);
    if (cameraGoodOn) setCameraGoodOn(false);
  };

  // 🔹 state สำหรับแก้ไข goal
  const [isEditingGoal, setIsEditingGoal] = React.useState(false);
  const [goalValue, setGoalValue] = React.useState(task.goal);

  const handleSaveGoalClick = () => {
    if (handleSaveGoal) handleSaveGoal(goalValue);
    setIsEditingGoal(false);
  };

  const handleCancelGoal = () => {
    setGoalValue(task.goal);
    setIsEditingGoal(false);
  };

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        p: 2,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            Task Information
          </Typography>
          <Chip
            label={task.status}
            color={task.status === "Running" ? "success" : "error"}
            sx={{ fontWeight: 700, fontSize: "1rem", px: 1.5, py: 0.3 }}
          />
        </Stack>

        {/* Summary Boxes */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={4}>
            <InfoBox
              title="Total"
              value={`${task.count} / ${task.goal}`}
              percent={((task.count * 100) / task.goal).toFixed(1)}
              color="#0D47A1"
              bg="linear-gradient(145deg, #E3F2FD, #BBDEFB)"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoBox
              title="Good"
              value={task.good_count}
              percent={((task.good_count * 100) / task.goal).toFixed(1)}
              color="#1B5E20"
              bg="linear-gradient(145deg, #E8F5E9, #C8E6C9)"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InfoBox
              title="Bad"
              value={task.bad_count}
              percent={((task.bad_count * 100) / task.goal).toFixed(1)}
              color="#B71C1C"
              bg="linear-gradient(145deg, #FFEBEE, #FFCDD2)"
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* Details */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Typography variant="body1">
            <strong>Plan:</strong>
          </Typography>

          {isEditingGoal ? (
            <>
              <TextField
                size="small"
                type="number"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveGoalClick();
                  }
                }}
                sx={{ width: 100 }}
                autoFocus // ✅ โฟกัสทันทีเมื่อเปิดโหมดแก้ไข
              />
              <IconButton
                size="small"
                color="default"
                onClick={handleSaveGoalClick}
                sx={{
                  backgroundColor: "#f5f5f5",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <Check fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="body1">{task.goal}</Typography>
              <IconButton size="small" onClick={() => setIsEditingGoal(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>


        <Typography variant="body1" mt={1}>
          <strong>State:</strong> {task.state}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
        </Typography>

        {/* Upload Good Section */}
        <UploadSection
          title="อัปโหลดภาพสมบูรณ์ (Good Images)"
          subtitle="* สำหรับ Upload ภาพถ่ายที่สมบูรณ์"
          color="primary"
          iconColor="#2196F3"
          handleUpload={handleUploadGood}
          handleCameraToggle={handleCameraToggleGood}
          cameraOn={cameraOnGood}
        />

        {/* Upload Bad Section */}
        <UploadSection
          title="อัปโหลดภาพเสียหาย (Bad Images)"
          subtitle="* สำหรับ Upload ภาพถ่ายที่เสียหาย"
          color="error"
          iconColor="#E53935"
          handleUpload={handleUploadBad}
          handleCameraToggle={handleCameraToggleBad}
          cameraOn={cameraOnBad}
        />

        {/* Note */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          * ปุ่ม <strong>Upload</strong> และ <strong>Camera</strong> ใช้สำหรับอัปโหลด
          หรือถ่ายภาพเพื่อเก็บเป็นข้อมูลประกอบการตรวจสอบ (QA)
        </Typography>

        {cameraOnGood && (
          <Box mt={3}>
            <TaskCamera handleCameraCapture={handleCameraCaptureGood} />
          </Box>
        )}
        {cameraOnBad && (
          <Box mt={3}>
            <TaskCameraBad handleCameraCapture={handleCameraCaptureBad} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* 🔹 กล่องแสดงข้อมูลรวม */
function InfoBox({ title, value, percent, color, bg }) {
  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        background: bg,
        textAlign: "center",
        height: 120,
        width: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "transform 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <Typography variant="subtitle2" sx={{ color, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, color, mt: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color, fontWeight: 700 }}>
        {percent}%
      </Typography>
    </Card>
  );
}

/* 🔹 ส่วนของการอัปโหลดภาพ */
function UploadSection({
  title,
  subtitle,
  color,
  iconColor,
  handleUpload,
  handleCameraToggle,
  cameraOn,
}) {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        borderRadius: 3,
        backgroundColor: `${iconColor}10`,
        transition: "0.3s",
        "&:hover": {
          backgroundColor: `${iconColor}15`,
        },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: iconColor }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, mb: 1.5, fontStyle: "italic" }}
      >
        {subtitle}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          color={color}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Upload
          <input type="file" hidden multiple onChange={handleUpload} />
        </Button>

        <Button
          variant={cameraOn ? "contained" : "outlined"}
          color={cameraOn ? "error" : color}
          onClick={handleCameraToggle}
          startIcon={cameraOn ? <Close /> : <CameraAlt />}
          sx={{
            borderRadius: 3,
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          {cameraOn ? "Close Camera" : "Camera"}
        </Button>
      </Stack>
    </Box>
  );
}
