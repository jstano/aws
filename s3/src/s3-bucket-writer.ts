import * as aws from '@pulumi/aws';
import {Provider} from '@pulumi/aws';
import {readResourceTemplated} from '@common';

export const provisionBackupBucketWriter = (provider: Provider, bucketName: string, username: string) => {
   const user = new aws.iam.User(username, {
      name: username,
   }, {
      provider: provider
   });

   const accessKey = new aws.iam.AccessKey(username, {
      user: user.name
   }, {
      provider: provider,
      dependsOn: user
   });

   accessKey.id.apply(id => {
      console.log(`********** ${id}`)
   });
   accessKey.secret.apply(secret => {
      console.log(`********** ${secret}`)
   });

   // createSecureParameterRoot(`${username}-access-key`,
   //    pulumi.interpolate`{"aws_access_key_id":"${accessKey.id}","aws_secret_access_key":"${accessKey.secret}"}`,
   //    provider,
   //    accessKey);

   const policy = new aws.iam.Policy(username, {
      name: `${username}-policy`,
      policy: readResourceTemplated("s3-writer-policy.json", {
         "bucketName": bucketName
      }),
   }, {
      provider: provider
   });

   new aws.iam.PolicyAttachment(username, {
      policyArn: policy.arn,
      users: [user]
   }, {
      provider: provider
   });
};
