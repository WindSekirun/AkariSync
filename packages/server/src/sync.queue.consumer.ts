import { OnQueueActive, OnQueueWaiting, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor("syncQueue")
export class SyncQueueConsumer {
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @OnQueueWaiting()
  onWaiting(jobid: number | string) {
    console.log(`Job waiting ${jobid}`);
  }
}
