import { Hono } from "hono";
import { Variables } from ".";
import { PUBLIC_IMAGE_URL } from "./config";
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
    const file_name = formData['file_name']
    
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
        const path = `${file_name}`
        await c.env.INAD_IMAGES.put(path, fileBuffer)
        
        return c.json({
                'url': `${PUBLIC_IMAGE_URL}/${file_name}`
        })
    } else {
        return c.text('Invalid file', 400)
    }
  });

export default honoApi;
