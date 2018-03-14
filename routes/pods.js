const express = require('express');
const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    console.log(req.body);
    res.send('hi this is from the pod microservice');
  } catch (error) {
    
  }
});

module.exports = router;