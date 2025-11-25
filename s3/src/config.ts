import {pulumiConfig} from '@common';
import {requireRegion} from '@pulumi/aws/config';

export const accountId = pulumiConfig.require("accountId");
export const bucketName = pulumiConfig.require("bucketName");
export const region = requireRegion();
