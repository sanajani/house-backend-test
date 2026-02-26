import {Schema, model} from 'mongoose';

const PropertySchema = new Schema({
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User Id is required"]
    },
    status:{
        type: String,
        enum: ['pending','rented','sold','gerawed'],
        default: 'pending'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType:{
        type: String,
        enum: ['apartment', 'house','villa','room','studio','commercial','land'],
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    dealType: {
        type: String,
        enum: ['rent','sell','gerawi'],
        required: true
    },
    location: {
        province: {type: String, required: true},
        city: {type: String, required: true},
        district: {type: String, required: true},
        streetAddress: {type: String, required: true},
        exactLocation: {type: String},
        landmark: {type: String, required: true}
    },
    details: {
        bedroom: {type: String, required: true},
        bathroom: {type: String, required: true},
        area: {type: String},
        floor: {type: String},
        totalFloor: {type: String},
        yearBuild: {type: String},
        furniture: {type: Boolean},
        parking: {type: Boolean},
        security: {type: String},
    },
    amenities: [
        {
            type: String,
            enum: ['parking', 'elevator','security','garden','pool','balcony','ac','heating','internet','calble_tv','pet_friendly','furniture']
        }
    ],
    price:{
        amount:{type: String, required: [true, "Amount is required"]},
        currency: {type: String, enum: ['afghani','doller'], default: 'afghani'},
        period: {type: String},
        negotiable: {type: Boolean, default: false},
    },
    media: [{
        url: {
            type: String,
            required: [true, 'Image URL is required']
        },
        public_id: {
            type: String,
        },
        caption: {
            type: String,
            maxlength: 200,
            default: "One of the beautiest house in the market"
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }]
},{timestamps: true});


// Indexes
PropertySchema.index({ "location.province": 1, dealType: 1 }); // for search
PropertySchema.index({ "price.amount": 1 }); // price sorting
PropertySchema.index({ createdAt: -1 }); // newest first


export const PropertiesModel = model("properties", PropertySchema)
