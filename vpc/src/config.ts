import {requireRegion} from '@pulumi/aws/config';
import {pulumiConfig} from '@common';

export const accountId = pulumiConfig.require("accountId");
export const accountName = pulumiConfig.require("accountName");
export const region = requireRegion();
