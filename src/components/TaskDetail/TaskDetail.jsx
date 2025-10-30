import React, { useEffect, useState } from "react";
import { Box, Grid, CircularProgress, AppBar, Toolbar, Typography, Container } from "@mui/material";
import { io } from "socket.io-client";
import { fetchTaskById, updateTaskName, uploadTaskImages, uploadTaskImage, uploadTaskImagesBad, uploadTaskImageBad, updateTaskPlan } from "../../api/taskApi";

import TaskHeader from "./TaskHeader";
import TaskInfoCard from "./TaskInfoCard";
import TaskImageGallery from "./TaskImageGallery";
import { AnchorSharp } from "@mui/icons-material";
import TaskLog from "./TaskLog";

export default function TaskDetail() {
  const fixedTaskId = "6903904725d93baa2219118b";

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraOnGood, setCameraOnGood] = useState(false);
  const [cameraOnBad, setCameraOnBad] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalValue, setGoalValue] = useState("");

  useEffect(() => {
    const socket = io("http://203.159.94.6:3000");
    socket.emit("joinTask", fixedTaskId);

    const loadTask = async () => {
      try {
        const data = await fetchTaskById(fixedTaskId);
        setTask(data);
        setTaskName(data.name || "Task");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    loadTask();

    socket.on("taskUpdated", (updatedTask) => {
      if (updatedTask.id === fixedTaskId) {
        setTask(updatedTask);
        setTaskName(updatedTask.name || "Task");
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleSaveName = async () => {
    try {
      setTask((prev) => ({ ...prev, name: taskName }));
      setIsEditingName(false);
      await updateTaskName(fixedTaskId, taskName);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveGoal = async (newGoal) => {
    try {
      setTask((prev) => ({ ...prev, goal: Number(newGoal) }));
      await updateTaskPlan(fixedTaskId, Number(newGoal));
    } catch (err) {
      console.error("Error updating goal:", err);
      alert("Failed to update plan");
    }
  };


  /** ✅ Upload Good Images */
  const handleUploadGood = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    try {
      await uploadTaskImages(fixedTaskId, files, "good");
      const data = await fetchTaskById(fixedTaskId);
      setTask(data);
    } catch (err) {
      console.error(err);
      alert("Upload Good Images failed");
    }
  };

  /** ✅ Upload Bad Images */
  const handleUploadBad = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;
    try {
      await uploadTaskImagesBad(fixedTaskId, files, "bad");
      const data = await fetchTaskById(fixedTaskId);
      setTask(data);
    } catch (err) {
      console.error(err);
      alert("Upload Bad Images failed");
    }
  };

  /** ✅ Camera Capture Good */
  const handleCameraCaptureGood = async (blob) => {
    if (!blob) return;
    try {
      await uploadTaskImage(fixedTaskId, blob, `good-${Date.now()}.png`, "good");
      const data = await fetchTaskById(fixedTaskId);
      setTask(data);
    } catch (err) {
      console.error(err);
      alert("Camera capture (Good) failed");
    }
  };

  /** ✅ Camera Capture Bad */
  const handleCameraCaptureBad = async (blob) => {
    if (!blob) return;
    try {
      await uploadTaskImageBad(fixedTaskId, blob, `bad-${Date.now()}.png`, "bad");
      const data = await fetchTaskById(fixedTaskId);
      setTask(data);
    } catch (err) {
      console.error(err);
      alert("Camera capture (Bad) failed");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  if (!task)
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">Task not found</Typography>
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ background: "#1976d2", boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Task Header */}
        <TaskHeader
          taskName={taskName}
          setTaskName={setTaskName}
          isEditingName={isEditingName}
          setIsEditingName={setIsEditingName}
          handleSaveName={handleSaveName}
        />

        {/* Task Info Card */}
        <Box my={3}>
          <TaskInfoCard
            task={task}
            cameraOnGood={cameraOnGood}
            cameraOnBad={cameraOnBad}
            handleUploadGood={handleUploadGood}
            handleUploadBad={handleUploadBad}
            handleCameraToggleGood={() => setCameraOnGood((prev) => !prev)}
            handleCameraToggleBad={() => setCameraOnBad((prev) => !prev)}
            handleCameraCaptureGood={handleCameraCaptureGood}
            handleCameraCaptureBad={handleCameraCaptureBad}
            handleSaveGoal={handleSaveGoal}
          />
        </Box>

        {/* Image Gallery */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TaskImageGallery images={task.images} taskId={task.id} setTask={setTask} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
