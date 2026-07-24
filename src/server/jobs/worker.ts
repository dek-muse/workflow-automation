import { Worker } from "bullmq";
import { connection } from "./queues";
import { workflowEngine } from "@/server/workflows/workflow-engine";
const worker = new Worker("workflow-executions", async (job) => workflowEngine.run(job.data.executionId), { connection, concurrency: 5 });
worker.on("completed", (job) => console.log(JSON.stringify({ event: "job.completed", id: job.id })));
worker.on("failed", (job, error) => console.error(JSON.stringify({ event: "job.failed", id: job?.id, error: error.message })));
process.on("SIGTERM", async () => { await worker.close(); await connection.quit(); process.exit(0); });
