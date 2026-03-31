import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { connectToDB } from '../database';
import { ResourceModel } from '../models/Resource';
import type { Resource } from '../types/resource';

async function main() {
  try {
    await connectToDB();

    const resourceFile = path.join(__dirname, '../../data/resources.json');
    const resources: Resource[] = JSON.parse(fs.readFileSync(resourceFile, 'utf-8'));

    console.log()

    for (const res of resources) {
      const exists = await ResourceModel.findOne({ url: res.url });
      if (exists) {
        console.log(`Skipping (already exists in DB): ${res.title}`);
        continue;
      }

      const newResource = new ResourceModel(res);
      await newResource.save();
      console.log(`Saved: ${res.title}`);
    }

    console.log()
    console.log('All entries in resources.json have been processed.');
    process.exit(0);
  } catch (err) {
    console.error('There was an error uploading resources to the cluster:', err);
    process.exit(1);
  }
}

main();