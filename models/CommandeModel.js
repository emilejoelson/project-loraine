const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lignes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LigneCmd'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Commande', CommandeSchema);