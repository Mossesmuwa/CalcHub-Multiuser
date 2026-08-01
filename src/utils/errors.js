// Turns Supabase/network error messages into plain English.
// Never shows raw technical text to the user.

export function friendlyAuthError(message = "") {
  const text = message.toLowerCase();

  if (text.includes("invalid login credentials"))
    return "Email or password is incorrect.";
  if (text.includes("user already registered"))
    return "An account with this email already exists.";
  if (text.includes("email not confirmed"))
    return "Please verify your email before logging in.";
  if (text.includes("password should be at least"))
    return "Password needs to be at least 6 characters.";
  if (text.includes("rate limit"))
    return "Too many attempts — please wait a minute and try again.";
  if (text.includes("network"))
    return "Can't reach the server. Check your connection.";

  return "Something went wrong. Please try again.";
}
