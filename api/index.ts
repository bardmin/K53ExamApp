import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware for Vercel logs
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (req.path.startsWith("/api")) {
            console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
        }
    });
    next();
});

const httpServer = createServer(app);

// Initialize routes using top-level await (supported in Node.js 18+ ESM)
await registerRoutes(httpServer, app);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Vercel API Error:", err);
    res.status(status).json({ message });
});

export default app;
