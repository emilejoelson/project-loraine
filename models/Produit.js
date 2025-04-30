const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  libelle: {
    type: String,
    required: true,
    trim: true
  },
  pu: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Produit', ProduitSchema);