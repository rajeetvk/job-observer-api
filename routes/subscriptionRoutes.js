const express = require('express');
const router = express.Router();
const { subscribe, getSubscriptions, unsubscribe } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/subscribe', protect, subscribe);
router.get('/subscriptions', protect, getSubscriptions);
router.delete('/unsubscribe', protect, unsubscribe);

module.exports = router;
