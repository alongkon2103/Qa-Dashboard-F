import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Stack,
    Chip,
    Divider
} from "@mui/material";
import { CheckCircle, Cancel, Image as ImageIcon } from "@mui/icons-material";

export default function TaskLog() {
    // Dummy log data
    const logs = [
        {
            id: 1,
            time: "10:30 AM",
            user: "John Doe",
            action: "good",
            message: "Uploaded 3 good quality images",
            count: 3,
            timestamp: "2 minutes ago"
        },
        {
            id: 2,
            time: "10:15 AM",
            user: "Jane Smith",
            action: "bad",
            message: "Reported 2 defective items",
            count: 2,
            timestamp: "17 minutes ago"
        },
        {
            id: 3,
            time: "09:45 AM",
            user: "Mike Johnson",
            action: "good",
            message: "Uploaded 5 good quality images",
            count: 5,
            timestamp: "45 minutes ago"
        },
        {
            id: 4,
            time: "09:20 AM",
            user: "Sarah Williams",
            action: "bad",
            message: "Reported 1 defective item",
            count: 1,
            timestamp: "1 hour ago"
        },
        {
            id: 5,
            time: "09:00 AM",
            user: "Tom Brown",
            action: "good",
            message: "Uploaded 4 good quality images",
            count: 4,
            timestamp: "1 hour ago"
        },
        {
            id: 6,
            time: "08:45 AM",
            user: "Alice Cooper",
            action: "good",
            message: "Uploaded 2 good quality images",
            count: 2,
            timestamp: "2 hours ago"
        },
        {
            id: 7,
            time: "08:30 AM",
            user: "Bob Martin",
            action: "bad",
            message: "Reported 3 defective items",
            count: 3,
            timestamp: "2 hours ago"
        },
        {
            id: 8,
            time: "08:15 AM",
            user: "Carol White",
            action: "good",
            message: "Uploaded 6 good quality images",
            count: 6,
            timestamp: "2 hours ago"
        }
    ];

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 4,
                boxShadow: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                {/* Header - Fixed */}
                <Box sx={{ p: 2.5, borderBottom: "1px solid #e0e0e0" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        Task Log
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Recent QC Activities
                    </Typography>
                </Box>

                {/* Log Items - Scrollable */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        "&::-webkit-scrollbar": {
                            width: "8px"
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f1f1f1",
                            borderRadius: "10px"
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#888",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "#555"
                            }
                        }
                    }}
                >
                    {logs.map((log, index) => (
                        <React.Fragment key={log.id}>
                            <LogItem log={log} />
                            {index < logs.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}

function LogItem({ log }) {
    const isGood = log.action === "good";
    const actionColor = isGood ? "#1B5E20" : "#B71C1C";
    const bgColor = isGood ? "#E8F5E9" : "#FFEBEE";

    return (
        <Stack direction="row" spacing={2} alignItems="flex-start">
            {/* Avatar */}
            <Avatar
                sx={{
                    width: 40,
                    height: 40,
                    bgcolor: isGood ? "#4CAF50" : "#F44336",
                    fontWeight: 600,
                    flexShrink: 0
                }}
            >
                {log.user.split(" ").map(n => n[0]).join("")}
            </Avatar>

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5} flexWrap="wrap">
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                        {log.user}
                    </Typography>
                    <Chip
                        icon={isGood ? <CheckCircle sx={{ fontSize: 16 }} /> : <Cancel sx={{ fontSize: 16 }} />}
                        label={isGood ? "Good" : "Bad"}
                        size="small"
                        sx={{
                            height: 20,
                            backgroundColor: bgColor,
                            color: actionColor,
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            "& .MuiChip-icon": {
                                color: actionColor
                            }
                        }}
                    />
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {log.message}
                </Typography>

                {/* Image Count & Time */}
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <ImageIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                            {log.count} {log.count === 1 ? "image" : "images"}
                        </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        {log.timestamp}
                    </Typography>
                </Stack>
            </Box>
        </Stack>
    );
}