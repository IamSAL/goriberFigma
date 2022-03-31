export const baseUrl = process.env.SERVER_ROOT + "/v1";
export const dataURL = "https://cms.softwindtech.com/v1";
export const variables = {
  apiUrls: {
    baseUrl: baseUrl,
    getUser: `${baseUrl}/user`,
    getSingleBeneficiary: `${dataURL}/beneficiary/`,
    getAccounts: `${baseUrl}/user/accounts`,
    getBeneficiaries: `${dataURL}/beneficiary`,
    getBanks: `${dataURL}/common/banks`,
    getTransactions: `${dataURL}/user/transactions`,
    getOperators: `${dataURL}/common/mobile-operators`,
    createTransfer: `${dataURL}/user/balance-transfer`,
    createRecharge: `${dataURL}/user/recharge`,
    createBeneficiary: `${dataURL}/beneficiary/create`,
    getUpdateBeneficiaryURL: (id) => `${dataURL}/beneficiary/${id}/update`,
    sendOTP: `${dataURL}/common/send-otp`,
    resetPassword: `${baseUrl}/reset-password`,
    changePassword: `${baseUrl}/change-password`,
  },
  statusCodes: {
    successCode: "400200",
    validationError: "400300",
  },
};

export default variables;
