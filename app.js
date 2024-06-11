const express = require("express");
const cors = require("cors");
const app = express();
const Client = require('./modal/clientModel');
const Message = require('./modal/Message');
const bodyParser = require('body-parser');
require("dotenv").config();

app.use(
  cors({
    origin: "*",
  })
);
app.set("port", 5000);
app.use(express.json());

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const errorHandeler = require("./utilities/errorHendeler");
const userRouter = require("./router/user");
const reportRouter = require("./router/report");
app.use("/api/v1/user", userRouter);
app.use("/api/v1/report", reportRouter);

app.post('/api/add_client/:email', async (req, res) => {
  const clientData = req.body;
  console.log("Received client data:", clientData);

  try {
    const userEmail = req.params.email;
    const newClient = new Client({
      ...clientData,
      email: userEmail, 
    });

    await newClient.save();
    res.status(200).send('Client added successfully');
  } catch (error) {
    console.error("Error saving client data:", error);
    res.status(400).send('Error saving client data');
  }
});

// Get Clients all admin dashboard
app.get('/api/clients', async (req, res) => {
  try {
      const clients = await Client.find();
      res.status(200).json(clients);
  } catch (error) {
      res.status(400).json({ message: 'Failed to fetch clients' });
  }
});

// all message
app.get('/api/allmessage', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/user_clients', async (req, res) => {
  try {
    const userEmail = req.query.email; 

    if (!userEmail) {
      return res.status(400).json({ message: 'Email query parameter is required.' });
    }

    const clients = await Client.find({ email: userEmail });
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(400).json({ message: 'Failed to fetch clients' });
  }
});

// Delete client
app.delete('/api/delete_client/:id', async (req, res) => {
  try {
    const result = await Client.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).send({ message: 'Client not found' });
    }
    res.send({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting client', error });
  }
});


// Update client
app.put('/api/update_client/:id', async (req, res) => {
  try {
    const { name, phone, email, country, group } = req.body;
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, country, group },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).send({ message: 'Client not found' });
    }
    res.send(updatedClient);
  } catch (error) {
    res.status(500).send({ message: 'Error updating client', error });
  }
});




app.use("/", (req, res) => {
  res.send("hellw world");
});

app.use(errorHandeler);

module.exports = app;
