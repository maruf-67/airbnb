import mongoose, { InferSchemaType } from 'mongoose';
import { auditPlugin } from '../../common/models/plugins/auditPlugin.js';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        index: true
    },
    images: {
        type: [String],
        default: []
    },
    maxGuests: {
        type: Number,
        default: 1
    },
    amenities: {
        type: [String],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: { // Explicit owner field distinct from created_by (though usually same)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

postSchema.plugin(auditPlugin);

postSchema.index({ price: 1 });
postSchema.index({ location: 'text', title: 'text', description: 'text' });
postSchema.index({ owner: 1 });

export type PostDocument = InferSchemaType<typeof postSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export default mongoose.model('Post', postSchema);
