const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

// Produit routes
router.get('/', produitController.getProduits);
router.get('/:id', produitController.getProduit);
router.post('/', produitController.createProduit);
router.put('/:id', produitController.updateProduit);
router.delete('/:id', produitController.deleteProduit);

module.exports = router;