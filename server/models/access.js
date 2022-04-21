const { model, Schema } = require("mongoose");

const accessSchema = new Schema({
  requester: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  notificationId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isRequesting: { type: Boolean, default: false },
  grantedAccess: { type: Boolean, default: false },
});

module.exports = model("Access", accessSchema);
