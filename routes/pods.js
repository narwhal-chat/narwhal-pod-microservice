const express = require('express');
const router = express.Router();

const db = require('../db/queries');


// Add route to edit pod

router.get('/:userid', async (req, res, next) => {
  console.log(req.params.userid);
  try {
    const results = await db.pods.getPodsForUser(req.params.userid);
    console.log('getting pods', results);
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

router.get('/:podid/topics', async (req, res, next) => {
  console.log(req.params.podid);
  try {
    const results = await db.pods.getAllTopicsInPod(req.params.podid);
    console.log('topic response', results);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

router.post('/:podid/topics', async (req, res, next) => {
  const newTopic = {
    name: req.body.name,
    podId: req.params.podid,
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