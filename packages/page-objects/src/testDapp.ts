import { HTMLElement, PageObject } from "@assert-equals/dappdriver";
import { Connect } from "@assert-equals/dappdriver/wallet";

export class Dapp extends PageObject {
  private readonly accountsLabel: () => HTMLElement = () =>
    new HTMLElement("#accounts");
  private readonly connectButton: () => HTMLElement = () =>
    new HTMLElement("#connectButton");

  constructor() {
    super("http://localhost:3000/", "E2E Test Dapp");
  }

  async getAccounts(): Promise<string> {
    return await this.accountsLabel().getText();
  }

  async connect(): Promise<Connect> {
    return await this.connectButton().clickAndOpensInWindow<Connect>(Connect);
  }
}
