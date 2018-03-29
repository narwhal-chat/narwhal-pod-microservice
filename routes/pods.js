const express = require('express');
const router = express.Router();

const db = require('../db/queries');

router.get('/:userId', async (req, res, next) => {
  try {
    const results = await db.pods.getPodsForUser(req.params.userId);
    res.json(results);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const results = await db.pods.createPod(req.body);
    res.json(results);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.get('/:podId/topics', async (req, res, next) => {
  try {
    const results = await db.pods.getAllTopicsInPod(req.params.podId);
    res.json(results);
  } catch (e) {
    res.sendStatus(400);
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
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
