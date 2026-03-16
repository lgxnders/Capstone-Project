import { DataTypes } from 'sequelize';
// import { sequelize } from '../config/database.js';

const Resource = sequelize.define('Resource', {
  title:        { type: DataTypes.STRING(200), allowNull: false },
  description:  { type: DataTypes.TEXT, allowNull: false },
  url:          { type: DataTypes.STRING(500) },
  resourceType: {
        type: DataTypes.ENUM(
            'crisis_hotline','counseling_service','support_group',
            'self_help_material','hospital','online_resource'
        ),
            defaultValue: 'online_resource',
            field: 'resource_type'
  },
  urgencyLevel: {
        type: DataTypes.ENUM('low','medium','high','crisis'),
        defaultValue: 'medium',
        field: 'urgency_level'
  },
  verificationStatus: {
        type: DataTypes.ENUM('unverified','verified','flagged'),
        defaultValue: 'unverified',
        field: 'verification_status'
  },
  country:       { type: DataTypes.STRING(100) },
  city:          { type: DataTypes.STRING(100) },
  provinceState: { type: DataTypes.STRING(100), field: 'province_state' },
  phoneNumber:   { type: DataTypes.STRING(20),  field: 'phone_number' },
  email:         { type: DataTypes.STRING },
  address:       { type: DataTypes.TEXT },
  lastVerified:  { type: DataTypes.DATE, field: 'last_verified' },
}, { underscored: true });

export default Resource;