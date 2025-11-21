const bcrypt = require("bcryptjs");
const { User, Producer, sequelize } = require("../models");

async function migratePasswords() {
  try {
    console.log("Starting password migration...");
    
    // 1. Migrate Users
    const users = await User.findAll();
    console.log(`Found ${users.length} users.`);
    
    let usersMigrated = 0;
    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$ and are 60 chars long)
      const isHashed = (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) && user.password.length === 60;
      
      if (!isHashed) {
        console.log(`Hashing password for user: ${user.email}`);
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        usersMigrated++;
      }
    }
    console.log(`Migrated ${usersMigrated} users.`);

    // 2. Migrate Producers
    const producers = await Producer.findAll();
    console.log(`Found ${producers.length} producers.`);
    
    let producersMigrated = 0;
    for (const producer of producers) {
      const isHashed = (producer.password.startsWith("$2a$") || producer.password.startsWith("$2b$")) && producer.password.length === 60;
      
      if (!isHashed) {
        console.log(`Hashing password for producer: ${producer.email}`);
        const hashedPassword = await bcrypt.hash(producer.password, 10);
        producer.password = hashedPassword;
        await producer.save();
        producersMigrated++;
      }
    }
    console.log(`Migrated ${producersMigrated} producers.`);
    
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sequelize.close();
  }
}

migratePasswords();
