const express = require('express');
const router = express.Router();

const db = require('../db/queries');

router.get('/:userId', async (req, res, next) => {
  try {
    const results = await db.pods.getPodsForUser(req.params.userId);
    res.json(results);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const results = await db.pods.createPod(req.body);
    res.json(results);
  } catch (error) {
    res.send(error);
  }
});

router.get('/:podId/topics', async (req, res, next) => {
  try {
    const results = await db.pods.getAllTopicsInPod(req.params.podId);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post('/:podId/topics', async (req, res, next) => {
  const newTopic = {
    name: req.body.name,
    podId: req.params.podId,
    userId: req.body.userId
  };
  try {
    const results = await db.pods.createTopic(newTopic);
    res.json(results);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
