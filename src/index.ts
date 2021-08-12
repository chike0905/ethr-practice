import { EthrDID } from 'ethr-did';
import { ethers } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

// Env
const rpcUrl = 'http://localhost:8545';
const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrl);

const contractAddress = '0x5717346e00405132ea633df0b5a5a6e629c7e8b7';

const privateKey1 = '0x2e61ecd84e20a343231f82e0b89067d32c4fb26e8db1af65e071edcc96ad2f34';
const ethereumAddress1 = '0xB2f0b48736D868E24DFdA5034DFC688FaDeC0F19';

const privateKey2 = '0xbb700e968fad7bb544c2f355eab457cc67aeff4f9a48c2f18556b2dda4b5e976';
const ethereumAddress2 = '0xc1255Ab675404c5179595923CCfCDc1aeFdAD8b9';

// 1. Create DID
function createDid(privateKey: string, ethereumAddress: string) {
  const txSigner = new Wallet(privateKey, rpcProvider);
  const ethrDid = new EthrDID(
    {
      identifier: ethereumAddress,
      txSigner,
      chainNameOrId: 1337,
      provider: rpcProvider,
      registry: contractAddress,
    },
  );
  return ethrDid;
}

// 2. Resolution
async function resolve(didobj: EthrDID) {
  const didResolver = new Resolver(
    getResolver({
      rpcUrl,
      chainId: 1337,
      registry: contractAddress,
    }),
  );
  try {
    const res = await didResolver.resolve(didobj.did);
    console.log(res);
  } catch (err) {
    console.log(`ResolveERROR: ${err.message}`);
  }
}

// 3. setAttribute
async function setService(didobj: EthrDID, service: string, serviceUrl: string) {
  try {
    const res = await didobj.setAttribute(`did/svc/${service}`, serviceUrl, 31104000);
    console.log(`Set Attribute Success! : ${res}`);
  } catch (err) {
    console.log(`SetAttributeERROR: ${err.message}`);
  }
}

// Body
async function main() {
  const ethrDid = createDid(privateKey1, ethereumAddress1);
  const ethrDid2 = createDid(privateKey2, ethereumAddress2);

  console.log('Before Set Service');
  await resolve(ethrDid);
  await resolve(ethrDid2);
  await setService(ethrDid, 'ChikeWeb', 'https://chike.xyz');
  await setService(ethrDid2, 'ChikeWeb', 'https://chike.xyz');
  console.log('After Set Service');
  await resolve(ethrDid);
  await resolve(ethrDid2);
  console.log('After Set Service only to DID1');
  await setService(ethrDid, 'ChikeWeb', 'https://chike.xyz');
  await resolve(ethrDid);
  await resolve(ethrDid2);
}

main();
