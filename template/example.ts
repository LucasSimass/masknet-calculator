// Created by Lucas Simas 02/2026
// GITHUB: https://github.com/LucasSimass

import { MaskNet } from "../subNet.ts";

// Accept CIRD
console.log(MaskNet.isValidMaskNet("/18"));   // output -> true

const sn = new MaskNet("/18");
console.log(sn.isDDN);            // output -> false
console.log(sn.isCIRD);           // output -> true
console.log(sn.getCIRD);          // output -> "/18"
console.log(sn.getDDN);           // output -> "255.255.192.0"
console.log(sn.getSubNets);       // output -> 4
console.log(sn.getAddresses);     // output -> 16384  # per sub-net
console.log(sn.getHosts);         // output -> 16382  # per sub-net
console.log(sn.getTotalAdresses)  // output -> 65536 
console.log(sn.getTotalHosts)     // output -> 65528 
console.log(sn.getDDNBytes)       // output -> "11111111.11111111.11000000.00000000" 

// Accept DDN
console.log(MaskNet.isValidMaskNet("255.255.255.0"));   // output -> true

const sn2 = new MaskNet("255.255.255.0");
console.log(sn2.isDDN);            // output -> true
console.log(sn2.isCIRD);           // output -> false
console.log(sn2.getCIRD);          // output -> "/24"
console.log(sn2.getDDN);           // output -> "255.255.255.0"
console.log(sn2.getSubNets);       // output -> 1
console.log(sn2.getAddresses);     // output -> 256  # per sub-net
console.log(sn2.getHosts);         // output -> 254  # per sub-net
console.log(sn2.getTotalAdresses)  // output -> 256 
console.log(sn2.getTotalHosts)     // output -> 254  
console.log(sn2.getDDNBytes)       // output -> "11111111.11111111.11111111.00000000" 