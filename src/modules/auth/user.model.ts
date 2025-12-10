import mongoose, { InferSchemaType, Model, Document } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [128, 'Password must not exceed 128 characters'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    avatar: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshTokens: [{
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    }]
}, {
    timestamps: true
});

userSchema.index({
    createdAt: -1
});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.refreshTokens; // Also hide refreshTokens from public output
    return userObject;
};

export type UserDocument = InferSchemaType<typeof userSchema> & Document & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };
export default mongoose.model<UserDocument>('User', userSchema);
