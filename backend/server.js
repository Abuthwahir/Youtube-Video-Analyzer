require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

// Create a custom HTTPS agent to bypass certificate validation
const agent = new https.Agent({
  rejectUnauthorized: false
});

const app = express();
const port = 3002;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  console.log("Received URL to analyze:", url);

  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "YOUR_YOUTUBE_API_KEY_HERE") {
    return res.status(500).json({ error: "YouTube API key not set on the backend server." });
  }

  let videoId;
  try {
    const videoUrl = new URL(url);
    videoId = videoUrl.searchParams.get('v');
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid or missing YouTube URL." });
  }

  const API_URL = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`;

  try {
    const response = await axios.get(API_URL);
    const video = response.data.items[0];

    if (!video) {
      return res.status(404).json({ error: "Video not found on YouTube." });
    }

    const snippet = video.snippet;
    const statistics = video.statistics;

    // Create the data structure that our frontend expects
    const videoData = {
      title: snippet.title,
      channel: snippet.channelTitle,
      views: statistics.viewCount,
      likes: statistics.likeCount,
      duration: "N/A", // Note: Duration requires a different API call (contentDetails part)
      uploadDate: new Date(snippet.publishedAt).toLocaleDateString(),
      tags: snippet.tags || [],
      description: snippet.description,
      thumbnail: snippet.thumbnails.high.url,
      // These are no longer available from the new API structure, so we create placeholders
      engagement: {
        likeRatio: Math.round((statistics.likeCount / statistics.viewCount) * 100) || 0,
        commentCount: statistics.commentCount || "N/A",
        subscriberGrowth: "N/A"
      },
      insights: [
        "🚀 Real data fetched from YouTube API!"
      ]
    };

    res.json(videoData);

  } catch (error) {
    console.error("Error fetching from YouTube API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch data from YouTube API." });
  }
});

app.post('/generate-insights', async (req, res) => {
  const { title, description, statistics } = req.body;
  console.log("Received data for insights generation:");

  try {
    const prompt = `
      Analyze the following YouTube video data and provide a summary and a list of actionable insights.
      Format the output as a JSON object with two keys: "summary" and "insights".
      The "summary" should be a concise summary of the video.
      The "insights" should be an array of strings, where each string is a specific, actionable insight for the video creator.

      Video Title: ${title}
      Video Description: ${description}
      Video Statistics: ${JSON.stringify(statistics)}
    `;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        httpsAgent: agent
      }
    );

    let text = geminiResponse.data.candidates[0].content.parts[0].text;
    
    // Clean the response to remove Markdown backticks
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3);
    } else if (text.startsWith("```")) {
      text = text.substring(3, text.length - 3);
    }

    // The model should return a JSON string. We need to parse it.
    const aiResponse = JSON.parse(text);

    res.json(aiResponse);

  } catch (error) {
    console.error("Error generating AI insights:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate AI insights." });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});