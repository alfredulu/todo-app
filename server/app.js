import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import supabasePlugin from "./plugins/supabase.js";
import todosRoutes from "./routes/todos.routes.js";

dotenv.config();

const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, { origin: true });
fastify.register(supabasePlugin);

// Register routes
fastify.register(todosRoutes, { prefix: "/api" });

// Root Route - API Info
fastify.get("/", async () => {
  return {
    success: true,
    name: "Todo API",
    status: "running",
    version: "1.0.0",
    endpoints: {
      root: "/",
      health: "/health",
      getTodos: "GET /api/todos",
      createTodo: "POST /api/todos",
      updateTodo: "PUT /api/todos/:id",
      toggleTodo: "PATCH /api/todos/:id/toggle",
      deleteTodo: "DELETE /api/todos/:id",
    },
  };
});

// Health check
fastify.get("/health", async (request, reply) => {
  return { status: "ok" };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3000", 10);
    const host = process.env.HOST || "0.0.0.0";
    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
