import { app } from "./app";
import { admin, captcha } from "./security";
import { send } from "./notifications";
export default app({ admin, captcha, send });
