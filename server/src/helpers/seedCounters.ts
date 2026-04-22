import 'dotenv/config';
import { connectToDB } from '../database';
import { UserModel } from '../models/User';
import { CounterModel } from '../models/Counter';

async function main() {
    await connectToDB();

    const maxUser = await UserModel.findOne({}, {}, { sort: { userId: -1 } });
    const maxId = maxUser?.userId ?? 0;

    await CounterModel.findOneAndUpdate(
        { _id: 'userId' },
        { $set: { seq: maxId } },
        { upsert: true }
    );

    console.log(`userId counter set to ${maxId}.`);
    process.exit(0);
}

main();
