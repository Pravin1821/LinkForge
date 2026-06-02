const QRCode = require("qrcode");
const generateQRCode = async (url) => {
    try {
        const qrCode = await QRCode.toDataURL(url);
        return qrCode;
    }
    catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
};
module.exports = generateQRCode;
