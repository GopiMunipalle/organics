export type ADMIN = "ADMIN";
export type CUSTOMER = "CUSTOMER";
export type SELLER = "SELLER";

export type role = ADMIN | CUSTOMER | SELLER;

export type CASH_ON_DELIVERY = "cash on delivery";
export type UPI = "upi";
export type CARD = "card";

export type paymentType = CASH_ON_DELIVERY | UPI | CARD;

export type SUCCESS = "SUCCESS";
export type FAILED = "FAILED";
export type PENDING = "PENDING";
export type CREATED = "CREATED";

export type orderStatus = SUCCESS | FAILED | PENDING | CREATED;
