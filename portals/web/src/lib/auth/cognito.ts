import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult,
} from "amazon-cognito-identity-js";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";

const poolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};

let userPool: CognitoUserPool | null = null;

function getUserPool(): CognitoUserPool {
  if (!userPool && userPoolId && clientId) {
    userPool = new CognitoUserPool(poolData);
  }
  if (!userPool) {
    throw new Error("Cognito User Pool not configured. Check environment variables.");
  }
  return userPool;
}

export interface SignUpParams {
  email: string;
  password: string;
  name?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  sub: string;
  name?: string;
  emailVerified: boolean;
}

export async function signUp(params: SignUpParams): Promise<ISignUpResult> {
  const { email, password, name } = params;
  const pool = getUserPool();

  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];

  if (name) {
    attributeList.push(new CognitoUserAttribute({ Name: "name", Value: name }));
  }

  return new Promise((resolve, reject) => {
    pool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (!result) {
        reject(new Error("Sign up failed"));
        return;
      }
      resolve(result);
    });
  });
}

export async function confirmSignUp(email: string, code: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function resendConfirmationCode(email: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export async function signIn(params: SignInParams): Promise<CognitoUserSession> {
  const { email, password } = params;
  const pool = getUserPool();

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve(session);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: () => {
        reject(new Error("New password required"));
      },
    });
  });
}

export async function signOut(): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = pool.getCurrentUser();

  if (cognitoUser) {
    cognitoUser.signOut();
  }
}

export async function getCurrentSession(): Promise<CognitoUserSession | null> {
  const pool = getUserPool();
  const cognitoUser = pool.getCurrentUser();

  if (!cognitoUser) {
    return null;
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const pool = getUserPool();
  const cognitoUser = pool.getCurrentUser();

  if (!cognitoUser) {
    return null;
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        resolve(null);
        return;
      }

      cognitoUser.getUserAttributes((attrErr, attributes) => {
        if (attrErr || !attributes) {
          reject(attrErr);
          return;
        }

        const user: AuthUser = {
          email: "",
          sub: "",
          emailVerified: false,
        };

        attributes.forEach((attr) => {
          switch (attr.getName()) {
            case "email":
              user.email = attr.getValue();
              break;
            case "sub":
              user.sub = attr.getValue();
              break;
            case "name":
              user.name = attr.getValue();
              break;
            case "email_verified":
              user.emailVerified = attr.getValue() === "true";
              break;
          }
        });

        resolve(user);
      });
    });
  });
}

export async function getIdToken(): Promise<string | null> {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }
  return session.getIdToken().getJwtToken();
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }
  return session.getAccessToken().getJwtToken();
}

export async function forgotPassword(email: string): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: pool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const pool = getUserPool();
  const cognitoUser = pool.getCurrentUser();

  if (!cognitoUser) {
    throw new Error("No user signed in");
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session) {
        reject(err || new Error("No session"));
        return;
      }

      cognitoUser.changePassword(oldPassword, newPassword, (changeErr) => {
        if (changeErr) {
          reject(changeErr);
          return;
        }
        resolve();
      });
    });
  });
}
