import {awsAutomationProvider} from '@common';
import {provisionBackupBucket} from './src/main';

provisionBackupBucket(awsAutomationProvider());

