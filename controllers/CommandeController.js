const Commande = require('../models/CommandeModel');
const LigneCmd = require('../models/LigneCmdModel');

// Get all commandes
exports.getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate('client')
      .populate({
        path: 'lignes',
        populate: { path: 'produit' }
      });
    res.status(200).json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single commande
exports.getCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('client')
      .populate({
        path: 'lignes',
        populate: { path: 'produit' }
      });
    if (!commande) return res.status(404).json({ message: 'Commande not found' });
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a commande with lignes
exports.createCommande = async (req, res) => {
  try {
    const { client, lignes } = req.body;
    
    // Create new commande
    const commande = new Commande({
      client,
      date: req.body.date || new Date()
    });
    
    // Save commande first to get an ID
    const savedCommande = await commande.save();
    
    // Create ligne commandes
    if (lignes && lignes.length > 0) {
      const lignePromises = lignes.map(async (ligne) => {
        const ligneCmd = new LigneCmd({
          commande: savedCommande._id,
          produit: ligne.produit,
          qte: ligne.qte
        });
        const savedLigne = await ligneCmd.save();
        return savedLigne._id;
      });
      
      const savedLigneIds = await Promise.all(lignePromises);
      
      // Update commande with lignes references
      savedCommande.lignes = savedLigneIds;
      await savedCommande.save();
    }
    
    // Return the complete commande
    const populatedCommande = await Commande.findById(savedCommande._id)
      .populate('client')
      .populate({
        path: 'lignes',
        populate: { path: 'produit' }
      });
      
    res.status(201).json(populatedCommande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a commande
exports.updateCommande = async (req, res) => {
  try {
    const { client, date } = req.body;
    
    const updateData = {};
    if (client) updateData.client = client;
    if (date) updateData.date = date;
    
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!commande) return res.status(404).json({ message: 'Commande not found' });
    
    // Return the updated commande
    const populatedCommande = await Commande.findById(commande._id)
      .populate('client')
      .populate({
        path: 'lignes',
        populate: { path: 'produit' }
      });
      
    res.status(200).json(populatedCommande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a commande and its lignes
exports.deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ message: 'Commande not found' });
    
    // Delete all associated lignes
    await LigneCmd.deleteMany({ commande: commande._id });
    
    // Delete the commande
    await Commande.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Commande and associated lines deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
