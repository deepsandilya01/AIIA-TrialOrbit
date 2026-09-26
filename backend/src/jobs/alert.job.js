import cron from 'node-cron';
import alertService from '../services/alert.service.js';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily alert cron jobs...');
  try {
    const overdueCount = await alertService.checkOverdueMilestones();
    console.log(`Created ${overdueCount} alerts for overdue milestones.`);
    
    // Add SAEs Overdue check
    const safetyService = (await import('../services/safety.service.js')).default;
    
    const dueCount = await safetyService.checkDueSAEs();
    console.log(`Emitted ${dueCount} safety:sae_due events.`);

    const saeCount = await safetyService.checkOverdueSAEs();
    console.log(`Emitted ${saeCount} safety:sae_overdue events.`);
  } catch (error) {
    console.error('Error in alert cron job:', error);
  }
});
