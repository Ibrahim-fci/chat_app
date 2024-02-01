import express from "express";

// singleton pattern
export class AppServer {
  public app: any;

  private static instance: null | AppServer = null;

  private constructor() {
    this.app = express();
  }

  public static getInstance() {
    if (this.instance == null) this.instance = new AppServer();
    return this.instance;
  }
}

export default AppServer;
