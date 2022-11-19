"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRPay = void 0;
const constants_1 = require("../../constants");
const crc16_1 = require("./crc16");
class QRPay {
  constructor(content) {
    this.isValid = true;
    console.log("content: ", content);
    this.provider = new constants_1.Prodiver();
    this.consumer = new constants_1.Consumer();
    this.merchant = new constants_1.Merchant();
    this.additionalData = new constants_1.AdditionalData();
    this.parse(content !== null && content !== void 0 ? content : "");
  }
  parse(content) {
    if (content.length < 4) return this.invalid();
    // verify CRC
    const crcValid = QRPay.verifyCRC(content);
    console.log("crcValid: ", crcValid);
    if (!crcValid) return this.invalid();
    // parse content
    this.parseRootContent(content);
  }
  build() {
    var _a;
    const version = QRPay.genFieldData(
      constants_1.FieldID.VERSION,
      this.version
    );
    const initMethod = QRPay.genFieldData(
      constants_1.FieldID.INIT_METHOD,
      this.initMethod
    );
    const guid = QRPay.genFieldData(
      constants_1.ProviderFieldID.GUID,
      this.provider.guid
    );
    let providerDataContent = "";
    if (this.provider.guid === constants_1.QRProviderGUID.VIETQR) {
      const bankBin = QRPay.genFieldData(
        constants_1.VietQRConsumerFieldID.BANK_BIN,
        this.consumer.bankBin
      );
      const bankNumber = QRPay.genFieldData(
        constants_1.VietQRConsumerFieldID.BANK_NUMBER,
        this.consumer.bankNumber
      );
      providerDataContent = bankBin + bankNumber;
    } else if (this.provider.guid === constants_1.QRProviderGUID.VNPAY) {
      providerDataContent =
        (_a = this.merchant.merchantId) !== null && _a !== void 0 ? _a : "";
    }
    const provider = QRPay.genFieldData(
      constants_1.ProviderFieldID.DATA,
      providerDataContent
    );
    const service = QRPay.genFieldData(
      constants_1.ProviderFieldID.SERVICE,
      this.provider.service
    );
    const providerData = QRPay.genFieldData(
      this.provider.fieldId,
      guid + provider + service
    );
    const category = QRPay.genFieldData(
      constants_1.FieldID.CATEGORY,
      this.category
    );
    const currency = QRPay.genFieldData(
      constants_1.FieldID.CURRENCY,
      this.currency
    );
    const amountStr = QRPay.genFieldData(
      constants_1.FieldID.AMOUNT,
      this.amount
    );
    const tipAndFeeType = QRPay.genFieldData(
      constants_1.FieldID.TIP_AND_FEE_TYPE,
      this.tipAndFeeType
    );
    const tipAndFeeAmount = QRPay.genFieldData(
      constants_1.FieldID.TIP_AND_FEE_AMOUNT,
      this.tipAndFeeAmount
    );
    const tipAndFeePercent = QRPay.genFieldData(
      constants_1.FieldID.TIP_AND_FEE_PERCENT,
      this.tipAndFeePercent
    );
    const nation = QRPay.genFieldData(constants_1.FieldID.NATION, this.nation);
    const acquier = QRPay.genFieldData(
      constants_1.FieldID.ACQUIER,
      this.acquier
    );
    const city = QRPay.genFieldData(constants_1.FieldID.CITY, this.city);
    const zipCode = QRPay.genFieldData(
      constants_1.FieldID.ZIP_CODE,
      this.zipCode
    );
    const buildNumber = QRPay.genFieldData(
      constants_1.AdditionalDataID.BILL_NUMBER,
      this.additionalData.billNumber
    );
    const mobileNumber = QRPay.genFieldData(
      constants_1.AdditionalDataID.MOBILE_NUMBER,
      this.additionalData.mobileNumber
    );
    const storeLabel = QRPay.genFieldData(
      constants_1.AdditionalDataID.STORE_LABEL,
      this.additionalData.store
    );
    const loyaltyNumber = QRPay.genFieldData(
      constants_1.AdditionalDataID.LOYALTY_NUMBER,
      this.additionalData.loyaltyNumber
    );
    const reference = QRPay.genFieldData(
      constants_1.AdditionalDataID.REFERENCE_LABEL,
      this.additionalData.reference
    );
    const customerLabel = QRPay.genFieldData(
      constants_1.AdditionalDataID.CUSTOMER_LABEL,
      this.additionalData.customerLabel
    );
    const terminal = QRPay.genFieldData(
      constants_1.AdditionalDataID.TERMINAL_LABEL,
      this.additionalData.terminal
    );
    const purpose = QRPay.genFieldData(
      constants_1.AdditionalDataID.PURPOSE_OF_TRANSACTION,
      this.additionalData.purpose
    );
    const dataRequest = QRPay.genFieldData(
      constants_1.AdditionalDataID.ADDITIONAL_CONSUMER_DATA_REQUEST,
      this.additionalData.dataRequest
    );
    const additionalDataContent =
      buildNumber +
      mobileNumber +
      storeLabel +
      loyaltyNumber +
      reference +
      customerLabel +
      terminal +
      purpose +
      dataRequest;
    const additionalData = QRPay.genFieldData(
      constants_1.FieldID.ADDITIONAL_DATA,
      additionalDataContent
    );
    const content = `${version}${initMethod}${providerData}${category}${currency}${amountStr}${tipAndFeeType}${tipAndFeeAmount}${tipAndFeePercent}${nation}${acquier}${city}${zipCode}${additionalData}${constants_1.FieldID.CRC}04`;
    const crc = QRPay.genCRCCode(content);
    return content + crc;
  }
  parseRootContent(content) {
    console.log("parseRootContent content: ", content);
    const { id, length, value, nextValue } = QRPay.sliceContent(content);
    console.log("value.length: ", value.length);
    console.log("value.length !== length: ", value.length !== length);
    if (value.length !== length) return this.invalid();
    switch (id) {
      case constants_1.FieldID.VERSION:
        this.version = value;
        break;
      case constants_1.FieldID.INIT_METHOD:
        this.initMethod = value;
        break;
      case constants_1.FieldID.VIETQR:
      case constants_1.FieldID.VNPAYQR:
        this.provider.fieldId = id;
        this.parseProviderInfo(value);
        break;
      case constants_1.FieldID.CATEGORY:
        this.category = value;
        break;
      case constants_1.FieldID.CURRENCY:
        this.currency = value;
        break;
      case constants_1.FieldID.AMOUNT:
        this.amount = value;
        break;
      case constants_1.FieldID.TIP_AND_FEE_TYPE:
        this.tipAndFeeType = value;
        break;
      case constants_1.FieldID.TIP_AND_FEE_AMOUNT:
        this.tipAndFeeAmount = value;
        break;
      case constants_1.FieldID.TIP_AND_FEE_PERCENT:
        this.tipAndFeePercent = value;
        break;
      case constants_1.FieldID.NATION:
        this.nation = value;
        break;
      case constants_1.FieldID.ACQUIER:
        this.acquier = value;
        break;
      case constants_1.FieldID.CITY:
        this.city = value;
        break;
      case constants_1.FieldID.ZIP_CODE:
        this.zipCode = value;
        break;
      case constants_1.FieldID.ADDITIONAL_DATA:
        this.parseAdditionalData(value);
        break;
      case constants_1.FieldID.CRC:
        this.crc = value;
        break;
      default:
        break;
    }
    if (nextValue.length > 4) this.parseRootContent(nextValue);
  }
  parseProviderInfo(content) {
    const { id, value, nextValue } = QRPay.sliceContent(content);
    switch (id) {
      case constants_1.ProviderFieldID.GUID:
        this.provider.guid = value;
        break;
      case constants_1.ProviderFieldID.DATA:
        if (this.provider.guid === constants_1.QRProviderGUID.VNPAY) {
          this.provider.name = constants_1.QRProvider.VNPAY;
          this.merchant.merchantId = value;
        } else if (this.provider.guid === constants_1.QRProviderGUID.VIETQR) {
          this.provider.name = constants_1.QRProvider.VIETQR;
          this.parseVietQRConsumer(value);
        }
        break;
      case constants_1.ProviderFieldID.SERVICE:
        this.provider.service = value;
        break;
      default:
        break;
    }
    if (nextValue.length > 4) this.parseProviderInfo(nextValue);
  }
  parseVietQRConsumer(content) {
    const { id, value, nextValue } = QRPay.sliceContent(content);
    switch (id) {
      case constants_1.VietQRConsumerFieldID.BANK_BIN:
        this.consumer.bankBin = value;
        break;
      case constants_1.VietQRConsumerFieldID.BANK_NUMBER:
        this.consumer.bankNumber = value;
        break;
      default:
        break;
    }
    if (nextValue.length > 4) this.parseVietQRConsumer(nextValue);
  }
  parseAdditionalData(content) {
    const { id, value, nextValue } = QRPay.sliceContent(content);
    switch (id) {
      case constants_1.AdditionalDataID.PURPOSE_OF_TRANSACTION:
        this.additionalData.purpose = value;
        break;
      case constants_1.AdditionalDataID.BILL_NUMBER:
        this.additionalData.billNumber = value;
        break;
      case constants_1.AdditionalDataID.MOBILE_NUMBER:
        this.additionalData.mobileNumber = value;
        break;
      case constants_1.AdditionalDataID.REFERENCE_LABEL:
        this.additionalData.reference = value;
        break;
      case constants_1.AdditionalDataID.STORE_LABEL:
        this.additionalData.store = value;
        break;
      case constants_1.AdditionalDataID.TERMINAL_LABEL:
        this.additionalData.terminal = value;
        break;
      default:
        break;
    }
    if (nextValue.length > 4) this.parseAdditionalData(nextValue);
  }
  static verifyCRC(content) {
    console.log("verifyCRC content: ", content);
    const checkContent = content.slice(0, -4);
    console.log("checkContent: ", checkContent);
    const crcCode = content.slice(-4).toUpperCase();
    console.log("crcCode: ", crcCode);
    const genCrcCode = QRPay.genCRCCode(checkContent);
    console.log("genCrcCode: ", genCrcCode);
    return crcCode === genCrcCode;
  }
  static genCRCCode(content) {
    const crcCode = (0, crc16_1.crc16ccitt)(content).toString(16).toUpperCase();
    console.log("genCRCCode crcCode: ", crcCode);
    return `0000${crcCode}`.slice(-4);
  }
  static sliceContent(content) {
    const id = content.slice(0, 2);
    const length = Number(content.slice(2, 4));
    const value = content.slice(4, 4 + length);
    const nextValue = content.slice(4 + length);
    console.log("sliceContent id: ", id);
    console.log("sliceContent length: ", length);
    console.log("sliceContent value: ", value);
    console.log("sliceContent nextValue: ", nextValue);
    return { id, length, value, nextValue };
  }
  invalid() {
    this.isValid = false;
  }
  static genFieldData(id, value) {
    const fieldId = id !== null && id !== void 0 ? id : "";
    const fieldValue = value !== null && value !== void 0 ? value : "";
    const idLen = fieldId.length;
    if (idLen !== 2 || fieldValue.length <= 0) return "";
    const length = `00${fieldValue.length}`.slice(-2);
    return `${fieldId}${length}${fieldValue}`;
  }
}
exports.QRPay = QRPay;
