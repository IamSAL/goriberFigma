import en from "./locales/en";
import bn from "./locales/bn";
import { toast } from "react-toastify";

export const translate = (locale, key, params = null) => {
  if (locale === "bn") {
    return getValue(bn, key, params);
  } else {
    return getValue(en, key, params);
  }
};

function getValue(locale, key, params = null) {
  let keys = key.split(".");
  let test = locale;
  keys.forEach((i) => {
    test = test[i];
  });

  // currently not needed as params will be empty always
  if (params !== null) {
    let stripped = test;
    Object.keys(params).forEach((j) => {
      stripped = stripped.replace(`{${j}}`, params[j]);
    });
    return stripped;
  } else {
    return test || key;
  }
}

export const translateText = (lang, item, key = "title") => {
  if (typeof item === "undefined" || item === null) {
    return "";
  }
  return lang === "en" ? item[key + "_en"] : item[key + "_bn"];
};

export const flatArray = (arr) => {
  const flat = [];
  arr.map((p) => {
    if (p.children) {
      p.children.map((cp) => {
        flat.push(cp);
      });
      p.children = [];
    }
    flat.push(p);
  });
  return flat;
};

export const safeParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
};

export async function avoidRateLimit(ms = 1000) {
  console.log(`==>SLEEP:${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "production") {
    await sleep(ms);
  }
}

function sleep(ms = 1000) {
  return new Promise((res) => setTimeout(res, ms));
}

export function checkPlatformWebAuthnSupport() {
  return new Promise((resolve, reject) => {
    if (
      window.location.protocol === "http:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      resolve(false);
    }
    if (
      window.PublicKeyCredential === undefined ||
      typeof window.PublicKeyCredential !== "function"
    ) {
      resolve(false);
      console.log("checked false");
    }
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(
      (supported) => {
        if (supported) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
}

export function arrayToBase64String(arrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

export function uint8Array(input, atob = false) {
  return Uint8Array.from(
    atob ? window.atob(input) : base64UrlDecode(input),
    (c) => c.charCodeAt(0)
  );
}

export function base64UrlDecode(input) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;

  if (pad) {
    if (pad === 1) {
      throw new Error(
        "InvalidLengthError: Input base64url string is the wrong length to determine padding"
      );
    }

    input += new Array(5 - pad).join("=");
  }

  return window.atob(input);
}

export function parseOutgoingCredentials(credentials) {
  let parseCredentials = {
    id: credentials.id,
    type: credentials.type,
    rawId: arrayToBase64String(credentials.rawId),
    response: {},
  };
  [
    "clientDataJSON",
    "attestationObject",
    "authenticatorData",
    "signature",
    "userHandle",
  ]
    .filter((key) => credentials.response[key] !== undefined)
    .forEach((key) => {
      parseCredentials.response[key] = arrayToBase64String(
        credentials.response[key]
      );
    });

  return parseCredentials;
}

export function parseIncomingServerOptions(publicKey) {
  publicKey.challenge = uint8Array(publicKey.challenge);

  if (publicKey.user !== undefined) {
    publicKey.user = {
      ...publicKey.user,
      id: uint8Array(publicKey.user.id, true),
    };
  }

  ["excludeCredentials", "allowCredentials"]
    .filter((key) => publicKey[key] !== undefined)
    .forEach((key) => {
      publicKey[key] = publicKey[key].map((data) => {
        return { ...data, id: uint8Array(data.id) };
      });
    });

  // if (publicKey.allowCredentials) {
  //   publicKey.allowCredentials = publicKey.allowCredentials.map((cred) => {
  //     return {
  //       type: "public-key",
  //       id: cred.id,
  //       transports: ["usb", "nfc", "ble", "internal"],
  //     };
  //   });
  // }
  // // publicKey.attestation = "indirect";
  // publicKey.authenticatorSelection = {
  //   requireResidentKey: false,
  //   userVerification: "discouraged",
  //   authenticatorAttachment: "platform",
  // };
  console.log(
    "MODIFIED:==>",
    publicKey.attestation,
    publicKey.authenticatorSelection
  );

  return publicKey;
}

export const binArrayToJson = function (binArray) {
  var str = "";
  for (var i = 0; i < binArray.length; i++) {
    str += String.fromCharCode(parseInt(binArray[i]));
  }
  return JSON.parse(str);
};

export function getRandomString(length) {
  return "1jIPERky986Vw8bgOgHE0no1jRCS3c1a1UvazC30qTQ34WPl9mfsd2joZ0H8a4ZyKEclKLIIdj8whoZwgKhEgfpbxwRjU8TpflWe4K4gmCibCz2MDSXUFFwUTakFyUEZ";
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function textToClipboard(text) {
  console.log("copied", text);
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

export function toastErrors(err) {
  if (err.response?.status == 422) {
    const errors = err.response?.data?.message;
    Object.keys(errors || {}).map((field) => {
      errors[field].forEach((message) => {
        toast.error(message);
      });
    });
  } else if (err.response?.status == 400) {
    toast.error(err.response?.data?.message || "Failed, please try again.");
  } else if (err.response?.status == 302) {
    toast.error(err.response?.data?.message || "Failed, please try again.");
  } else {
    toast.error(err.message || "Failed, please check your network.");
  }
}

export const validateBDPhone = (bdPhone) => {
  // console.log("called phone", bdPhone);
  let regexbdPhone = /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/;
  if (bdPhone.match(regexbdPhone) && bdPhone.length === 13) {
    return true;
  } else {
    return false;
  }
};

export function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function calculateDaysBetweenDates(date1, date2) {
  var oneDay = 24 * 60 * 60 * 1000;
  var date1InMillis = date1.getTime();
  var date2InMillis = date2.getTime();
  var days = Math.round(Math.abs(date2InMillis - date1InMillis) / oneDay);
  return days;
}
