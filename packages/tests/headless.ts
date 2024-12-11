import {
  CHROME,
  DappDriver,
  HEADLESS,
  HeadlessWalletServer,
  PLAYWRIGHT,
} from "@assert-equals/dappdriver";
import { Dapp } from "@assert-equals/dappdriver-examples-page-objects";
import { expect } from "chai";
import { TestDapp } from "@assert-equals/dappdriver-examples-test-dapp";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

(async function test(): Promise<void> {
  let server = new TestDapp(3000);
  await server.startServer();
  const headlessWalletPort: number = 3001;
  const headlessWalletServer: HeadlessWalletServer = new HeadlessWalletServer({
    mnemonic: process.env.DAPPDRIVER_SEED_PHRASE,
    port: headlessWalletPort,
  });
  await headlessWalletServer.start();
  let dapp: Dapp = await DappDriver.create<Dapp>(
    "http://localhost:3000/",
    PLAYWRIGHT,
    CHROME,
    Dapp,
    {
      extension: {
        wallet: HEADLESS,
        port: headlessWalletPort,
      },
    }
  );
  try {
    const actualAccount: string = await dapp.getAccounts();
    const expectedAccount = "0xE18035BF8712672935FDB4e5e431b1a0183d2DFC";
    expect(actualAccount).to.be.equal(expectedAccount);
  } finally {
    await DappDriver.dispose();
    await server.shutdown();
    await headlessWalletServer.stop();
  }
})();
