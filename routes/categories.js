const express = require('express');
const router = express.Router();

const db = require('../db/queries');

router.get('/', async (req, res, next) => {
  try {
    const results = await db.pods.getAllPodCategories();
    res.json(results);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
