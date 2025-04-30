const express = require('express');
const router = express.Router();
const ligneCmdController = require('../controllers/ligneCmdController');

router.put('/:id', ligneCmdController.updateLigne);
router.delete('/:id', ligneCmdController.deleteLigne);

module.exports = router;