import cron from 'node-cron';
import alertService from '../services/alert.service.js';

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily alert cron jobs...');
  try {
    const overdueCount = await alertService.checkOverdueMilestones();
    console.log(`Created ${overdueCount} alerts for overdue milestones.`);
    
    // Add other cron checks here (SAEs, Monitoring, Queries)
  } catch (error) {
    console.error('Error in alert cron job:', error);
  }
});
