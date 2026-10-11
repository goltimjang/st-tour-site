import { app } from "./app";
import { admin, captcha } from "./security";
import { send } from "./notifications";
import { sendAlimtalk } from "./alimtalk";
export default app({ admin, captcha, send, sendAlimtalk });
