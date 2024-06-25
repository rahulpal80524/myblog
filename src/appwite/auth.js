import { Client, Account, ID } from "appwrite";
import conf from "../config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      // Correct method for creating an email session
      const session = await this.account.createEmailPasswordSession(email, password);
     
      return session;
    } catch (error) {
     
      throw error;
    }
  }

  async getCurrentUser() {
    try {
     
      const user = await this.account.get();
     
      return user;
    } catch (error) {
      if (error.message.includes("missing scope (account)")) {
        console.log("User is not authenticated. Please log in.");
      } else {
        console.log("Appwrite service :: getCurrentUser :: error", error);
      }
    }
    return null;
  }
  

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
