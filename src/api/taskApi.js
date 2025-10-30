import axios from "axios";

const BASE_URL = "http://203.159.94.6:3000";

export const fetchTaskById = async (taskId) => {
  try {
    // const response = await axios.get(`${BASE_URL}/task/${taskId}`);
    const response = await axios.get(`${BASE_URL}/task/6903904725d93baa2219118b`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

export const updateTaskName = async (taskId, name) => {
  try {
    const response = await axios.put(`${BASE_URL}/task/${taskId}`, { name });
    return response.data;
  } catch (error) {
    console.error("Error updating task name:", error);
    throw error;
  }
};

export const updateTaskPlan= async (taskId, plan) => {
  try {
    const response = await axios.put(`${BASE_URL}/task/${taskId}`, { goal:plan });
    return response.data;
  } catch (error) {
    console.error("Error updating task plan:", error);
    throw error;
  }
};


export const uploadTaskImages = async (taskId, files) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("taskId", taskId);
    formData.append("imgtype", "good")

    const response = await axios.post(`${BASE_URL}/images/multi`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

export const uploadTaskImagesBad = async (taskId, files) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    formData.append("taskId", taskId);
    formData.append("imgtype", "bad")


    const response = await axios.post(`${BASE_URL}/images/multi`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};


export const uploadTaskImage = async (taskId, blob, filename) => {
  try {
    const formData = new FormData();
    formData.append("image", blob, filename);
    formData.append("taskId", taskId);
    formData.append("imgtype", "good")

    const response = await axios.post(`${BASE_URL}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const uploadTaskImageBad = async (taskId, blob, filename) => {
  try {
    const formData = new FormData();
    formData.append("image", blob, filename);
    formData.append("taskId", taskId);
    formData.append("imgtype", "bad")


    const response = await axios.post(`${BASE_URL}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteTaskImages = async (taskId, imageIds) => {
  try {
    const response = await axios.post(`${BASE_URL}/images/delete`, { taskId, imageIds });
    return response.data;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

