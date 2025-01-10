import {seedCategories, seedChatTypes, seedUsers, seedLocations} from "./seed";

async function RunSeeds() {
    await seedUsers();
    await seedChatTypes();
    await seedCategories();
    await seedLocations();
}

export default RunSeeds