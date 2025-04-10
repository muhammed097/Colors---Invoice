// Part 1: Initialization and Product Database
document.addEventListener('DOMContentLoaded', function () {
    // Product code database with updated codes
    const productDatabase = {};

    // Add codes from the provided list
    const codeOptions = [
        { code: 'A001', description: 'A4 Photocopy', price: 2.50 },
        { code: 'A002', description: 'A4 Printout', price: 7 },
        { code: 'A003', description: 'A4 Color Photo Copy', price: 12 },
        { code: 'A004', description: 'A4 Color Printout', price: 15 },
        { code: 'A005', description: 'A4 Double Side PhotoCopy', price: 5 }
    ];

    // Convert the array to the product database format
    codeOptions.forEach(item => {
        productDatabase[item.code] = {
            description: item.description,
            price: item.price
        };
    });

    // Logo upload functionality
    const logoUpload = document.getElementById('logo-upload');
    const logoPreview = document.getElementById('logo-preview');
    const removeLogo = document.getElementById('remove-logo');
    let logoData = null;

    logoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (limit to 1MB)
            if (file.size > 1024 * 1024) {
                alert('File is too large. Maximum file size is 1MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                logoData = event.target.result;
                logoPreview.src = logoData;
                logoPreview.style.display = 'block';
                removeLogo.style.display = 'inline-block';
            };
            reader.readAsDataURL(file);
        }
    });

    removeLogo.addEventListener('click', function () {
        logoData = null;
        logoPreview.src = '';
        logoPreview.style.display = 'none';
        removeLogo.style.display = 'none';
        logoUpload.value = ''; // Reset the file input
    });

    // Currency settings
    const currencySelect = document.getElementById('currency-select');
    const currencySymbols = document.querySelectorAll('.currency-symbol');
    let selectedCurrency = currencySelect.value;
    let currencyName = 'Rupees';

    // Currency name mapping
    const currencyNames = {
        '₹': 'Rupees',
        '$': 'Dollars',
        '€': 'Euros',
        '£': 'Pounds',
        '¥': 'Yen'
    };

    // Update currency symbols when currency is changed
    currencySelect.addEventListener('change', function () {
        selectedCurrency = this.value;
        currencyName = currencyNames[selectedCurrency];

        // Update all currency symbols
        currencySymbols.forEach(symbol => {
            symbol.textContent = selectedCurrency;
        });

        // Update discount symbol if fixed amount is selected
        if (discountType.value === 'fixed') {
            discountSymbol.textContent = selectedCurrency;
        }

        // Update totals
        updateTotals();
    });

    // Set today's date as default for invoice date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;

    // Calculate due date (30 days from today) as default
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('due-date').value = dueDate.toISOString().split('T')[0];

    // Prefill sender details
    document.getElementById('from-name').value = 'Colours Common Services';
    document.getElementById('from-address').value = '331, Sameer Complex, Main Road , Madukkur';
    document.getElementById('from-phone').value = '+917530051393';
    document.getElementById('from-email').value = 'ccsmkr@gmail.com';
    document.getElementById('account-number').value = '510909010311328';
    document.getElementById('account-name').value = 'Colours Common Services';
    document.getElementById('bank-name').value = 'City Union Bank';
    document.getElementById('ifsc-code').value = 'CIUB0000291';
    document.getElementById('branch-details').value = 'Madukkur';
    document.getElementById('upi-id').value = 'ccsmkr-1@okaxis';

    // Part 2: Autocomplete functionality for product codes
    // Initialize autocomplete for all code inputs
    initializeCodeAutocomplete();
    
    // Set up global click event to close all suggestion boxes
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('item-code')) {
            document.querySelectorAll('.code-suggestions').forEach(box => {
                box.style.display = 'none';
            });
        }
    });
    
    // Function to initialize autocomplete for all code inputs
    function initializeCodeAutocomplete() {
        document.querySelectorAll('.item-code').forEach(input => {
            setupCodeInput(input);
        });
    }

    // Function to set up autocomplete for a single code input
    function setupCodeInput(input) {
        // Skip if already initialized
        if (input.dataset.initialized) return;
        
        const suggestionsBox = input.parentElement.querySelector('.code-suggestions');
        
        // Input event for filtering suggestions
        input.addEventListener('input', function() {
            const value = this.value.trim().toUpperCase();
            const suggestions = [];
            
            // Clear if empty
            if (!value) {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
                return;
            }
            
            // Find matching codes
            for (const code in productDatabase) {
                const description = productDatabase[code].description;
                
                // Match if code starts with the value or contains it
                if (code.startsWith(value) || 
                    code.includes(value) || 
                    description.toUpperCase().includes(value)) {
                    suggestions.push({ code, description });
                }
            }
            
            // Display suggestions
            if (suggestions.length > 0) {
                suggestionsBox.innerHTML = '';
                
                suggestions.forEach(suggestion => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `<strong>${suggestion.code}</strong> - ${suggestion.description}`;
                    
                    // Select this suggestion on click
                    div.addEventListener('click', function() {
                        input.value = suggestion.code;
                        suggestionsBox.style.display = 'none';
                        
                        // Fill in product details
                        if (productDatabase[suggestion.code]) {
                            const row = input.closest('tr');
                            row.querySelector('.item-description').value = productDatabase[suggestion.code].description;
                            row.querySelector('.item-price').value = productDatabase[suggestion.code].price;
                            updateTotals();
                        }
                    });
                    
                    suggestionsBox.appendChild(div);
                });
                
                suggestionsBox.style.display = 'block';
            } else {
                suggestionsBox.innerHTML = '';
                suggestionsBox.style.display = 'none';
            }
        });
        
        // Show all options when input is focused (clicked)
        input.addEventListener('focus', function() {
            // If the input is empty, show all options
            if (!this.value.trim()) {
                suggestionsBox.innerHTML = '';
                
                for (const code in productDatabase) {
                    const description = productDatabase[code].description;
                    
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `<strong>${code}</strong> - ${description}`;
                    
                    div.addEventListener('click', function() {
                        input.value = code;
                        suggestionsBox.style.display = 'none';
                        
                        // Fill in product details
                        const row = input.closest('tr');
                        row.querySelector('.item-description').value = productDatabase[code].description;
                        row.querySelector('.item-price').value = productDatabase[code].price;
                        updateTotals();
                    });
                    
                    suggestionsBox.appendChild(div);
                }
                
                suggestionsBox.style.display = 'block';
            }
        });

        // Handle keyboard navigation
        input.addEventListener('keydown', function(e) {
            const items = suggestionsBox.querySelectorAll('.suggestion-item');
            if (!items.length) return;
            
            const active = suggestionsBox.querySelector('.active');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                
                if (!active) {
                    items[0].classList.add('active');
                } else {
                    active.classList.remove('active');
                    const nextIndex = Array.from(items).indexOf(active) + 1;
                    
                    if (nextIndex < items.length) {
                        items[nextIndex].classList.add('active');
                        ensureVisible(items[nextIndex], suggestionsBox);
                    } else {
                        items[0].classList.add('active');
                        ensureVisible(items[0], suggestionsBox);
                    }
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                
                if (!active) {
                    items[items.length - 1].classList.add('active');
                } else {
                    active.classList.remove('active');
                    const prevIndex = Array.from(items).indexOf(active) - 1;
                    
                    if (prevIndex >= 0) {
                        items[prevIndex].classList.add('active');
                        ensureVisible(items[prevIndex], suggestionsBox);
                    } else {
                        items[items.length - 1].classList.add('active');
                        ensureVisible(items[items.length - 1], suggestionsBox);
                    }
                }
            } else if (e.key === 'Enter' && active) {
                e.preventDefault();
                active.click();
            } else if (e.key === 'Escape') {
                suggestionsBox.style.display = 'none';
            }
        });
        
        // Mark as initialized
        input.dataset.initialized = 'true';
    }

    // Ensure the selected item is visible in the scroll container
    function ensureVisible(element, container) {
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.clientHeight;

        if (elementTop < containerTop) {
            container.scrollTop = elementTop;
        } else if (elementBottom > containerBottom) {
            container.scrollTop = elementBottom - container.clientHeight;
        }
    }
    
    // Also add a direct input handler for when users manually type a code
    document.body.addEventListener('blur', function(e) {
        if (e.target && e.target.classList.contains('item-code')) {
            const code = e.target.value.trim().toUpperCase();
            const row = e.target.closest('tr');
            
            if (productDatabase[code]) {
                // Auto-fill description and price
                row.querySelector('.item-description').value = productDatabase[code].description;
                row.querySelector('.item-price').value = productDatabase[code].price;
                
                // Update the total for this row
                updateTotals();
            }
        }
    }, true);

    // Part 3: Discount and Items Management
    // Discount functionality
    const discountType = document.getElementById('discount-type');
    const discountValue = document.getElementById('discount-value');
    const discountValueContainer = document.querySelector('.discount-value-container');
    const discountAmountDisplay = document.getElementById('discount-amount-display');
    const discountAmount = document.getElementById('discount-amount');
    const discountSymbol = document.querySelector('.discount-symbol');

    // Initialize discount variables
    let currentDiscountType = 'none';
    let currentDiscountValue = 0;
    let currentDiscountAmount = 0;

    // Show/hide discount value input based on discount type
    discountType.addEventListener('change', function () {
        currentDiscountType = this.value;

        if (this.value === 'none') {
            discountValueContainer.style.display = 'none';
            discountAmountDisplay.style.display = 'none';
            currentDiscountValue = 0;
        } else {
            discountValueContainer.style.display = 'flex';
            discountAmountDisplay.style.display = 'block';

            // Update the symbol for the discount type
            if (this.value === 'percentage') {
                discountSymbol.textContent = '%';
            } else if (this.value === 'fixed') {
                discountSymbol.textContent = selectedCurrency;
            }
        }

        // Reset discount value when type changes
        discountValue.value = '';
        updateTotals();
    });

    // Update totals when discount value changes
    discountValue.addEventListener('input', function () {
        currentDiscountValue = parseFloat(this.value) || 0;
        updateTotals();
    });

    // Add event listeners for item rows
    document.getElementById('items-table').addEventListener('input', updateTotals);
    document.getElementById('items-table').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-remove')) {
            if (document.querySelectorAll('#item-rows tr').length > 1) {
                e.target.closest('tr').remove();
                updateRowNumbers();
                updateTotals();
            } else {
                alert('Cannot remove the last row. You need at least one item.');
            }
        }
    });

    // Add new item row
    document.getElementById('add-item').addEventListener('click', function () {
        const tableBody = document.getElementById('item-rows');
        const rowCount = tableBody.querySelectorAll('tr').length;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount + 1}</td>
            <td>
                <div class="code-input-container">
                    <input type="text" class="item-code" placeholder="Enter code" autocomplete="off">
                    <div class="code-suggestions"></div>
                </div>
            </td>
            <td><input type="text" class="item-description" placeholder="Item description"></td>
            <td><input type="number" class="item-quantity" value="1" min="1"></td>
            <td><input type="number" class="item-price" value="0" min="0" step="0.01"></td>
            <td class="item-total">0.00</td>
            <td><button class="btn btn-remove">×</button></td>
        `;

        tableBody.appendChild(newRow);
        
        // Initialize autocomplete for the new code input
        setupCodeInput(newRow.querySelector('.item-code'));
    });

    // Update row numbers after removal
    function updateRowNumbers() {
        const rows = document.querySelectorAll('#item-rows tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
    }

    // Part 4: Calculation and Validation
    // Update totals when item details change
    function updateTotals() {
        const rows = document.querySelectorAll('#item-rows tr');
        let subtotal = 0;

        rows.forEach(row => {
            const quantity = Math.max(parseFloat(row.querySelector('.item-quantity').value) || 0, 0);
            const price = Math.max(parseFloat(row.querySelector('.item-price').value) || 0, 0);

            const rowSubtotal = quantity * price;
            const total = rowSubtotal;
            row.querySelector('.item-total').textContent = total.toFixed(2);

            subtotal += rowSubtotal;
        });

        // Calculate discount
        currentDiscountAmount = 0;
        if (currentDiscountType === 'percentage' && currentDiscountValue > 0) {
            currentDiscountAmount = (subtotal * currentDiscountValue / 100);
        } else if (currentDiscountType === 'fixed' && currentDiscountValue > 0) {
            currentDiscountAmount = Math.min(currentDiscountValue, subtotal); // Can't discount more than subtotal
        }

        // Calculate grand total with discount
        const grandTotal = subtotal - currentDiscountAmount;

        // Display discount amount
        if (currentDiscountType !== 'none' && currentDiscountAmount > 0) {
            discountAmount.innerHTML = `<span class="currency-symbol">${selectedCurrency}</span>${currentDiscountAmount.toFixed(2)}`;
            discountAmountDisplay.style.display = 'block';
        } else {
            discountAmountDisplay.style.display = 'none';
        }

        // Add subtotal display if discount is applied
        if (currentDiscountAmount > 0) {
            if (!document.getElementById('subtotal-amount')) {
                const subtotalElement = document.createElement('div');
                subtotalElement.className = 'total-subtotal';
                subtotalElement.innerHTML = `<span class="total-label">Subtotal:</span>
                                            <span id="subtotal-amount" class="total-amount"><span class="currency-symbol">${selectedCurrency}</span>${subtotal.toFixed(2)}</span>`;
                document.querySelector('.total-section').insertBefore(subtotalElement, document.querySelector('.total-section').firstChild);
            } else {
                document.getElementById('subtotal-amount').innerHTML = `<span class="currency-symbol">${selectedCurrency}</span>${subtotal.toFixed(2)}`;
            }
        } else if (document.getElementById('subtotal-amount')) {
            document.querySelector('.total-subtotal').remove();
        }

        // Update grand total
        document.getElementById('total-amount').innerHTML = `<span class="currency-symbol">${selectedCurrency}</span>${grandTotal.toFixed(2)}`;
        document.getElementById('amount-in-words').textContent = currencyName + ' ' + numberToWords(grandTotal) + ' Only';
    }

    // Hide all error messages
    function hideAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.style.display = 'none';
        });

        // Reset border colors
        const inputElements = document.querySelectorAll('input, textarea');
        inputElements.forEach(el => {
            el.style.borderColor = '';
        });
    }

    // Show specific error
    function showError(id) {
        const element = document.getElementById(id);
        const errorElement = document.getElementById(id + '-error');
        if (element && errorElement) {
            element.style.borderColor = 'red';
            errorElement.style.display = 'block';
        }
    }

    // Helper function to format dates
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    // Convert number to words (for various currencies)
    function numberToWords(number) {
        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        function convertLessThanOneThousand(num) {
            if (num === 0) {
                return '';
            }

            if (num < 20) {
                return units[num];
            }

            if (num < 100) {
                return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
            }

            return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertLessThanOneThousand(num % 100) : '');
        }

        // Handle zero
        if (number === 0) {
            return 'Zero';
        }

        // Handle negative numbers
        const isNegative = number < 0;
        number = Math.abs(number);

        // Handle decimal
        const decimalPart = Math.round((number - Math.floor(number)) * 100);
        number = Math.floor(number);

        // Different naming systems based on currency
        const currencySystem = selectedCurrency === '₹' ? 'indian' : 'international';
        let result = '';

        if (currencySystem === 'indian') {
            // Indian numbering system (crore, lakh, thousand)
            if (number >= 10000000) { // Crore (10^7)
                result += convertLessThanOneThousand(Math.floor(number / 10000000)) + ' Crore ';
                number %= 10000000;
            }

            if (number >= 100000) { // Lakh (10^5)
                result += convertLessThanOneThousand(Math.floor(number / 100000)) + ' Lakh ';
                number %= 100000;
            }

            if (number >= 1000) { // Thousand
                result += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
                number %= 1000;
            }
        } else {
            // International numbering system (million, thousand)
            if (number >= 1000000) { // Million
                result += convertLessThanOneThousand(Math.floor(number / 1000000)) + ' Million ';
                number %= 1000000;
            }

            if (number >= 1000) { // Thousand
                result += convertLessThanOneThousand(Math.floor(number / 1000)) + ' Thousand ';
                number %= 1000;
            }
        }

        if (number > 0) {
            result += convertLessThanOneThousand(number);
        }

        // Add decimal part if exists
        if (decimalPart > 0) {
            const subunitName = {
                '₹': 'Paise',
                '$': 'Cents',
                '€': 'Cents',
                '£': 'Pence',
                '¥': 'Sen'
            }[selectedCurrency] || 'Cents';

            result += ' and ' + convertLessThanOneThousand(decimalPart) + ' ' + subunitName;
        }

        return (isNegative ? 'Negative ' : '') + result.trim();
    }

    // Part 5: Invoice Generation
    // Generate invoice
    document.getElementById('generate-invoice').addEventListener('click', function () {
        generateInvoice();
    });

    // Generate the invoice
    function generateInvoice() {
        // Hide all previous errors
        hideAllErrors();

        // Validate form fields
        let isValid = true;

        // Required fields validation
        const requiredFields = [
            'invoice-number', 'invoice-date', 'due-date',
            'from-name', 'to-name'
        ];

        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                showError(field);
                isValid = false;
            }
        });

        // Date validation
        const invoiceDate = new Date(document.getElementById('invoice-date').value);
        const dueDate = new Date(document.getElementById('due-date').value);

        if (dueDate < invoiceDate) {
            document.getElementById('due-date').style.borderColor = 'red';
            document.getElementById('due-date-error').textContent = 'Due date must be after invoice date';
            document.getElementById('due-date-error').style.display = 'block';
            isValid = false;
        }

        // Check if at least one item has description and price
        const items = document.querySelectorAll('#item-rows tr');
        let hasValidItem = false;

        items.forEach(item => {
            const description = item.querySelector('.item-description').value.trim();
            const price = parseFloat(item.querySelector('.item-price').value) || 0;

            if (description && price > 0) {
                hasValidItem = true;
            }
        });

        if (!hasValidItem) {
            document.getElementById('items-error').style.display = 'block';
            isValid = false;
        }

        if (!isValid) {
            alert('Please fix the highlighted errors before generating the invoice.');
            return;
        }

        // Get form values
        const invoiceNumber = document.getElementById('invoice-number').value;
        const invoiceDateValue = document.getElementById('invoice-date').value;
        const dueDateValue = document.getElementById('due-date').value;

        const fromName = document.getElementById('from-name').value;
        const fromAddress = document.getElementById('from-address').value;
        const fromPhone = document.getElementById('from-phone').value;
        const fromEmail = document.getElementById('from-email').value;

        const toName = document.getElementById('to-name').value;
        const toAddress = document.getElementById('to-address').value;
        const toPhone = document.getElementById('to-phone').value;
        const toEmail = document.getElementById('to-email').value;

        const fromGst = document.getElementById('from-gst').value;
        const toGst = document.getElementById('to-gst').value;

        const notes = document.getElementById('notes').value;

        // Format dates
        const formattedInvoiceDate = formatDate(invoiceDateValue);
        const formattedDueDate = formatDate(dueDateValue);

        // Generate item rows HTML
        let itemsHTML = '';
        let subtotal = 0;

        items.forEach((item, index) => {
            const code = item.querySelector('.item-code').value;
            const description = item.querySelector('.item-description').value;
            const quantity = Math.max(parseFloat(item.querySelector('.item-quantity').value) || 0, 0);
            const price = Math.max(parseFloat(item.querySelector('.item-price').value) || 0, 0);

            const rowSubtotal = quantity * price;
            const total = rowSubtotal;

            subtotal += rowSubtotal;

            // Format numbers with commas for better readability
            const formattedPrice = price.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            const formattedTotal = total.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            itemsHTML += `
                <tr>
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${code}</td>
                    <td>${description}</td>
                    <td style="text-align: right;">${quantity}</td>
                    <td style="text-align: right;">${selectedCurrency}${formattedPrice}</td>
                    <td style="text-align: right;">${selectedCurrency}${formattedTotal}</td>
                </tr>
            `;
        });

        // Apply discount if applicable
        let discountInfo = '';
        let grandTotal = subtotal;

        if (currentDiscountType !== 'none' && currentDiscountAmount > 0) {
            const discountTypeLabel = currentDiscountType === 'percentage'
                ? `${currentDiscountValue}%`
                : `${selectedCurrency}${currentDiscountValue.toFixed(2)}`;

            const formattedSubtotal = subtotal.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            const formattedDiscountAmount = currentDiscountAmount.toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });

            discountInfo = `
                <p class="invoice-total-row">Subtotal: ${selectedCurrency}${formattedSubtotal}</p>
                <p class="invoice-total-row" style="color: #e63946;">Discount (${discountTypeLabel}): - ${selectedCurrency}${formattedDiscountAmount}</p>
            `;

            // Adjust grand total with discount
            grandTotal = subtotal - currentDiscountAmount;
        }

        // Format the grand total with commas
        const formattedGrandTotal = grandTotal.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });

        // Get banking details
        const bankName = document.getElementById('bank-name').value;
        const accountName = document.getElementById('account-name').value;
        const accountNumber = document.getElementById('account-number').value;
        const ifscCode = document.getElementById('ifsc-code').value;
        const branchDetails = document.getElementById('branch-details').value;
        const upiId = document.getElementById('upi-id').value;

        // Generate table headers
        let tableHeaders = `
            <thead>
                <tr>
                    <th style="width:6%; text-align:center;">SI No</th>
                    <th style="width:10%; text-align:center;">Code</th>
                    <th style="width:35%; text-align:center;">Description</th>
                    <th style="width:10%; text-align:center;">Quantity</th>
                    <th style="width:15%; text-align:center;">Price</th>
                    <th style="width:15%; text-align:center;">Amount</th>
                </tr>
            </thead>
        `;

        // Generate the invoice total section
        let invoiceTotalHTML = `
            <div class="invoice-total">
                ${discountInfo}
                <p class="invoice-total-row" style="font-size: 20px; color: var(--primary-color);">Grand Total: ${selectedCurrency}${formattedGrandTotal}</p>
                <p><em>${currencyName} ${numberToWords(grandTotal)} Only</em></p>
            </div>
        `;

        // Generate the invoice HTML with improved print layout and repositioned elements
        const invoiceHTML = `
            ${logoData ? `
                <div style="text-align: left; margin-bottom: 20px;">
                    <img src="${logoData}" alt="Company Logo" style="max-height: 80px; max-width: 200px;">
                </div>
            ` : ''}
            
            <div class="invoice-header">
                <div style="flex: 1;">
                    <h1 class="invoice-title">INVOICE</h1>
                </div>
                <div style="flex: 1; text-align: right;">
                    <p class="invoice-number">#${invoiceNumber}</p>
                    <p>Issue Date: ${formattedInvoiceDate}</p>
                    <p>Due Date: ${formattedDueDate}</p>
                </div>
            </div>
            
           <div class="from-to-container">
                <div class="address-block">
                    <h3 class="address-heading">From:</h3>
                    <p><strong>${fromName}</strong></p>
                    <p>${fromAddress.replace(/\n/g, '<br>')}</p>
                    ${fromPhone ? `<p>Phone: ${fromPhone}</p>` : ''}
                    ${fromEmail ? `<p>Email: ${fromEmail}</p>` : ''}
                    ${fromGst ? `<p>GST: ${fromGst}</p>` : ''}
                </div>
                
                <div class="address-block">
                    <h3 class="address-heading">To:</h3>
                    <p><strong>${toName}</strong></p>
                    <p>${toAddress.replace(/\n/g, '<br>')}</p>
                    ${toPhone ? `<p>Phone: ${toPhone}</p>` : ''}
                    ${toEmail ? `<p>Email: ${toEmail}</p>` : ''}
                    ${toGst ? `<p>GST: ${toGst}</p>` : ''}
                </div>
            </div>

            <table class="invoice-items" style="width:100%; table-layout:fixed; border-collapse:collapse;">
                ${tableHeaders}
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            ${invoiceTotalHTML}
            
            <div class="banking-details" style="margin-top: 30px; border-top: 1px solid #dee2e6; padding-top: 20px;">
                <h3 style="color: #4361ee; margin-bottom: 10px;">Banking Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">Bank Name:</td>
                        <td style="padding: 5px 0;">${bankName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">Account Holder:</td>
                        <td style="padding: 5px 0;">${accountName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">Account Number:</td>
                        <td style="padding: 5px 0;">${accountNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">IFSC Code:</td>
                        <td style="padding: 5px 0;">${ifscCode || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">Branch:</td>
                        <td style="padding: 5px 0;">${branchDetails || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 10px 5px 0; font-weight: 600;">UPI ID:</td>
                        <td style="padding: 5px 0;">${upiId || 'N/A'}</td>
                    </tr>
                </table>
            </div>
            
            ${notes ? `
            <div style="margin-top: 20px;">
                <h3 style="color: #4361ee; margin-bottom: 10px;">Notes:</h3>
                <p>${notes.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}`;

        // Update the invoice output div and show it
        document.getElementById('invoice-output').innerHTML = invoiceHTML;
        document.getElementById('invoice-output').style.display = 'block';

        // Scroll to the invoice
        document.getElementById('invoice-output').scrollIntoView({ behavior: 'smooth' });
    }

    // Part 6: Printing and Popup
    // Print invoice with improved print handling
    document.getElementById('print-invoice').addEventListener('click', function () {
        if (document.getElementById('invoice-output').style.display === 'none') {
            alert('Please generate the invoice first.');
            return;
        }

        // Add print-specific styles
        const printStyle = document.createElement('style');
        printStyle.id = 'print-styles';
        printStyle.textContent = `
            @media print {
                body, html {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    box-shadow: none;
                    max-width: 100%;
                    margin: 0;
                    padding: 0;
                }
                .form-container, header, .invoice-actions, .footer, .popup-overlay {
                    display: none !important;
                }
                .invoice-output {
                    margin: 0;
                    padding: 20px;
                    box-shadow: none;
                    border: none;
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(printStyle);

        printStyle.textContent += `
        .invoice-items {
            width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            white-space: normal !important;
            overflow-x: visible !important;
            display: table !important;
        }
        .invoice-items:before {
            display: none !important;
        }
        .invoice-items th, .invoice-items td {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            padding: 8px 4px !important;
            vertical-align: top !important;
            font-size: 11pt !important;
        }

        /* Define explicit column widths for print */
        .invoice-items th:nth-child(1), .invoice-items td:nth-child(1) { width: 6% !important; text-align: center !important; }
        .invoice-items th:nth-child(2), .invoice-items td:nth-child(2) { width: 10% !important; text-align: center !important; }
        .invoice-items th:nth-child(3), .invoice-items td:nth-child(3) { width: 35% !important; text-align: left !important; }
        .invoice-items th:nth-child(4), .invoice-items td:nth-child(4) { width: 10% !important; text-align: right !important; }
        .invoice-items th:nth-child(5), .invoice-items td:nth-child(5) { width: 15% !important; text-align: right !important; }
        .invoice-items th:nth-child(6), .invoice-items td:nth-child(6) { width: 15% !important; text-align: right !important; }

        /* Ensure page breaks don't occur at bad places */
        .invoice-total, .from-to-container, .banking-details {
            page-break-inside: avoid !important;
        }
        `;

        // Execute print
        window.print();

        // Clean up after printing
        setTimeout(function () {
            document.head.removeChild(printStyle);
        }, 1000);
    });

    // Show a temporary message to the user
    function showMessage(message) {
        // Create message element if it doesn't exist
        if (!document.getElementById('message-container')) {
            const messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #4361ee;
                color: white;
                padding: 12px 24px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                display: none;
                font-weight: 600;
                font-size: 16px;
            `;
            document.body.appendChild(messageContainer);
        }

        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';

        // Hide message after a few seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
}); 
