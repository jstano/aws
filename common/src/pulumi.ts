import {Config} from '@pulumi/pulumi';

export const pulumiConfig = new Config();

export const pulumiSecret = (name: string) => {
   return new Promise<string>((resolve) => {
      pulumiConfig.requireSecret(name).apply(value => resolve(value));
   });
};
