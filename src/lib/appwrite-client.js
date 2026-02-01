import { Client, Account, OAuthProvider } from "appwrite";

// Client-side Appwrite client for browser authentication
const client = new Client()
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export { OAuthProvider };

/**
 * Sign up with email and password
 */
export async function signUp(email, password, name) {
  try {
    // Create the account
    const user = await account.create("unique()", email, password, name);
    // Automatically sign in after registration
    await signIn(email, password);
    return user;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

/**
 * Sign in with OAuth provider (Google or LinkedIn)
 */
export function signInWithOAuth(provider) {
  const successUrl = `${window.location.origin}/auth/callback`;
  const failureUrl = `${window.location.origin}/login?error=oauth_failed`;

  account.createOAuth2Session(provider, successUrl, failureUrl);
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get current logged in user
 */
export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    // User not logged in
    return null;
  }
}

/**
 * Send password recovery email
 */
export async function sendPasswordRecovery(email) {
  try {
    const recoveryUrl = `${window.location.origin}/auth/reset-password`;
    await account.createRecovery(email, recoveryUrl);
  } catch (error) {
    console.error("Password recovery error:", error);
    throw error;
  }
}

/**
 * Complete password recovery
 */
export async function completePasswordRecovery(userId, secret, newPassword) {
  try {
    await account.updateRecovery(userId, secret, newPassword);
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}

/**
 * Update user preferences (like user type: jobseeker/employer)
 */
export async function updateUserPrefs(prefs) {
  try {
    await account.updatePrefs(prefs);
  } catch (error) {
    console.error("Update preferences error:", error);
    throw error;
  }
}

/**
 * Get user preferences
 */
export async function getUserPrefs() {
  try {
    const user = await account.get();
    return user.prefs || {};
  } catch (error) {
    console.error("Get preferences error:", error);
    return {};
  }
}
