"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const qr_pay_1 = require("../models/qrcode/qr-pay");
router.post("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const content_qr_code = req.body.content;
      const qrPay = new qr_pay_1.QRPay(content_qr_code);
      if (qrPay.isValid) {
        return res.status(200).json({ success: true, data: qrPay });
      } else {
        return res
          .status(401)
          .json({ success: false, error: "QR Code Invalid" });
      }
    } catch (error) {
      return res.status(400).json({ success: false, error: "QR Code Invalid" });
    }
  })
);
module.exports = router;
