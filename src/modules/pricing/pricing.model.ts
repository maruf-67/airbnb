import mongoose, { InferSchemaType } from 'mongoose';
import { auditPlugin } from '../../common/models/plugins/auditPlugin.js';

const pricingSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['base', 'cleaning_fee', 'weekend_adjustment', 'seasonal', 'service_fee'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

pricingSchema.plugin(auditPlugin);

export type PricingDocument = InferSchemaType<typeof pricingSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export default mongoose.model('Pricing', pricingSchema);
