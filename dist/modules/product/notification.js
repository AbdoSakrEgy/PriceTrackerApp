"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailBody = exports.NOTIFICATION_TYPE = void 0;
var NOTIFICATION_TYPE;
(function (NOTIFICATION_TYPE) {
    NOTIFICATION_TYPE["WELCOME"] = "WELCOME";
    NOTIFICATION_TYPE["CHANGE_OF_STOCK"] = "CHANGE_OF_STOCK";
    NOTIFICATION_TYPE["LOWEST_PRICE"] = "LOWEST_PRICE";
    NOTIFICATION_TYPE["THRESHOLD_MET"] = "THRESHOLD_MET";
})(NOTIFICATION_TYPE || (exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE = {}));
const generateEmailBody = (product, type) => {
    const shortenedTitle = product.title.length > 20
        ? `${product.title.substring(0, 20)}...`
        : product.title;
    let subject = "";
    let body = "";
    switch (type) {
        case NOTIFICATION_TYPE.WELCOME:
            subject = `Welcome to Price Tracking for ${shortenedTitle}`;
            body = `
        <div>
          <h2>Welcome to PriceWise  seguimiento de precios!</h2>
          <p>You are now tracking ${product.title}.</p>
          <p>Here's an example of how you'll receive updates:</p>
          <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
            <h3>${product.title} is back in stock!</h3>
            <p>We're excited to let you know that the product you're tracking is now back in stock.</p>
            <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
            <img src="${product.image}" alt="Product Image" style="max-width: 100%;" />
          </div>
          <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
        </div>
      `;
            break;
        case NOTIFICATION_TYPE.CHANGE_OF_STOCK:
            subject = `${shortenedTitle} is now back in stock!`;
            body = `
        <div>
          <h4>Hey, ${product.title} is now restocked!</h4>
          <p>The product you're tracking is now back in stock. Don't miss out:</p>
          <p><a href="${product.url}" target="_blank" rel="noopener noreferrer">Visit Product Page</a></p>
        </div>
      `;
            break;
        // We can add more cases here for other notification types like LOWEST_PRICE
        default:
            throw new Error("Invalid notification type.");
    }
    return { subject, body };
};
exports.generateEmailBody = generateEmailBody;
