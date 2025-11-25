import * as aws from '@pulumi/aws';
import {Provider} from '@pulumi/aws';
import {readResourceTemplated} from '@common';
import {provisionBackupBucketWriter} from './s3-bucket-writer';
import {accountId, bucketName} from './config';

export const provisionBackupBucket = (provider: Provider) => {
   const username = `${bucketName.replace(".", "_")}-s3-writer}`;
   const bucketPolicy = readResourceTemplated("s3-policy.json", {
      "accountId": accountId,
      "bucketName": bucketName,
      "username": username
   });

   const bucket = new aws.s3.Bucket(bucketName, {
      bucket: bucketName,
      policy: bucketPolicy,
      // lifecycleRules: [
      //    {
      //       enabled: true,
      //       transitions: [
      //          {
      //             storageClass: "GLACIER_IR",
      //             days: 1
      //          }
      //       ]
      //    }
      // ]
   }, {
      provider: provider
   });

   provisionBackupBucketWriter(provider, bucketName, username);
};
