import { Queue } from "bullmq";
import IORedis from "ioredis";
import { env } from "@/config/env";
export const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
export const workflowQueue = new Queue("workflow-executions", { connection });
export async function enqueueWorkflowExecution(data: { executionId: string }) { return workflowQueue.add("run", data, { jobId: data.executionId, attempts: 3, backoff: { type: "exponential", delay: 1000 } }); }
