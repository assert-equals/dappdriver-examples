import { Dapp } from "@assert-equals/dappdriver-examples-page-objects";
import { Connect } from "@assert-equals/dappdriver/wallet";
import { When, Then } from "@cucumber/cucumber";
import { expect } from "chai";

When("the user connects their wallet", async (): Promise<void> => {
  let dapp: Dapp = new Dapp();
  const connectPage: Connect = await dapp.connect();
  dapp = await connectPage.accept<Dapp>(Dapp);
  await dapp.waitForWindows(1);
});

Then(
  "the dapp displays the users wallet {string}",
  async (expectedAccount: string): Promise<void> => {
    const dapp: Dapp = new Dapp();
    const actualAccount: string = await dapp.getAccounts();
    expect(actualAccount).to.be.equal(expectedAccount);
  }
);
