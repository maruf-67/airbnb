import mongoose, { InferSchemaType } from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    permissions: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export type RoleDocument = InferSchemaType<typeof roleSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export default mongoose.model('Role', roleSchema);
