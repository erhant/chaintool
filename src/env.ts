const REQUIRED_VARS = [
  "OPENAI_API_KEY",
  "CDP_API_KEY_NAME",
  "CDP_API_KEY_PRIVATE_KEY",
] as const;

/** Validates that required environment variables are set. */
export function validateEnvironment(): void {
  const missingVars = REQUIRED_VARS.filter((str) => !process.env[str]);

  // exit if any required variables are missing
  if (missingVars.length > 0) {
    console.error("Error: Required environment variables are not set");
    missingVars.forEach((varName) => {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    });
    process.exit(1);
  }

  // warn about optional NETWORK_ID
  if (!process.env.NETWORK_ID) {
    console.warn(
      "Warning: NETWORK_ID not set, defaulting to base-sepolia testnet"
    );
  }
}
