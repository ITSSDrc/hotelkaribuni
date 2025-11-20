export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

/**
 * A custom error class to provide detailed context about Firestore security rule violations.
 * This is crucial for debugging during development.
 */
export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const summary = `
============================================================
FIRESTORE PERMISSION DENIED
------------------------------------------------------------
Operation: ${context.operation.toUpperCase()}
Path: /${context.path}
------------------------------------------------------------
This request was blocked by your Firestore security rules.
During development, ensure the user is authenticated and
has the necessary role or ownership rights.
============================================================
`;

    super(summary);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is to make the error visible in the Next.js overlay
    // by providing a more detailed debug summary.
    this.message = this.getDebugSummary();
  }

  /**
   * Generates a detailed debug summary.
   */
  getDebugSummary(): string {
    const summary = {
      message: "Firestore security rules denied this request.",
      operation: this.context.operation,
      path: `/${this.context.path}`,
      ...(this.context.requestResourceData && {
        requestData: this.context.requestResourceData,
      }),
    };

    return `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(summary, null, 2)}`;
  }
}
