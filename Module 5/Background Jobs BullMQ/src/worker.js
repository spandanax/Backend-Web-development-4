'use strict';

const { Worker } = require('bullmq');
const { connection } = require('./queue');
const { transporter } = require('./email');

const worker = new Worker('email', async (job) => {
  if (job.name !== 'otp') {
    throw new Error(`Unsupported email job: ${job.name}`);
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER || 'no-reply@example.com',
    to: job.data.to,
    subject: 'Your verification code',
    text: `Your verification code is ${job.data.otp}.`,
  });
}, { connection });

worker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Email job ${job && job.id} failed: ${err.message}`);
});

module.exports = { worker };
