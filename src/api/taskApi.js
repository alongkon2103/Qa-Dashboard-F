import axios from "axios";

const BASE_URL = "http://203.159.94.6:3000";

// Basic Auth
const AUTH_USER = "WebApp";
const AUTH_PASS = "WebApp310";
const authHeader = "Basic " + btoa(`${AUTH_USER}:${AUTH_PASS}`);

const axiosConfig = {
  headers: { "Authorization": authHeader },
};

// ---------------- Task CRUD ----------------
export const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${BASE_URL}/task/${taskId}`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export const updateTaskName = async (taskId, name) => {
  try {
    const response = await axios.put(`${BASE_URL}/task/${taskId}`, { name }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error updating task name:", error);
    throw error;
  }
};

export const updateTaskPlan = async (taskId, plan) => {
  try {
    const response = await axios.put(`${BASE_URL}/task/${taskId}`, { goal: plan }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error updating task plan:", error);
    throw error;
  }
};

// ---------------- Upload Images ----------------
export const uploadTaskImages = async (taskId, files, type = "good") => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("taskId", taskId);
    formData.append("imgtype", type);

    const response = await axios.post(`${BASE_URL}/images/multi`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": authHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export const uploadTaskImagesBad = (taskId, files) => uploadTaskImages(taskId, files, "bad");

// Upload single image
export const uploadTaskImage = async (taskId, blob, filename, type = "good") => {
  try {
    const formData = new FormData();
    formData.append("image", blob, filename);
    formData.append("taskId", taskId);
    formData.append("imgtype", type);

    const response = await axios.post(`${BASE_URL}/images`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": authHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadTaskImageBad = (taskId, blob, filename) => uploadTaskImage(taskId, blob, filename, "bad");

// ---------------- Delete Images ----------------
export const deleteTaskImages = async (taskId, imageIds) => {
  try {
    const response = await axios.post(`${BASE_URL}/images/delete`, { taskId, imageIds }, axiosConfig);
    return response.data;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};
