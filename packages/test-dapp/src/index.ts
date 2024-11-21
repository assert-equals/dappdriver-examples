import * as path from "path";
import * as http from "http";
import serveHandler from "serve-handler";

export class TestDapp {
  private server: http.Server;
  private port: number;
  private directory: string;

  constructor(port: number) {
    this.port = port;
    this.directory = path.join(
      __dirname,
      "../../../node_modules/@metamask/test-dapp/dist/"
    );
    this.server = http.createServer((req, res) => {
      return serveHandler(req, res, { public: this.directory });
    });
  }

  startServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server
        .listen(this.port, (): void => {
          resolve();
        })
        .on("error", (err: Error): void => {
          reject(err);
        });
    });
  }

  shutdown(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err: Error): void => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
