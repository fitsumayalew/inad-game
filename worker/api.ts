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

    // Hydrate shuffle images
    for (const key of Object.keys(settings.shuffleImages) as Array<keyof typeof settings.shuffleImages>) {
      const obj = await c.env.INAD_IMAGES.get(`shuffleImages/${key}`);
      if (obj) {
        settings.shuffleImages[key] = await obj.text();
      }
    }
    // Hydrate spin images
    for (const key of Object.keys(settings.spinImages) as Array<keyof typeof settings.spinImages>) {
      const obj = await c.env.INAD_IMAGES.get(`spinImages/${key}`);
      if (obj) {
        settings.spinImages[key] = await obj.text();
      }
    }
    // Hydrate shuffle prizes
    for (const prize of settings.shufflePrizes) {
      if (!prize.base64image) {
        const obj = await c.env.INAD_IMAGES.get(`shufflePrizeImages/${prize.id}`);
        if (obj) {
          prize.base64image = await obj.text();
        }
      }
    }
    // Hydrate spin prizes
    for (const prize of settings.spinPrizes) {
      if (!prize.base64image) {
        const obj = await c.env.INAD_IMAGES.get(`spinPrizeImages/${prize.id}`);
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

    // Store shuffle images
    for (const [key, value] of Object.entries(body.shuffleImages)) {
      if (value && value.startsWith("data:")) {
        await c.env.INAD_IMAGES.put(`shuffleImages/${key}`, value);
        body.shuffleImages[key as keyof typeof body.shuffleImages] = "";
      }
    }
    // Store spin images
    for (const [key, value] of Object.entries(body.spinImages)) {
      if (value && value.startsWith("data:")) {
        await c.env.INAD_IMAGES.put(`spinImages/${key}`, value);
        body.spinImages[key as keyof typeof body.spinImages] = "";
      }
    }
    // Store shuffle prize images
    body.shufflePrizes = await Promise.all(
      body.shufflePrizes.map(async (prize) => {
        if (prize.base64image && prize.base64image.startsWith("data:")) {
          await c.env.INAD_IMAGES.put(`shufflePrizeImages/${prize.id}`, prize.base64image);
          return { ...prize, base64image: null };
        }
        return prize;
      })
    );
    // Store spin prize images
    body.spinPrizes = await Promise.all(
      body.spinPrizes.map(async (prize) => {
        if (prize.base64image && prize.base64image.startsWith("data:")) {
          await c.env.INAD_IMAGES.put(`spinPrizeImages/${prize.id}`, prize.base64image);
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
