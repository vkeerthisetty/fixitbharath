const DEMO_OTP = "123456";

const DEMO_IDENTITIES = [
  {
    id: "citizen_001",
    aadhaarRef: "aadhaar_ref_9012",
    aadhaarMasked: "XXXX XXXX 7890",
    mobileMasked: "+91 ******7890",
    demoAadhaar: "9012 3456 7890",
    demoMobile: "9876547890",
  },
  {
    id: "citizen_002",
    aadhaarRef: "aadhaar_ref_3456",
    aadhaarMasked: "XXXX XXXX 1234",
    mobileMasked: "+91 ******1234",
    demoAadhaar: "3456 7890 1234",
    demoMobile: "9876541234",
  },
  {
    id: "citizen_003",
    aadhaarRef: "aadhaar_ref_5678",
    aadhaarMasked: "XXXX XXXX 3456",
    mobileMasked: "+91 ******3456",
    demoAadhaar: "2345 6789 0123",
    demoMobile: "9876543456",
  },
];

const normalizeDigits = (value) => value.replace(/\D/g, "");

const findIdentity = ({ aadhaar, mobile }) => {
  const aadhaarDigits = normalizeDigits(aadhaar || "");
  const mobileDigits = normalizeDigits(mobile || "");
  return DEMO_IDENTITIES.find(
    (identity) =>
      normalizeDigits(identity.demoAadhaar) === aadhaarDigits ||
      normalizeDigits(identity.demoMobile) === mobileDigits
  );
};

export async function requestLoginOtp({ aadhaar, mobile }) {
  const identity = findIdentity({ aadhaar, mobile });

  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!identity) {
    throw new Error("No linked mobile found for this demo identity.");
  }

  return {
    requestId: `otp_${Date.now()}_${identity.id}`,
    maskedMobile: identity.mobileMasked,
    maskedAadhaar: identity.aadhaarMasked,
    demoOtp: DEMO_OTP,
  };
}

export async function verifyLoginOtp({ aadhaar, mobile, otp }) {
  const identity = findIdentity({ aadhaar, mobile });

  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!identity) {
    throw new Error("Identity lookup failed.");
  }

  if (otp !== DEMO_OTP) {
    throw new Error("Invalid OTP. Use 123456 in this demo.");
  }

  return {
    id: identity.id,
    aadhaarRef: identity.aadhaarRef,
    aadhaarMasked: identity.aadhaarMasked,
    mobileMasked: identity.mobileMasked,
    displayName: identity.mobileMasked,
    authMethod: "aadhaar-linked-mobile-otp",
  };
}

export const demoIdentities = DEMO_IDENTITIES;
