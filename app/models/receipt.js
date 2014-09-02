var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    

var ReceiptSchema = new Schema({
    owner : String,
    title : String,
    receipts: [Schema.ObjectId],
    transactions : [{
        from : String,
        to : String,
        amount : Number
    }],
    createdTimestamp : Number,
    modifiedTimestamp : Number,
    removedTimestamp : Number,
    digestId : Schema.ObjectId
});


mongoose.model('Receipt', ReceiptSchema);