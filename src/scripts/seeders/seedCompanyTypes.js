import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { compnayTypes } from '../constants/company.constants.js';
import { CompanyType } from '../modules/company/models/companyType.model.js';

/**
 * Usage:
 *    npm run seed:companytypes
 *
 * This script enumerates all permutations (non-empty subsets) of the modeOfOperations
 * for each company type (CLIENT, VENDOR), then seeds them into the database.
 */

// Helper to generate all non-empty subsets of an array
function getAllSubsets(array) {
  const subsets = [];
  const total = 1 << array.length; // 2^length
  for (let mask = 1; mask < total; mask++) {
    const subset = [];
    for (let i = 0; i < array.length; i++) {
      if (mask & (1 << i)) {
        subset.push(array[i]);
      }
    }
    subsets.push(subset);
  }
  return subsets;
}

const seedCompanyTypes = async () => {
  try {
    await connectDB();

    // Clear existing
    await CompanyType.deleteMany({});

    // The main array of data we will insert
    const data = [];

    // modeofoperations is an object with keys: { C2C, C2H, FTE }
    const allModes = Object.values(compnayTypes.modeofoperations);

    // Generate all non-empty subsets
    const subsets = getAllSubsets(allModes);

    // For each company type, generate an entry for each subset of modes
    Object.values(compnayTypes.type).forEach((typeValue) => {
      subsets.forEach((subset) => {
        data.push({
          companytype: typeValue,
          companymodeofoperation: subset,
        });
      });
    });

    await CompanyType.insertMany(data);
    console.log('Seeded CompanyTypes successfully. Inserted:', data.length);
  } catch (error) {
    console.error('Error seeding company types:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedCompanyTypes();
