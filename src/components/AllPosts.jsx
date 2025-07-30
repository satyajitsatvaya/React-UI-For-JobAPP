import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [post, setPost] = useState([]);
  const navigate = useNavigate();

  const fetchInitialPosts = async () => {
    const response = await axios.get("http://localhost:8080/jobPosts");
    setPost(response.data);
  };

  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (trimmed === "") {
      fetchInitialPosts();
    } else {
      const response = await axios.get(
        `http://localhost:8080/jobPosts/keyword/${trimmed}`
      );
      setPost(response.data);
    }
  };

  const handleEdit = (id) => {
    navigate("/edit", { state: { id } });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/jobPost/${id}`);
    fetchInitialPosts();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search for jobs..."
          fullWidth
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ textTransform: "none", px: 3 }}
        >
          Search
        </Button>
      </Box>

      {/* Job Cards */}
      <Grid container spacing={3}>
        {post &&
          post.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.postId}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  boxShadow: 3,
                  borderRadius: 3,
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ color: "#1976d2", mb: 1 }}
                  >
                    {p.postProfile}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={1.5}>
                    {p.postDesc.length > 100
                      ? p.postDesc.slice(0, 100) + "..."
                      : p.postDesc}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    Experience: {p.reqExperience} years
                  </Typography>

                  <Typography variant="body2" mt={2} mb={1} fontWeight={600}>
                    Tech Stack:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {p.postTechStack.map((tech, i) => (
                      <Chip key={i} label={tech} size="small" />
                    ))}
                  </Box>
                </Box>

                <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(p.postId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(p.postId)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Search;
