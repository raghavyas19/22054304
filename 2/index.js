const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;

// Configuration
const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500; // 500ms timeout
const BASE_URL = 'http://20.244.56.144/evaluation-service/';
const VALID_IDS = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand',
};

// Access token
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA3ODU0LCJpYXQiOjE3NDM2MDc1NTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJhZTgwNTAxLWVlNTEtNDg3ZS05ZTNhLTYzYjRjMDc5ZGIxNiIsInN1YiI6IjIyMDU0MzA0QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1NDMwNEBraWl0LmFjLmluIiwibmFtZSI6InJhZ2hhdiB2eWFzIiwicm9sbE5vIjoiMjIwNTQzMDQiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJiYWU4MDUwMS1lZTUxLTQ4N2UtOWUzYS02M2I0YzA3OWRiMTYiLCJjbGllbnRTZWNyZXQiOiJ6cVlueXZnRFZuUGNuUW1OIn0.dOu_GBvxfZsM3RZ-OzRafiKoVbQ99if4mn1zQg_k6vE';
const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };

let numberWindow = [];

async function fetchNumbers(numberType) {
  try {
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}${numberType}`, {
      headers,
      timeout: TIMEOUT_MS,
    });
    const elapsedTime = Date.now() - startTime;

    if (elapsedTime > 500) return [];
    return response.data.numbers || [];
  } catch (error) {
    return [];
  }
}

function calculateAverage(numbers) {
  if (!numbers.length) return 0.00;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return Number((sum / numbers.length).toFixed(2));
}

app.get('/numbers/:numberid', async (req, res) => {
  const startTime = Date.now();
  const { numberid } = req.params;

  // Validate numberid
  if (!VALID_IDS[numberid]) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const numberType = VALID_IDS[numberid];
  const windowPrevState = [...numberWindow];

  // Fetch new numbers
  const newNumbers = await fetchNumbers(numberType);
  if (!newNumbers.length) {
    return res.json({
      windowPrevState,
      windowCurrState: windowPrevState,
      numbers: [],
      avg: calculateAverage(windowPrevState),
    });
  }

  const currentNumbers = new Set(numberWindow);
  for (const num of newNumbers) {
    if (!currentNumbers.has(num)) {
      numberWindow.push(num);
      currentNumbers.add(num);
    }
  }

  if (numberWindow.length > WINDOW_SIZE) {
    numberWindow = numberWindow.slice(-WINDOW_SIZE);
  }

  const windowCurrState = [...numberWindow];
  const avg = calculateAverage(windowCurrState);

  const elapsedTime = Date.now() - startTime;
  if (elapsedTime > 500) {
    return res.status(500).json({ error: 'Response time exceeded 500ms' });
  }

  res.json({
    windowPrevState,
    windowCurrState,
    numbers: newNumbers,
    avg,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});