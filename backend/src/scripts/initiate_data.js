import { createUserAdmin } from "../controllers/UserControllers.js";
import { createTagsRecord } from "../controllers/TagControllers.js";
import { createTargetsRecord } from "../controllers/TargetControllers.js";

await createUserAdmin();
await createTagsRecord();
await createTargetsRecord();

process.exit(0);