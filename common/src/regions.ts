export const regionShortNames: Record<string, string> = {
   "us-east-1": "usea1",
   "us-east-2": "usea2",
   "us-west-1": "uswe1",
   "us-west-2": "uswe2",
   "eu-west-1": "euwe1",
   "eu-west-2": "euwe2",
   "eu-west-3": "euwe3",
   "eu-central-1": "euce1",
   "eu-north-1": "euno3",
   "ap-southeast-1": "apse1",
   "ap-southeast-2": "apse2",
   "ap-south-1": "apso1",
   "ap-northeast-1": "apne1",
   "ap-northeast-2": "apne2",
   "ap-northeast-3": "apne3",
   "sa-east-1": "saea2",
   "cn-north-1": "cnno1"
};

export const regionShortName = (region: string) => {
   return regionShortNames[region];
};
