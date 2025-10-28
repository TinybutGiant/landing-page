import { neon } from "@neondatabase/serverless";

type Env = {
  DATABASE_URL: string;
};

type Context = {
  env: Env;
  request: Request;
};

type GuideApplicationPayload = {
  name: string;
  email: string;
  country: string;
};

export const onRequestPost = async (
  { env, request }: Context,
): Promise<Response> => {
  const db = neon(env.DATABASE_URL);
  const data = (await request.json()) as GuideApplicationPayload;

  await db`INSERT INTO guide_applications (name, email, country) VALUES (${data.name}, ${data.email}, ${data.country})`;

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};