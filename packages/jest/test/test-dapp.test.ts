import {
  CHROME,
  DappDriver,
  PLAYWRIGHT,
  METAMASK,
} from "@assert-equals/dappdriver";
import type { BrowserOptions } from "@assert-equals/dappdriver";
import { Dapp } from "@assert-equals/dappdriver-examples-page-objects";
import { Connect } from "@assert-equals/dappdriver/wallet";
import * as dotenv from "dotenv";
import { TestDapp } from "@assert-equals/dappdriver-examples-test-dapp";
import path from "path";

describe("E2E Test Dapp", (): void => {
  dotenv.config({ path: "../../.env" });
  let dapp: Dapp;
  let server = new TestDapp(3000);

  beforeAll(async (): Promise<void> => {
    await server.startServer();
    const browserOptions: BrowserOptions = {
      extension: {
        wallet: METAMASK,
        seed: process.env.DAPPDRIVER_SEED_PHRASE,
        path: path.join(
          process.cwd(),
          "../../node_modules/@assert-equals/dappdriver/metamask-chrome-12.17.3"
        ),
      },
    };
    dapp = await DappDriver.create<Dapp>(
      "http://localhost:3000/",
      PLAYWRIGHT,
      CHROME,
      Dapp,
      browserOptions
    );
  });

  afterAll(async (): Promise<void> => {
    await DappDriver.dispose();
    await server.shutdown();
  });

  it("Connect", async (): Promise<void> => {
    const connectPage: Connect = await dapp.connect();
    dapp = await connectPage.accept<Dapp>(Dapp);
    await dapp.waitForWindows(1);
    const actualAccount: string = await dapp.getAccounts();
    const expectedAccount = "0xe18035bf8712672935fdb4e5e431b1a0183d2dfc";
    expect(actualAccount).toEqual(expectedAccount);
  });
});
