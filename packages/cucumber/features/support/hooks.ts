import {
  DappDriver,
  CHROME,
  METAMASK,
  PLAYWRIGHT,
} from "@assert-equals/dappdriver";
import type { BrowserOptions } from "@assert-equals/dappdriver";
import { Dapp } from "@assert-equals/dappdriver-examples-page-objects";
import { After, Before } from "@cucumber/cucumber";
import dotenv from "dotenv";
import { TestDapp } from "@assert-equals/dappdriver-examples-test-dapp";
import path from "path";

dotenv.config({ path: "../../.env" });
let server = new TestDapp(3000);

Before(async (): Promise<void> => {
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
  await DappDriver.create<Dapp>(
    "http://localhost:3000/",
    PLAYWRIGHT,
    CHROME,
    Dapp,
    browserOptions
  );
});

After(async (): Promise<void> => {
  await DappDriver.dispose();
  await server.shutdown();
});
