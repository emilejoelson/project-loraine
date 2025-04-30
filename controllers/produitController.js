const Produit = require("../models/ProduitModel");

exports.getProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single produit
exports.getProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit not found" });
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a produit
exports.createProduit = async (req, res) => {
  try {
    const produit = new Produit(req.body);
    const newProduit = await produit.save();
    res.status(201).json(newProduit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a produit
exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!produit) return res.status(404).json({ message: "Produit not found" });
    res.status(200).json(produit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit not found" });
    res.status(200).json({ message: "Produit deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
