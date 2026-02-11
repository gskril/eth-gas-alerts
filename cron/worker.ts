export default {
  async scheduled(event: ScheduledEvent, env: { CRON_SECRET: string; SITE_URL: string }) {
    const url = env.SITE_URL || 'https://ethgasalerts.xyz';
    await fetch(`${url}/api/record-gas`, {
      method: 'POST',
      headers: { 'x-cron-secret': env.CRON_SECRET },
    });
  },
};
