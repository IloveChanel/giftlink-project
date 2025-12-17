/*jshint esversion: 8 */

// MongoDB Data Seeder - Run this to populate the database with 16 gift documents

const mongoose = require('mongoose');
require('dotenv').config();

const Gift = require('./models/Gift');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const sampleGifts = [
  {
    name: 'Vintage Leather Sofa',
    description: 'Beautiful brown leather sofa in excellent condition. Very comfortable and stylish.',
    category: 'Living Room',
    condition: 'Good',
    age: '5 years',
    imageUrl: 'https://example.com/sofa.jpg',
    userName: 'John Doe'
  },
  {
    name: 'Wooden Coffee Table',
    description: 'Solid oak coffee table with storage drawers. Great for living room.',
    category: 'Living Room',
    condition: 'Like New',
    age: '2 years',
    imageUrl: 'https://example.com/table.jpg',
    userName: 'Jane Smith'
  },
  {
    name: 'Queen Size Bed Frame',
    description: 'Sturdy wooden bed frame with headboard. Perfect condition.',
    category: 'Bedroom',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://example.com/bed.jpg',
    userName: 'Mike Johnson'
  },
  {
    name: 'Dining Table Set',
    description: 'Table with 6 chairs. Ideal for family dinners. Minor scratches.',
    category: 'Kitchen',
    condition: 'Fair',
    age: '7 years',
    imageUrl: 'https://example.com/dining.jpg',
    userName: 'Sarah Williams'
  },
  {
    name: 'Office Desk',
    description: 'Large office desk with multiple drawers. Great for home office.',
    category: 'Office',
    condition: 'Good',
    age: '4 years',
    imageUrl: 'https://example.com/desk.jpg',
    userName: 'John Doe'
  },
  {
    name: 'Bookshelf',
    description: 'Tall wooden bookshelf with 5 shelves. Holds many books.',
    category: 'Living Room',
    condition: 'Good',
    age: '6 years',
    imageUrl: 'https://example.com/bookshelf.jpg',
    userName: 'Jane Smith'
  },
  {
    name: 'Garden Chairs',
    description: 'Set of 4 outdoor chairs. Weather resistant and comfortable.',
    category: 'Outdoor',
    condition: 'Like New',
    age: '1 year',
    imageUrl: 'https://example.com/chairs.jpg',
    userName: 'Mike Johnson'
  },
  {
    name: 'Bathroom Cabinet',
    description: 'White bathroom storage cabinet. Good condition with minor wear.',
    category: 'Bathroom',
    condition: 'Good',
    age: '5 years',
    imageUrl: 'https://example.com/cabinet.jpg',
    userName: 'Sarah Williams'
  },
  {
    name: 'Bedside Tables',
    description: 'Pair of matching bedside tables with drawers.',
    category: 'Bedroom',
    condition: 'Good',
    age: '4 years',
    imageUrl: 'https://example.com/nightstand.jpg',
    userName: 'John Doe'
  },
  {
    name: 'Kitchen Island',
    description: 'Mobile kitchen island with storage and wheels. Very useful.',
    category: 'Kitchen',
    condition: 'Like New',
    age: '2 years',
    imageUrl: 'https://example.com/island.jpg',
    userName: 'Jane Smith'
  },
  {
    name: 'Patio Table',
    description: 'Large outdoor patio table. Perfect for summer gatherings.',
    category: 'Outdoor',
    condition: 'Fair',
    age: '8 years',
    imageUrl: 'https://example.com/patio.jpg',
    userName: 'Mike Johnson'
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with adjustable height. Very comfortable.',
    category: 'Office',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://example.com/chair.jpg',
    userName: 'Sarah Williams'
  },
  {
    name: 'Wardrobe',
    description: 'Large wardrobe with hanging space and shelves. Older but functional.',
    category: 'Bedroom',
    condition: 'Fair',
    age: '10 years',
    imageUrl: 'https://example.com/wardrobe.jpg',
    userName: 'John Doe'
  },
  {
    name: 'TV Stand',
    description: 'Modern TV stand with cable management. Holds up to 55 inch TV.',
    category: 'Living Room',
    condition: 'Like New',
    age: '1 year',
    imageUrl: 'https://example.com/tvstand.jpg',
    userName: 'Jane Smith'
  },
  {
    name: 'Kitchen Cart',
    description: 'Rolling kitchen cart with butcher block top. Great condition.',
    category: 'Kitchen',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://example.com/cart.jpg',
    userName: 'Mike Johnson'
  },
  {
    name: 'Dresser',
    description: 'Six drawer dresser in white. Some scratches but sturdy.',
    category: 'Bedroom',
    condition: 'Fair',
    age: '9 years',
    imageUrl: 'https://example.com/dresser.jpg',
    userName: 'Sarah Williams'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create a default user for the gifts
    let user = await User.findOne({ email: 'demo@giftlink.com' });
    
    if (!user) {
      user = await User.create({
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@giftlink.com',
        password: 'password123'
      });
      console.log('Demo user created');
    }

    // Clear existing gifts
    await Gift.deleteMany({});
    console.log('Cleared existing gifts');

    // Insert sample gifts
    const gifts = sampleGifts.map(gift => ({
      ...gift,
      userId: user._id
    }));

    await Gift.insertMany(gifts);
    console.log(`Successfully inserted ${gifts.length} gifts`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
