import Joi from 'joi';

export const propertiesValidation = Joi.object({
  agent: Joi.string().allow(''),
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
    'string.empty': 'Title cannot be empty'
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.empty': 'Description cannot be empty'
  }),
  propertyType: Joi.string().valid('apartment','house','villa','room','studio','commercial','land').required().messages({
    'any.required': 'Property type is required',
    'any.only': 'Invalid property type'
  }),
  dealType: Joi.string().valid('rent','sell','gerawi').required().messages({
    'any.required': 'Transaction type is required',
    'any.only': 'Invalid transaction type'
  }),
  location: Joi.object({
    province: Joi.string().required().messages({ 'any.required': 'Province is required' }),
    city: Joi.string().required().messages({ 'any.required': 'City is required' }),
    district: Joi.string().required().messages({ 'any.required': 'District is required' }),
    streetAddress: Joi.string().required().messages({ 'any.required': 'Street address is required' }),
    // exactLocation: Joi.string().allow(''),
    landmark: Joi.string().required().messages({ 'any.required': 'Landmark is required' })
  }).required(),
  details: Joi.object({
    bedroom: Joi.string().required(),
    bathroom: Joi.string().required(),
    area: Joi.string().optional(),
    floor: Joi.string().optional(),
    totalFloor: Joi.string().optional(),
    yearBuild: Joi.string().optional(),
    furniture: Joi.boolean().optional(),
    parking: Joi.boolean().optional(),
    security: Joi.string().optional()
  }).required(),
  amenities: Joi.array().items(
    Joi.string().valid('parking', 'elevator','security','garden','pool','balcony','ac','heating','internet','calble_tv','pet_friendly','furniture')
  ),
  price: Joi.object({
    amount: Joi.string().required(),
    currency: Joi.string().valid('afghani','doller').default('afghani'),
    period: Joi.string().allow(''),
    negotiable: Joi.string().default('')
  }).required(),
  media: Joi.array().items(
    Joi.object({
      url: Joi.string().required(),
      public_id: Joi.number().optional(),
      caption: Joi.string().max(200).default('One of the beautiest house in the market'),
      isPrimary: Joi.boolean().default(false)
    })
  )
});
