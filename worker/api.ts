import { Hono } from "hono";
import { Variables } from ".";
const honoApi = new Hono<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>();

honoApi
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/settings", async (c) => {
    const settings = await c.get("main").getSettings();
    return c.json(settings);
  })
  .post("/settings", async (c) => {
    const stub = c.get("main");
    const body = await c.req.json();
    await stub.setSettings(body);
    const settings = stub.getSettings();
    return c.json(settings);
  })
  .post("/upload", async (c) => {
    const formData = await c.req.parseBody()
    const file = formData['file']
    const prize_index = formData['prize_index']
    const filBucket = c.get("inad_images")
    if (file instanceof File) {
        // Check file size (10 MB = 10 * 1024 * 1024 bytes)
        if (file.size > 10 * 1024 * 1024) {
            return c.text('File size exceeds 10 MB limit', 400)
        }
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            return c.text('Only image files are allowed', 400)
        }
        const fileBuffer = await file.arrayBuffer()
        const path = `images/${prize_index}`
        await filBucket.put(path, fileBuffer)
    } else {
        return c.text('Invalid file', 400)
    }
  });

export default honoApi;
