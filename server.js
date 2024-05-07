const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Listen for new alerts
  const nwsAPI = 'https://api.weather.gov/alerts/active?status=actual&event=Severe%20Thunderstorm%20Warning,Tornado%20Warning'; // Replace this with the actual NWS API endpoint
  setInterval(async () => {
    try {
      const response = await axios.get(nwsAPI);
      const alerts = response.data.alerts;
      if (alerts.length > 0) {
        // Send alert to connected clients
        ws.send(JSON.stringify(alerts));
    }
  } catch (error) {
      console.error('Error fetching NWS alerts:', error);
    }
  }, 60000); // Check for new alerts every minute
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});what is the 