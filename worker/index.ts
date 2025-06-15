import { Env, Hono } from "hono";
import { Main } from "./main";
import api from "./api";
// import { cloudflareRateLimiter } from "@hono-rate-limiter/cloudflare";

// Define the Variables type
export interface Variables {
  main: DurableObjectStub<Main>;
  inad_images: R2Bucket;
  rateLimit: boolean;
}


type AppType = {
  Variables: Variables,
  Bindings: CloudflareBindings & {
    MAIN: DurableObjectNamespace<Main>;
    INAD_IMAGES: R2Bucket;
    RATE_LIMITER: RateLimit;
  }
};

const app = new Hono<AppType>();

// we create the stub connection earlier on in the process and assign
// it to a dedicated variable
app
  // .use(
  //   cloudflareRateLimiter<AppType>({
  //     rateLimitBinding: (c) => c.env.RATE_LIMITER,
  //     keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "", // Method to generate custom identifiers for clients.
  //   })
  // )
  
  .use("/api/*", async (c, next) => {
    const id = c.env.MAIN.idFromName("default");
    const stub = c.env.MAIN.get(id);
    c.set("main", stub);
    await next();
  })

  .route("/api", api);

export default app satisfies ExportedHandler<Env, Variables>;

export { Main } from "./main";
