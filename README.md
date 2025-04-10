# Colors Common Services - Invoice Generator

## Overview
This is a custom invoice generator web application created specifically for Colors Common Services. The application allows you to create, preview, and print professional invoices quickly and easily.

## Features
- **Product Code Auto-completion**: Type product codes or select from dropdown to automatically fill price and description
- **Logo Upload**: Add your business logo to the invoice
- **Multi-Currency Support**: Choose between Rupee (₹), Dollar ($), Euro (€), Pound (£), and Yen (¥)
- **Discount Options**: Add percentage or fixed amount discounts
- **Banking Details**: Include bank account information for payments
- **Print Functionality**: Print professional-looking invoices
- **Amount in Words**: Automatically converts the total amount to words
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### Setup
1. Download the files (index.html, style.css, script.js)
2. Place them in a folder on your computer
3. Open index.html in a web browser (Chrome, Firefox, Edge, etc.)

### Creating an Invoice
1. **Fill in the form**:
   - Invoice details (number, date, due date)
   - Your company information (prefilled with Colors Common Services details)
   - Client information
   - Add invoice items:
     - Enter a product code or click in the field to see all available options
     - Product descriptions and prices will auto-fill
     - Adjust quantities as needed
   - Apply discounts if necessary
   - Add banking details (prefilled)
   - Include any additional notes

2. **Generate and Print**:
   - Click "Generate Invoice" to preview the invoice
   - Click "Print Invoice" to print or save as PDF

### Product Codes
The following product codes are available for quick entry:

| Code  | Description             | Price (₹) |
|-------|-------------------------|-----------|
| A001  | A4 Photocopy            | 2.50      |
| A002  | A4 Printout             | 7.00      |
| A003  | A4 Color Photo Copy     | 12.00     |
| A004  | A4 Color Printout       | 15.00     |
| A005  | A4 Double Side PhotoCopy| 5.00      |

## Customization

### Adding New Product Codes
To add new product codes, edit the `script.js` file. Find the `codeOptions` array at the beginning of the file and add new entries:

```javascript
const codeOptions = [
    { code: 'A001', description: 'A4 Photocopy', price: 2.50 },
    // Add new items below
    { code: 'A006', description: 'Your New Item', price: 10.00 },
];
```

### Changing Default Company Information
To change the default company information, find this section in `script.js` and modify the values:

```javascript
// Prefill sender details
document.getElementById('from-name').value = 'Colors Common Services';
document.getElementById('from-address').value = 'Main Road, Madukkur';
// etc.
```

## Technical Information
- Built with pure HTML, CSS, and JavaScript
- No server-side processing required
- Works offline, no internet connection needed after download
- Mobile-responsive design

## Contact
For support or customization, please contact:
- WhatsApp: +916380986703

---

*This invoice generator was custom-built for Colors Common Services by Muhammed.*
