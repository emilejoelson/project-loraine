// routes/commandeRoutes.js
const express = require('express');
const router = express.Router();
const ligneCmdController = require('../controllers/ligneCmdController');

// Commande routes
router.get('/', commandeController.getCommandes);
router.get('/:id', commandeController.getCommande);
router.post('/', commandeController.createCommande);
router.put('/:id', commandeController.updateCommande);
router.delete('/:id', commandeController.deleteCommande);

// Ligne_cmd routes linked to commandes
router.get('/:commandeId/lignes', ligneCmdController.getLignesForCommande);
router.post('/:commandeId/lignes', ligneCmdController.addLigne);

module.exports = router;