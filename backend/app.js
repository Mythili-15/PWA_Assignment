const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const connectionLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
});

const ConnectionLog = mongoose.model('ConnectionLog', connectionLogSchema);

const textDataSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const TextData = mongoose.model('TextData', textDataSchema);

app.get('/api/log-connection', (req, res) => {
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  const newConnectionLog = new ConnectionLog({
    ipAddress,
    userAgent,
  });

  newConnectionLog
    .save()
    .then(() => {
      console.log('Connection logged and data inserted.');
      res.status(200).send('Connection logged and data inserted.');
    })
    .catch((error) => {
      console.error('Error logging connection:', error);
      res.status(500).send('Error logging connection.');
    });
});
app.get('/api/connection-count', async (req, res) => {
  try {
    const connectionCount = await ConnectionLog.countDocuments();
    res.json({ connectionCount });
  } catch (error) {
    console.error('Error getting connection count:', error);
    res.status(500).send('Error getting connection count.');
  }
});
app.get('/api/get-recent-strings', async (req, res) => {
  try {
    const recentStrings = await TextData.find({}, 'text -_id')
      .sort({ timestamp: -1 })
      .limit(2)
      .exec();

    const recentStringArray = recentStrings.map((textData) => textData.text);
    res.status(200).json({ recentStrings: recentStringArray });
  } catch (error) {
    console.error('Error fetching recent strings:', error);
    res.status(500).send('Error fetching recent strings.');
  }
});

app.post('/api/submit-text-data', (req, res) => {
  const text = req.body.text;
  const newTextData = new TextData({
    text,
  });

  newTextData
    .save()
    .then(() => {
      console.log('Text data inserted into TextData model.');
      res.status(200).send('Text data inserted into TextData model.');
    })
    .catch((error) => {
      console.error('Error inserting text data:', error);
      res.status(500).send('Error inserting text data.');
    });
});

app.post('/api/submit-text', (req, res) => {
  const text = req.body.text;

  const result = `Received: ${text}`;
  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
