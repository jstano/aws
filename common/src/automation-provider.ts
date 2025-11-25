import * as aws from '@pulumi/aws';
import {Region} from '@pulumi/aws';
import {pulumiConfig} from './pulumi';

export interface AwsAutomationProviderConfig {
   accountId: string;
   accountName: string;
   region: Region;
}

export const awsAutomationProvider = (config?: AwsAutomationProviderConfig) => {
   const accountId = config ? config.accountId : pulumiConfig.require("accountId");
   const accountName = config ? config.accountName : pulumiConfig.require("accountName");
   const region = config ? config.region : aws.config.requireRegion();

   return new aws.Provider(pulumiConfig.name, {
      region: region,
      profile: "jstano",
      // profile: `${accountName}-automation`,
      // assumeRole: {
      //    roleArn: `arn:aws:iam::${accountId}:role/${accountName}-automation`
      // }
   });
};
