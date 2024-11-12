const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());

const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

// Endpoint to send a push notification
app.post('/send-notification', async (req, res) => {
  const { expoPushToken, title, message } = req.body;

  // Validate the required fields
  if (!expoPushToken || !title || !message) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  // Notification payload for Expo
  const payload = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: message,
    data: { withSome: 'data' },
  };

  try {
    // Send the notification request to Expo's push service
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('Error sending notification:', result.errors);
      return res.status(500).send({ error: 'Error sending notification' });
    }

    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Start the server on the specified port or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
