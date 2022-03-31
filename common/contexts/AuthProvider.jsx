import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import {
  parseOutgoingCredentials,
  safeParseJSON,
  parseIncomingServerOptions,
  binArrayToJson,
} from "../helpers";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import Loading from "./../../components/Loading";
import { postRequestAuthed } from "../API";
import { variables } from "./../variables";
import { getRequestAuthed } from "./../API";

const SERVER_ROOT = process.env.SERVER_ROOT;
const FORM_CLIENT_ID = process.env.FORM_CLIENT_ID;
const FORM_CLIENT_SECRET = process.env.FORM_CLIENT_SECRET;
const PAT_CLIENT_ID = process.env.PAT_CLIENT_ID;
const PAT_CLIENT_SECRET = process.env.PAT_CLIENT_SECRET;

export const AuthContext = createContext();

export const emptyUser = {
  isLoggedIn: false,
  hasBioMetric: true,
  token: {
    token_type: "",
    expires_in: 0,
    access_token: "",
    refresh_token: "",
  },
  user: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
  PAT_TOKEN: "",
};

export const AuthProvider = ({ children }) => {
  const [AuthInfo, setAuthInfo] = useState(emptyUser);
  const [isLoading, setLoading] = useState(true);
  //persistence by cookie
  useEffect(() => {
    const savedAuthInfo = Cookies.get("user");

    if (savedAuthInfo) {
      setAuthInfo(safeParseJSON(savedAuthInfo) || emptyUser);
    }
    setLoading(false);
    return () => {};
  }, []);

  useEffect(() => {
    const AuthInfoToSave = {
      ...AuthInfo,
      user: { ...AuthInfo.user, biometrics: [] },
    };
    Cookies.set("user", JSON.stringify(AuthInfoToSave), {
      expires: 0.5,
      sameSite: "strict",
    });
    if (AuthInfo.isLoggedIn && AuthInfo.user.email) {
      localStorage.setItem("lastUser", JSON.stringify(AuthInfo.user || {}));
    }
    return () => {};
  }, [AuthInfo]);

  return (
    <AuthContext.Provider value={[AuthInfo, setAuthInfo]}>
      {isLoading ? (
        <div style={{ height: "100vh" }} className="center-icon">
          <Loading />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const [AuthInfo, setAuthInfo] = React.useContext(AuthContext);
  return [AuthInfo, setAuthInfo];
};

export const useRefreshUserData = () => {
  const [AuthInfo, setAuthInfo] = React.useContext(AuthContext);
  const refreshUserData = () => {
    return new Promise((resolve, reject) => {
      getRequestAuthed(variables.apiUrls.getUser)
        .then((res) => {
          if (res.data.status == "SUCCESS") {
            resolve(res.data.data);
          } else {
            reject(new Error("Failed to refresh user data"));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
  return refreshUserData;
};

export const useUser = () => {
  const [AuthInfo, setAuthInfo] = React.useContext(AuthContext);
  return AuthInfo.user;
};

export const getPatToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        SERVER_ROOT + "/v1/token/personal",
        {},
        {
          headers: {
            Authorization: `Basic ${Base64.stringify(
              Utf8.parse(`${PAT_CLIENT_ID}:${PAT_CLIENT_SECRET}`)
            )}`,
          },
        }
      )
      .then((res) => {
        const token = res.data.data.token;
        if (token) {
          resolve(token);
        } else {
          reject(new Error("Coudldn't get token"));
        }
      })
      .catch((e) => reject(e));
  });
};

export const signInWithEmailAndPasswordApi = (email, password) => {
  const authClient = Base64.stringify(
    Utf8.parse(`${FORM_CLIENT_ID}:${FORM_CLIENT_SECRET}`)
  );
  const userInput = Base64.stringify(Utf8.parse(`${email}:${password}`));

  return new Promise((resolve, reject) => {
    axios
      .post(
        SERVER_ROOT + "/v1/token",
        JSON.stringify({
          grant_type: "password",
          scope: "",
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${Base64.stringify(
              Utf8.parse(`${authClient}:${userInput}`)
            )}`,
          },
        }
      )
      .then((response) => {
        if (response.data?.status == "SUCCESS") {
          resolve(response.data);
        } else {
          reject(new Error("Authentication failed."));
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const signUpApi = (values) => {
  return new Promise((resolve, reject) => {
    getPatToken()
      .then((token) => {
        axios
          .post(SERVER_ROOT + "/v1/registration", values, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const signInWithBiometric = (email) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        SERVER_ROOT + "/v1/webauthn/login/options",
        JSON.stringify({
          email,
        }),
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${Base64.stringify(
              Utf8.parse(`${PAT_CLIENT_ID}:${PAT_CLIENT_SECRET}`)
            )}`,
          },
        }
      )
      .then(async (response) => {
        const publicKey = parseIncomingServerOptions({ ...response.data });

        if (!publicKey.allowCredentials) {
          reject(new Error("No biometric info registered for this account."));
          return;
        }

        const credentials = await navigator.credentials.get({
          publicKey,
        });

        const publicKeyCredential = parseOutgoingCredentials(credentials);

        axios
          .post(SERVER_ROOT + "/v1/webauthn/login", publicKeyCredential, {
            headers: {
              Authorization: `Basic ${Base64.stringify(
                Utf8.parse(`${PAT_CLIENT_ID}:${PAT_CLIENT_SECRET}`)
              )}`,
            },
          })
          .then((res) => {
            resolve(res.data);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export function useCheckHasAccountByEmail() {
  const checkAccount = (email) => {
    return new Promise((resolve, reject) => {
      getPatToken().then((token) => {
        axios
          .post(
            SERVER_ROOT + "/v1/forget-password",
            JSON.stringify({
              email,
            }),
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  };
  return checkAccount;
}

export function useResetPasssword() {
  const resetPassword = (otp, email, password, password_confirmation) => {
    return new Promise((resolve, reject) => {
      getPatToken().then((token) => {
        axios
          .post(
            variables.apiUrls.resetPassword,
            {
              otp,
              email,
              password,
              password_confirmation,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(async (response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  };
  return resetPassword;
}

export function changePasssword(
  otp,
  old_password,
  password,
  password_confirmation
) {
  return new Promise((resolve, reject) => {
    postRequestAuthed(variables.apiUrls.changePassword, {
      otp,
      old_password,
      password,
      password_confirmation,
    })
      .then(async (response) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function useLogout() {
  const [AuthInfo, setAuthInfo] = React.useContext(AuthContext);
  const logOut = (token) => {
    const user = safeParseJSON(Cookies.get("user"));
    return new Promise((resolve, reject) => {
      setAuthInfo(emptyUser);
      axios
        .post(
          SERVER_ROOT + "/v1/logout",
          {},
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token.access_token}`,
            },
          }
        )
        .then((response) => {
          setAuthInfo(emptyUser);
          resolve(response.data?.message || "Logged out.");
        })
        .catch((e) => {
          setAuthInfo(emptyUser);
          resolve("Logged out.");
        });
    });
  };
  return logOut;
}
