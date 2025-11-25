import * as aws from '@pulumi/aws';
import {Provider} from '@pulumi/aws';
import {InternetGateway, Subnet, Vpc} from '@pulumi/aws/ec2';

const mappings = {
   "us-east-2a": "use2-az1",
   "us-east-2b": "use2-az2",
   "us-east-2c": "use2-az3",
};

export const provisionVpc = (provider: Provider) => {
   const azIds = ["use1-az6", "use2-az1"];

   const vpcOutputs = createVpc(provider);
   const publicSubnets = createPublicSubnets(provider, vpcOutputs.vpc, vpcOutputs.igw);
   createPrivateSubnets(provider, vpcOutputs.vpc, vpcOutputs.igw, publicSubnets, false);
};

interface VpcOutput {
   vpc: Vpc;
   igw: InternetGateway;
}

interface SubnetsOutput {
   subnetA: Subnet;
   subnetB: Subnet;
}

const createVpc = (provider: Provider): VpcOutput => {
   const vpc = new aws.ec2.Vpc("us-east-2-vpc", {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: { Name: "us-east-2-vpc" },
   }, { provider });

   const igw = new aws.ec2.InternetGateway("us-east-2-igw", {
      vpcId: vpc.id,
      tags: { Name: "us-east-2-igw" },
   }, { provider });

   return {
      vpc,
      igw
   };
}

const createPublicSubnets = (
   provider: Provider,
   vpc: Vpc,
   igw: InternetGateway): SubnetsOutput => {
   const publicSubnetA = new aws.ec2.Subnet("public-subnet-a", {
      vpcId: vpc.id,
      cidrBlock: "10.0.0.0/18",
      availabilityZone: "us-east-2a",
      mapPublicIpOnLaunch: true,
      tags: { Name: "public-subnet-a" },
   }, { provider });

   const publicSubnetB = new aws.ec2.Subnet("public-subnet-b", {
      vpcId: vpc.id,
      cidrBlock: "10.0.64.0/18",
      availabilityZone: "us-east-2b",
      mapPublicIpOnLaunch: true,
      tags: { Name: "public-subnet-b" },
   }, { provider });

   const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
      vpcId: vpc.id,
      routes: [{
         cidrBlock: "0.0.0.0/0",
         gatewayId: igw.id,
      }],
      tags: { Name: "public-rt" },
   }, { provider });

   // Associate public subnets with the public route table
   new aws.ec2.RouteTableAssociation("public-subnet-a-assoc", {
      subnetId: publicSubnetA.id,
      routeTableId: publicRouteTable.id,
   }, { provider });

   new aws.ec2.RouteTableAssociation("public-subnet-b-assoc", {
      subnetId: publicSubnetB.id,
      routeTableId: publicRouteTable.id,
   }, { provider });

   return {
      subnetA: publicSubnetA,
      subnetB: publicSubnetB
   }
};

const createPrivateSubnets = (
   provider: Provider,
   vpc: Vpc,
   igw: InternetGateway,
   publicSubnets: SubnetsOutput,
   enableNatGateway: boolean): SubnetsOutput => {
   const publicSubnetA = publicSubnets.subnetA;
   const publicSubnetB = publicSubnets.subnetB;

   const privateSubnetA = new aws.ec2.Subnet("private-subnet-a", {
      vpcId: vpc.id,
      cidrBlock: "10.0.128.0/18",
      availabilityZone: "us-east-2a",
      mapPublicIpOnLaunch: false,
      tags: { Name: "private-subnet-a" },
   }, { provider });

   const privateSubnetB = new aws.ec2.Subnet("private-subnet-b", {
      vpcId: vpc.id,
      cidrBlock: "10.0.192.0/18",
      availabilityZone: "us-east-2b",
      mapPublicIpOnLaunch: false,
      tags: { Name: "private-subnet-b" },
   }, { provider });

   if (enableNatGateway) {
      // -- NAT Gateways --
      const eipA = new aws.ec2.Eip("nat-eip-a", { domain: "vpc" }, { provider });
      const natGatewayA = new aws.ec2.NatGateway("nat-gw-a", {
         allocationId: eipA.id,
         subnetId: publicSubnetA.id,
      }, { provider });

      const eipB = new aws.ec2.Eip("nat-eip-b", { domain: "vpc" }, { provider });
      const natGatewayB = new aws.ec2.NatGateway("nat-gw-b", {
         allocationId: eipB.id,
         subnetId: publicSubnetB.id,
      }, { provider });

      // -- Private route tables pointing to NATs --
      const privateRouteTableA = new aws.ec2.RouteTable("private-rt-a", {
         vpcId: vpc.id,
         routes: [{ cidrBlock: "0.0.0.0/0", natGatewayId: natGatewayA.id }],
         tags: { Name: "private-rt-a" },
      }, { provider });

      const privateRouteTableB = new aws.ec2.RouteTable("private-rt-b", {
         vpcId: vpc.id,
         routes: [{ cidrBlock: "0.0.0.0/0", natGatewayId: natGatewayB.id }],
         tags: { Name: "private-rt-b" },
      }, { provider });

      new aws.ec2.RouteTableAssociation("private-subnet-a-assoc", {
         subnetId: privateSubnetA.id,
         routeTableId: privateRouteTableA.id,
      }, { provider });

      new aws.ec2.RouteTableAssociation("private-subnet-b-assoc", {
         subnetId: privateSubnetB.id,
         routeTableId: privateRouteTableB.id,
      }, { provider });
   }

   return {
      subnetA: privateSubnetA,
      subnetB: privateSubnetB,
   };
};
