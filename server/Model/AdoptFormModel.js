const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adoptFormSchema = new Schema(
{
    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }, // Pet being adopted
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Pet's owner (User B)
    adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User requesting adoption (User A)

    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    livingSituation: { type: String, required: true },
    previousExperience: { type: String, required: true },
    familyComposition: { type: String, required: true },

    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }, // Request status

    
},
{ timestamps: true }
);

module.exports = mongoose.model('AdoptForm', adoptFormSchema);
