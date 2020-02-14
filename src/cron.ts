import { CronJob } from 'cron'

import Database from './db'
import { DATABASE_CLEANUP_CRONTIME } from './config'

export let dbCleanerService: CronJob

export const startDbCleanerService = () => {
  dbCleanerService = new CronJob(
    DATABASE_CLEANUP_CRONTIME,
    () => Database.cleanDbHistory().then(() => console.log('The database was cleaned.')),
    undefined,
    true,
    'Europe/Paris',
    undefined,
    true
  )
  dbCleanerService.start()
}
