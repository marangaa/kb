import { eveChannel } from "eve/channels/eve";
import { localDev, vercelOidc, type AuthFn } from "eve/channels/auth";

/**
 * Mock authentication provider for local development.
 * Ensures Interactive OAuth succeeds without "principal_required" errors.
 */
const mockUserAuth: AuthFn = async (req) => {
  return { 
    principalType: "user", 
    principalId: "local-dev-user",
    authenticator: "mock",
    attributes: {},
  };
};

export default eveChannel({
  auth: [
    vercelOidc(),
    localDev(),
    mockUserAuth,
  ],
});
