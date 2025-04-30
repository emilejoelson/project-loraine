const Commande = require('../models/CommandeModel');
const LigneCmd = require('../models/LigneCmdModel');
// Get all lignes for a commande
exports.getLignesForCommande = async (req, res) => {
  try {
    const lignes = await LigneCmd.find({ commande: req.params.commandeId })
      .populate('produit');
    res.status(200).json(lignes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addLigne = async (req, res) => {
  try {
    const { produit, qte } = req.body;
    const commandeId = req.params.commandeId;
    
    // Check if commande exists
    const commande = await Commande.findById(commandeId);
    if (!commande) return res.status(404).json({ message: 'Commande not found' });
    
    // Create new ligne
    const ligneCmd = new LigneCmd({
      commande: commandeId,
      produit,
      qte
    });
    
    const savedLigne = await ligneCmd.save();
    
    // Add reference to commande
    commande.lignes.push(savedLigne._id);
    await commande.save();
    
    // Return populated ligne
    const populatedLigne = await LigneCmd.findById(savedLigne._id)
      .populate('produit');
      
    res.status(201).json(populatedLigne);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ligne
exports.updateLigne = async (req, res) => {
  try {
    const { qte } = req.body;
    
    const ligne = await LigneCmd.findByIdAndUpdate(
      req.params.id,
      { qte },
      { new: true, runValidators: true }
    ).populate('produit');
    
    if (!ligne) return res.status(404).json({ message: 'Ligne not found' });
    
    res.status(200).json(ligne);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ligne
exports.deleteLigne = async (req, res) => {
  try {
    const ligne = await LigneCmd.findById(req.params.id);
    if (!ligne) return res.status(404).json({ message: 'Ligne not found' });
    
    // Remove reference from commande
    await Commande.findByIdAndUpdate(
      ligne.commande,
      { $pull: { lignes: ligne._id } }
    );
    
    // Delete the ligne
    await LigneCmd.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Ligne deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};