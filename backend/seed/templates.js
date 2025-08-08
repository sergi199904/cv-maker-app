const mongoose = require('mongoose');
const Template = require('../models/Template');
require('dotenv').config();

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional CV layout with clean typography',
    isPremium: false,
    preview: '/templates/classic-preview.png',
    category: 'professional'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with color accents',
    isPremium: true,
    preview: '/templates/modern-preview.png',
    category: 'modern'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for creative professionals',
    isPremium: true,
    preview: '/templates/creative-preview.png',
    category: 'creative'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimal design focused on content',
    isPremium: true,
    preview: '/templates/minimal-preview.png',
    category: 'minimal'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional template for senior positions',
    isPremium: true,
    preview: '/templates/executive-preview.png',
    category: 'professional'
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Visually striking template for design professionals',
    isPremium: true,
    preview: '/templates/designer-preview.png',
    category: 'creative'
  }
];

async function seedTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cv-maker-app');
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    await Template.insertMany(templates);
    console.log(`Successfully seeded ${templates.length} templates`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedTemplates();
}

module.exports = { seedTemplates, templates };