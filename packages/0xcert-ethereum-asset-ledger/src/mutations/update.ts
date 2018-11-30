import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import xcertAbi from '../config/xcertAbi';

/**
 * Updates asset ledger uri base.
 */
export default async function(provider: GenericProvider, ledgerId: string, uriBase: string) {
  return provider.mutateContract({
    to: ledgerId,
    abi: xcertAbi.find((a) => a.name === 'setUriBase'),
    data: [uriBase],
  });
}