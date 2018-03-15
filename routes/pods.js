const express = require('express');
const router = express.Router();

const db = require('../db/queries');

// create
// join
// edit
// get pods for user

router.get('/:userid', async (req, res, next) => {
  console.log(req.params.userid);
  try {
    const response = await db.pods.getPodsForUser(req.params.userid);
    console.log(response);
    res.json(response);
  } catch (error) {
    res.send(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const response = await db.pods.createPod(req.body);
    res.json(response);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;