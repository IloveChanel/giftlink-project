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
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    userName: 'John Doe'
  },
  {
    name: 'Wooden Coffee Table',
    description: 'Solid oak coffee table with storage drawers. Great for living room.',
    category: 'Living Room',
    condition: 'Like New',
    age: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400',
    userName: 'Jane Smith'
  },
  {
    name: 'Queen Size Bed Frame',
    description: 'Sturdy wooden bed frame with headboard. Perfect condition.',
    category: 'Bedroom',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    userName: 'Mike Johnson'
  },
  {
    name: 'Dining Table Set',
    description: 'Table with 6 chairs. Ideal for family dinners. Minor scratches.',
    category: 'Kitchen',
    condition: 'Fair',
    age: '7 years',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400',
    userName: 'Sarah Williams'
  },
  {
    name: 'Office Desk',
    description: 'Large office desk with multiple drawers. Great for home office.',
    category: 'Office',
    condition: 'Good',
    age: '4 years',
    imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
    userName: 'John Doe'
  },
  {
    name: 'Bookshelf',
    description: 'Tall wooden bookshelf with 5 shelves. Holds many books.',
    category: 'Living Room',
    condition: 'Good',
    age: '6 years',
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
    userName: 'Jane Smith'
  },
  {
    name: 'Garden Chairs',
    description: 'Set of 4 outdoor chairs. Weather resistant and comfortable.',
    category: 'Outdoor',
    condition: 'Like New',
    age: '1 year',
    imageUrl: 'https://images.unsplash.com/photo-1601113647775-0ef4e04e6f57?w=400',
    userName: 'Mike Johnson'
  },
  {
    name: 'Bathroom Cabinet',
    description: 'White bathroom storage cabinet. Good condition with minor wear.',
    category: 'Bathroom',
    condition: 'Good',
    age: '5 years',
    imageUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400',
    userName: 'Sarah Williams'
  },
  {
    name: 'Bedside Tables',
    description: 'Pair of matching bedside tables with drawers.',
    category: 'Bedroom',
    condition: 'Good',
    age: '4 years',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
    userName: 'John Doe'
  },
  {
    name: 'Kitchen Island',
    description: 'Mobile kitchen island with storage and wheels. Very useful.',
    category: 'Kitchen',
    condition: 'Like New',
    age: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
    userName: 'Jane Smith'
  },
  {
    name: 'Patio Table',
    description: 'Large outdoor patio table. Perfect for summer gatherings.',
    category: 'Outdoor',
    condition: 'Fair',
    age: '8 years',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400',
    userName: 'Mike Johnson'
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with adjustable height. Very comfortable.',
    category: 'Office',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
    userName: 'Sarah Williams'
  },
  {
    name: 'Wardrobe',
    description: 'Large wardrobe with hanging space and shelves. Older but functional.',
    category: 'Bedroom',
    condition: 'Fair',
    age: '10 years',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
    userName: 'John Doe'
  },
  {
    name: 'TV Stand',
    description: 'Modern TV stand with cable management. Holds up to 55 inch TV.',
    category: 'Living Room',
    condition: 'Like New',
    age: '1 year',
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400',
    userName: 'Jane Smith'
  },
  {
    name: 'Kitchen Cart',
    description: 'Rolling kitchen cart with butcher block top. Great condition.',
    category: 'Kitchen',
    condition: 'Good',
    age: '3 years',
    imageUrl: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
    userName: 'Mike Johnson'
  },
  {
    name: 'Dresser',
    description: 'Six drawer dresser in white. Some scratches but sturdy.',
    category: 'Bedroom',
    condition: 'Fair',
    age: '9 years',
    imageUrl: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?w=400',
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
