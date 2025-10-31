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
  TextField,
} from "@mui/material";
import { CloudUpload, CameraAlt, Close, Edit, Check } from "@mui/icons-material";
import TaskCamera from "./TaskCamera";
import TaskCameraBad from "./TaskCameraBad";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";

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

  // 🔹 Prepare data for KPI Donut
  const pieData = [
    { name: "Good", value: task.good_count, color: "#1B5E20" },
    { name: "Bad", value: task.bad_count, color: "#B71C1C" },
  ];

  const totalPercent = ((task.count / task.goal) * 100).toFixed(1);
  const goodPercent = task.count > 0 ? ((task.good_count / task.count) * 100).toFixed(1) : 0;
  const badPercent = task.count > 0 ? ((task.bad_count / task.count) * 100).toFixed(1) : 0;


  return (
    <Card sx={{ height: "100%", borderRadius: 4, p: 2 }}>
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

        {/* KPI Donut Chart */}
        <Box sx={{ width: "100%", height: 200, mb: 3, position: "relative" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Total % */}
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: 700,
              color: "#000",
            }}
          >
            {totalPercent}%
          </Typography>

          {/* Labels รอบๆ chart */}
          <Box sx={{ position: "absolute", top: 10, left: 10 }}>
            <Typography variant="body2" color="#1B5E20">
              Good: {task.good_count} ({goodPercent}%)
            </Typography>
            <Typography variant="body2" color="#B71C1C">
              Bad: {task.bad_count} ({badPercent}%)
            </Typography>
            <Typography variant="body2" color="#555">
              Remaining: {Math.max(task.goal - task.good_count - task.bad_count, 0)}
            </Typography>
          </Box>
        </Box>


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
                  if (e.key === "Enter") handleSaveGoalClick();
                }}
                sx={{ width: 100 }}
                autoFocus
              />
              <IconButton size="small" color="default" onClick={handleSaveGoalClick}>
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

/* 🔹 ส่วนของการอัปโหลดภาพ */
function UploadSection({ title, subtitle, color, iconColor, handleUpload, handleCameraToggle, cameraOn }) {
  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        borderRadius: 3,
        backgroundColor: `${iconColor}10`,
        transition: "0.3s",
        "&:hover": { backgroundColor: `${iconColor}15` },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: iconColor }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5, fontStyle: "italic" }}>
        {subtitle}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          color={color}
          sx={{ borderRadius: 3, fontWeight: 600, textTransform: "none", px: 3, py: 1 }}
        >
          Upload
          <input type="file" hidden multiple onChange={handleUpload} />
        </Button>

        <Button
          variant={cameraOn ? "contained" : "outlined"}
          color={cameraOn ? "error" : color}
          onClick={handleCameraToggle}
          startIcon={cameraOn ? <Close /> : <CameraAlt />}
          sx={{ borderRadius: 3, fontWeight: 600, textTransform: "none", px: 3, py: 1 }}
        >
          {cameraOn ? "Close Camera" : "Camera"}
        </Button>
      </Stack>
    </Box>
  );
}
