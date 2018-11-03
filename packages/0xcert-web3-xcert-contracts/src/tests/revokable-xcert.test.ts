import { Spec } from '@specron/spec';

/**
 * Spec context interfaces.
 */

interface Data {
  xcert?: any;
  owner?: string;
  bob?: string;
  jane?: string;
  sara?: string;
  zeroAddress?: string;
  id1?: string;
  id2?: string;
  id3?: string;
  uriBase?: string;
  proof1?: string;
  proof2?: string;
  proof3?: string;
}

const spec = new Spec<Data>();

export default spec;

spec.beforeEach(async (ctx) => {
  const accounts = await ctx.web3.eth.getAccounts();
  ctx.set('owner', accounts[0]);
  ctx.set('bob', accounts[1]);
  ctx.set('jane', accounts[2]);
  ctx.set('sara', accounts[3]);
  ctx.set('zeroAddress', '0x0000000000000000000000000000000000000000');
});

spec.beforeEach(async (ctx) => {
  ctx.set('id1', '123');
  ctx.set('id2', '124');
  ctx.set('id3', '125');
  ctx.set('uriBase', 'http://0xcert.org/');
  ctx.set('proof1', '973124FFC4A03E66D6A4458E587D5D6146F71FC57F359C8D516E0B12A50AB0D9');
  ctx.set('proof2', '6F25B3F4BC7EADAFB8F57D69F8A59DB3B23F198151DBF3C66AC3082381518329');
  ctx.set('proof3', 'C77A290BE17F8A4EF301C4CA46497C5BEB4A0556EC2D5A04DCE4CE6EBD439AD1');
});

spec.beforeEach(async (ctx) => {
  const owner = ctx.get('owner');
  const uriBase = ctx.get('uriBase');
  const xcert = await ctx.deploy({ 
    src: './build/revokable-xcert-mock.json',
    contract: 'RevokableXcertMock',
    args: ['Foo','F',uriBase,'0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658']
  });

  await xcert.instance.methods.assignAbilities(owner, [1,2]).send({ from: owner });
  ctx.set('xcert', xcert);
});

spec.test('successfuly revokes an xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const id2 = ctx.get('id2');
  const proof1 = ctx.get('proof1');
  const proof2 = ctx.get('proof2');

  await xcert.instance.methods.mint(bob, id1, proof1).send({ from: owner });
  await xcert.instance.methods.mint(bob, id2, proof2).send({ from: owner });
  const logs = await xcert.instance.methods.revoke(id1).send({ from: owner });
  ctx.not(logs.events.Transfer, undefined);

  const balance = await xcert.instance.methods.balanceOf(bob).call();
  ctx.is(balance, '1');
  await ctx.reverts(() => xcert.instance.methods.ownerOf(id1).call(), '006002');
   
  const tokenIndex0 = await xcert.instance.methods.tokenByIndex(0).call();
  ctx.is(tokenIndex0, id2);

  const tokenOwnerIndex0 = await xcert.instance.methods.tokenOfOwnerByIndex(bob, 0).call();
  ctx.is(tokenOwnerIndex0, id2);

  await ctx.reverts(() => xcert.instance.methods.tokenByIndex(1).call(), '006007');
  await ctx.reverts(() => xcert.instance.methods.tokenOfOwnerByIndex(bob, 1).call(), '006007');
});

spec.test('throws when trying to revoke an already revoked xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const proof1 = ctx.get('proof1');

  await xcert.instance.methods.mint(bob, id1, proof1).send({ from: owner });
  await xcert.instance.methods.revoke(id1).send({ from: owner});
  await ctx.reverts(() => xcert.instance.methods.revoke(id1).send({ from: owner }), '006002');
});

spec.test('throws when a third party tries to revoke a xcert', async (ctx) => {
  const xcert = ctx.get('xcert');
  const owner = ctx.get('owner');
  const bob = ctx.get('bob');
  const id1 = ctx.get('id1');
  const proof1 = ctx.get('proof1');

  await xcert.instance.methods.mint(bob, id1, proof1).send({ from: owner });
  await ctx.reverts(() => xcert.instance.methods.revoke(id1).send({ from: bob }));
});