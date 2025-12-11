import mongoose, { Schema } from 'mongoose';
import { requestContext } from '../../utils/requestContext.js';

export interface AuditFields {
    created_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_ip?: string;
    updated_ip?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const auditPlugin = (schema: Schema) => {
    schema.add({
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        created_ip: {
            type: String,
        },
        updated_ip: {
            type: String,
        },
    });

    schema.set('timestamps', {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    schema.pre('save', function (next) {
        const context = requestContext.get();

        if (context) {
            if (this.isNew) {
                if (context.user && context.user._id) {
                    this.created_by = context.user._id;
                }
                if (context.ip) {
                    this.created_ip = context.ip;
                }
            }

            if (context.user && context.user._id) {
                this.updated_by = context.user._id;
            }
            if (context.ip) {
                this.updated_ip = context.ip;
            }
        }

        next();
    });

    // Handle update queries (findOneAndUpdate, etc.)
    schema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
        const context = requestContext.get();

        if (context) {
            const update = this.getUpdate() as any;
            if (update) {
                if (context.user && context.user._id) {
                    // Use $set to ensure we don't overwrite the whole object if update is an object
                    this.set({ updated_by: context.user._id });
                }
                if (context.ip) {
                    this.set({ updated_ip: context.ip });
                }
            }
        }
        next();
    });
};
