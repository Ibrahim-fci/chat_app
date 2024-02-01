import AppServer from "./appServer";
const app = AppServer.getInstance().app;
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";

// singleton pattern
export class SocketServer {
  public server: any = server;
  public socket: any;
  public io: any = new Server(this.server, {
    cors: {
      origin: "*"  ,
      credentials: true,
    },
  });

  private static instance: null | SocketServer = null;

  private constructor() {}

  public static getInstance() {
    if (this.instance == null) this.instance = new SocketServer();

    return this.instance;
  }
}

export default SocketServer;
