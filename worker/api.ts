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
    const stub = c.get("main");
    // Fetch the settings that are stored in the Durable Object (these no longer contain the image data)
    const storedSettings = await stub.getSettings();
    // Clone to avoid mutating Durable Object state
    const settings = structuredClone(storedSettings);

    // Re-hydrate game/base64 images from R2
    // 1. Global base64 images (cap, header, banner, lose)
    for (const key of Object.keys(settings.base64Images) as Array<keyof typeof settings.base64Images>) {
      const obj = await c.env.INAD_IMAGES.get(`base64Images/${key}`);
      if (obj) {
        // The images are stored in R2 as the raw base64 string, so we can read them as text
        settings.base64Images[key] = await obj.text();
      }
    }

    // 2. Prize images
    for (const prize of settings.prizes) {
      if (!prize.base64image) {
        const obj = await c.env.INAD_IMAGES.get(`prizeImages/${prize.id}`);
        if (obj) {
          prize.base64image = await obj.text();
        }
      }
    }

    return c.json(settings);
  })
  .post("/settings", async (c) => {
    const stub = c.get("main");
    const body = (await c.req.json()) as import("./helpers").Settings;

    // 1. Handle global images (cap, header, banner, lose)
    for (const [key, value] of Object.entries(body.base64Images)) {
      if (value && value.startsWith("data:")) {
        // Store the raw base64 string in R2 under a predictable key
        await c.env.INAD_IMAGES.put(`base64Images/${key}`, value);
        // Remove the heavy base64 string from what we store in the Durable Object
        body.base64Images[key as keyof typeof body.base64Images] = "";
      }
    }

    // 2. Handle prize images
    body.prizes = await Promise.all(
      body.prizes.map(async (prize) => {
        if (prize.base64image && prize.base64image.startsWith("data:")) {
          await c.env.INAD_IMAGES.put(`prizeImages/${prize.id}`, prize.base64image);
          return { ...prize, base64image: null };
        }
        return prize;
      })
    );

    // Persist the lightweight settings object to the Durable Object
    await stub.setSettings(body);

    // Return the stored settings (without the heavy image payloads)
    const settings = await stub.getSettings();
    return c.json(settings);
  })
  // .post("/upload", async (c) => {
  //   const formData = await c.req.parseBody()
  //   const file = formData['file']
  //   const file_name = formData['file_name']
    
  //   if (file instanceof File) {
  //       // Check file size (10 MB = 10 * 1024 * 1024 bytes)
  //       if (file.size > 10 * 1024 * 1024) {
  //           return c.text('File size exceeds 10 MB limit', 400)
  //       }
  //       // Check if file is an image
  //       if (!file.type.startsWith('image/')) {
  //           return c.text('Only image files are allowed', 400)
  //       }
  //       const fileBuffer = await file.arrayBuffer()
  //       const path = `${file_name}`
  //       await c.env.INAD_IMAGES.put(path, fileBuffer)
        
  //       return c.json({
  //               'url': `${PUBLIC_IMAGE_URL}/${file_name}`
  //       })
  //   } else {
  //       return c.text('Invalid file', 400)
  //   }
  // });

export default honoApi;
