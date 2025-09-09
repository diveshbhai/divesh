let selectedFields = {};
let invoiceData = {};
let itemCounter = 1;
let customFields = [];
let customFieldCounter = 1;

function addCustomField() {
    const fieldName = document.getElementById('customFieldName').value.trim();
    const fieldType = document.getElementById('customFieldType').value;
    
    if (!fieldName) {
        alert('Please enter a field name');
        return;
    }
    
    const fieldId = `custom_${customFieldCounter++}`;
    const customField = {
        id: fieldId,
        name: fieldName,
        type: fieldType
    };
    
    customFields.push(customField);
    
    const customFieldsGrid = document.getElementById('customFieldsGrid');
    const fieldCard = document.createElement('div');
    fieldCard.className = 'custom-field-item';
    fieldCard.innerHTML = `
        <label class="field-card">
            <input type="checkbox" id="${fieldId}" checked>
            <span class="checkmark"></span>
            <div class="field-info">
                <i class="fas fa-cog"></i>${fieldName}
            </div>
            <button type="button" class="remove-custom-field" onclick="removeCustomField('${fieldId}')">
                <i class="fas fa-times"></i>
            </button>
        </label>
    `;
    
    customFieldsGrid.appendChild(fieldCard);
    
    document.getElementById('customFieldName').value = '';
    document.getElementById('customFieldType').value = 'text';
}

function removeCustomField(fieldId) {
    customFields = customFields.filter(field => field.id !== fieldId);
    const fieldElement = document.getElementById(fieldId).closest('.custom-field-item');
    fieldElement.remove();
}

function updateProgressBar(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

function generateForm() {
    updateProgressBar(2);
    // Get selected fields
    selectedFields = {};
    const checkboxes = document.querySelectorAll('#fieldSelection input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        selectedFields[checkbox.id] = checkbox.checked;
    });

    // Generate dynamic form
    const formContainer = document.getElementById('dynamicForm');
    formContainer.innerHTML = '';

    let formHTML = '';

    // Company Information Section
    if (selectedFields.companyName || selectedFields.companyAddress || selectedFields.companyPhone || selectedFields.companyEmail || selectedFields.logo) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-building"></i> Company Information</h3>';
        
        if (selectedFields.logo) {
            formHTML += `
                <div class="form-group">
                    <label for="logoFile">Company Logo</label>
                    <input type="file" id="logoFile" accept="image/*" onchange="previewLogo(this)">
                    <div id="logoPreview"></div>
                </div>
            `;
        }
        
        if (selectedFields.companyName) {
            formHTML += `
                <div class="form-group">
                    <label for="companyNameInput">Company Name *</label>
                    <input type="text" id="companyNameInput" required>
                </div>
            `;
        }
        
        if (selectedFields.companyAddress) {
            formHTML += `
                <div class="form-group">
                    <label for="companyAddressInput">Company Address</label>
                    <textarea id="companyAddressInput" rows="3"></textarea>
                </div>
            `;
        }
        
        if (selectedFields.companyPhone || selectedFields.companyEmail) {
            formHTML += '<div class="form-row">';
            if (selectedFields.companyPhone) {
                formHTML += `
                    <div class="form-group">
                        <label for="companyPhoneInput">Company Phone</label>
                        <input type="tel" id="companyPhoneInput">
                    </div>
                `;
            }
            if (selectedFields.companyEmail) {
                formHTML += `
                    <div class="form-group">
                        <label for="companyEmailInput">Company Email</label>
                        <input type="email" id="companyEmailInput">
                    </div>
                `;
            }
            formHTML += '</div>';
        }
        formHTML += '</div>';
    }

    // Invoice Details Section
    if (selectedFields.invoiceNumber || selectedFields.invoiceDate || selectedFields.dueDate) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-file-alt"></i> Invoice Details</h3>';
        formHTML += '<div class="form-row">';
        
        if (selectedFields.invoiceNumber) {
            formHTML += `
                <div class="form-group">
                    <label for="invoiceNumberInput">Invoice Number *</label>
                    <input type="text" id="invoiceNumberInput" value="INV-${Date.now()}" required>
                </div>
            `;
        }
        
        if (selectedFields.invoiceDate) {
            formHTML += `
                <div class="form-group">
                    <label for="invoiceDateInput">Invoice Date *</label>
                    <input type="date" id="invoiceDateInput" value="${new Date().toISOString().split('T')[0]}" required>
                </div>
            `;
        }
        
        if (selectedFields.dueDate) {
            formHTML += `
                <div class="form-group">
                    <label for="dueDateInput">Due Date</label>
                    <input type="date" id="dueDateInput">
                </div>
            `;
        }
        
        formHTML += '</div>';
        formHTML += '</div>';
    }

    // Client Information Section
    if (selectedFields.clientName || selectedFields.clientAddress || selectedFields.clientPhone || selectedFields.clientEmail) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-user"></i> Client Information</h3>';
        
        if (selectedFields.clientName) {
            formHTML += `
                <div class="form-group">
                    <label for="clientNameInput">Client Name *</label>
                    <input type="text" id="clientNameInput" required>
                </div>
            `;
        }
        
        if (selectedFields.clientAddress) {
            formHTML += `
                <div class="form-group">
                    <label for="clientAddressInput">Client Address</label>
                    <textarea id="clientAddressInput" rows="3"></textarea>
                </div>
            `;
        }
        
        if (selectedFields.clientPhone || selectedFields.clientEmail) {
            formHTML += '<div class="form-row">';
            if (selectedFields.clientPhone) {
                formHTML += `
                    <div class="form-group">
                        <label for="clientPhoneInput">Client Phone</label>
                        <input type="tel" id="clientPhoneInput">
                    </div>
                `;
            }
            if (selectedFields.clientEmail) {
                formHTML += `
                    <div class="form-group">
                        <label for="clientEmailInput">Client Email</label>
                        <input type="email" id="clientEmailInput">
                    </div>
                `;
            }
            formHTML += '</div>';
        }
        formHTML += '</div>';
    }

    // Items Section
    if (selectedFields.items) {
        formHTML += `
            <div class="items-section">
                <h3><i class="fas fa-shopping-cart"></i> Items/Services</h3>
                <div id="itemsContainer">
                    <div class="item-row">
                        <div class="form-group">
                            <label>Description</label>
                            <input type="text" class="item-description" placeholder="Item description">
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" class="item-quantity" value="1" min="1" onchange="calculateItemTotal(this)">
                        </div>
                        <div class="form-group">
                            <label>Rate</label>
                            <input type="number" class="item-rate" step="0.01" min="0" onchange="calculateItemTotal(this)">
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" class="item-amount" step="0.01" readonly>
                        </div>
                        <div>
                            <button type="button" class="remove-btn" onclick="removeItem(this)" style="margin-top: 25px;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                <button type="button" onclick="addItem()" class="add-item-btn"><i class="fas fa-plus"></i> Add Item</button>
            </div>
        `;
    }

    // Tax and Discount Section
    if (selectedFields.tax || selectedFields.discount) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-calculator"></i> Calculations</h3><div class="form-row">';
        if (selectedFields.tax) {
            formHTML += `
                <div class="form-group">
                    <label for="taxInput">Tax (%)</label>
                    <input type="number" id="taxInput" step="0.01" min="0" value="0">
                </div>
            `;
        }
        if (selectedFields.discount) {
            formHTML += `
                <div class="form-group">
                    <label for="discountInput">Discount (%)</label>
                    <input type="number" id="discountInput" step="0.01" min="0" value="0">
                </div>
            `;
        }
        formHTML += '</div></div>';
    }

    // Additional Information Section
    if (selectedFields.notes || selectedFields.terms || selectedFields.bankDetails) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-info-circle"></i> Additional Information</h3>';
        if (selectedFields.notes) {
            formHTML += `
                <div class="form-group">
                    <label for="notesInput">Notes</label>
                    <textarea id="notesInput" rows="3" placeholder="Additional notes or comments"></textarea>
                </div>
            `;
        }
        
        if (selectedFields.terms) {
            formHTML += `
                <div class="form-group">
                    <label for="termsInput">Terms & Conditions</label>
                    <textarea id="termsInput" rows="3" placeholder="Payment terms and conditions"></textarea>
                </div>
            `;
        }
        
        if (selectedFields.bankDetails) {
            formHTML += `
                <div class="form-group">
                    <label for="bankDetailsInput">Bank Details</label>
                    <textarea id="bankDetailsInput" rows="3" placeholder="Bank account details for payment"></textarea>
                </div>
            `;
        }
        formHTML += '</div>';
    }

    // Custom Fields Section
    const selectedCustomFields = customFields.filter(field => selectedFields[field.id]);
    if (selectedCustomFields.length > 0) {
        formHTML += '<div class="form-section"><h3><i class="fas fa-plus-circle"></i> Custom Fields</h3>';
        selectedCustomFields.forEach(field => {
            const inputType = field.type === 'textarea' ? 'textarea' : 'input';
            const inputAttributes = field.type === 'textarea' ? 'rows="3"' : `type="${field.type}"`;
            
            formHTML += `
                <div class="form-group">
                    <label for="${field.id}Input">${field.name}</label>
                    <${inputType} id="${field.id}Input" ${inputAttributes} placeholder="Enter ${field.name.toLowerCase()}"></${inputType}>
                </div>
            `;
        });
        formHTML += '</div>';
    }

    formContainer.innerHTML = formHTML;

    // Show form step
    document.getElementById('fieldSelection').classList.add('hidden');
    document.getElementById('invoiceForm').classList.remove('hidden');
}

function previewLogo(input) {
    const preview = document.getElementById('logoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="logo-preview" alt="Logo Preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addItem() {
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.innerHTML = `
        <div class="form-group">
            <input type="text" class="item-description" placeholder="Item description">
        </div>
        <div class="form-group">
            <input type="number" class="item-quantity" value="1" min="1" onchange="calculateItemTotal(this)">
        </div>
        <div class="form-group">
            <input type="number" class="item-rate" step="0.01" min="0" onchange="calculateItemTotal(this)">
        </div>
        <div class="form-group">
            <input type="number" class="item-amount" step="0.01" readonly>
        </div>
        <div>
            <button type="button" class="remove-btn" onclick="removeItem(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    container.appendChild(newItem);
}

function removeItem(button) {
    const itemRow = button.closest('.item-row');
    if (document.querySelectorAll('.item-row').length > 1) {
        itemRow.remove();
    }
}

function calculateItemTotal(input) {
    const row = input.closest('.item-row');
    const quantity = row.querySelector('.item-quantity').value || 0;
    const rate = row.querySelector('.item-rate').value || 0;
    const amount = quantity * rate;
    row.querySelector('.item-amount').value = amount.toFixed(2);
}

function generateInvoice() {
    updateProgressBar(3);
    // Collect form data
    invoiceData = {};

    // Company info
    if (selectedFields.companyName) invoiceData.companyName = document.getElementById('companyNameInput').value;
    if (selectedFields.companyAddress) invoiceData.companyAddress = document.getElementById('companyAddressInput').value;
    if (selectedFields.companyPhone) invoiceData.companyPhone = document.getElementById('companyPhoneInput').value;
    if (selectedFields.companyEmail) invoiceData.companyEmail = document.getElementById('companyEmailInput').value;
    if (selectedFields.logo) {
        const logoImg = document.querySelector('#logoPreview img');
        if (logoImg) invoiceData.logo = logoImg.src;
    }

    // Invoice details
    if (selectedFields.invoiceNumber) invoiceData.invoiceNumber = document.getElementById('invoiceNumberInput').value;
    if (selectedFields.invoiceDate) invoiceData.invoiceDate = document.getElementById('invoiceDateInput').value;
    if (selectedFields.dueDate) invoiceData.dueDate = document.getElementById('dueDateInput').value;

    // Client info
    if (selectedFields.clientName) invoiceData.clientName = document.getElementById('clientNameInput').value;
    if (selectedFields.clientAddress) invoiceData.clientAddress = document.getElementById('clientAddressInput').value;
    if (selectedFields.clientPhone) invoiceData.clientPhone = document.getElementById('clientPhoneInput').value;
    if (selectedFields.clientEmail) invoiceData.clientEmail = document.getElementById('clientEmailInput').value;

    // Items
    if (selectedFields.items) {
        invoiceData.items = [];
        const itemRows = document.querySelectorAll('.item-row');
        itemRows.forEach(row => {
            const description = row.querySelector('.item-description').value;
            const quantity = row.querySelector('.item-quantity').value;
            const rate = row.querySelector('.item-rate').value;
            const amount = row.querySelector('.item-amount').value;
            
            if (description && quantity && rate) {
                invoiceData.items.push({
                    description,
                    quantity: parseFloat(quantity),
                    rate: parseFloat(rate),
                    amount: parseFloat(amount)
                });
            }
        });
    }

    // Tax and discount
    if (selectedFields.tax) invoiceData.tax = parseFloat(document.getElementById('taxInput').value) || 0;
    if (selectedFields.discount) invoiceData.discount = parseFloat(document.getElementById('discountInput').value) || 0;

    // Additional info
    if (selectedFields.notes) invoiceData.notes = document.getElementById('notesInput').value;
    if (selectedFields.terms) invoiceData.terms = document.getElementById('termsInput').value;
    if (selectedFields.bankDetails) invoiceData.bankDetails = document.getElementById('bankDetailsInput').value;

    // Custom fields
    invoiceData.customFields = {};
    customFields.forEach(field => {
        if (selectedFields[field.id]) {
            const inputElement = document.getElementById(`${field.id}Input`);
            if (inputElement && inputElement.value) {
                invoiceData.customFields[field.id] = {
                    name: field.name,
                    value: inputElement.value
                };
            }
        }
    });

    // Generate invoice HTML
    renderInvoice();

    // Show preview
    document.getElementById('invoiceForm').classList.add('hidden');
    document.getElementById('invoicePreview').classList.remove('hidden');
}

function renderInvoice() {
    const invoiceContainer = document.getElementById('invoice');
    let invoiceHTML = '';

    // Header
    invoiceHTML += '<div class="invoice-header">';
    invoiceHTML += '<div class="company-info">';
    
    if (invoiceData.logo) {
        invoiceHTML += `<img src="${invoiceData.logo}" class="logo-preview" alt="Company Logo">`;
    }
    
    if (invoiceData.companyName) {
        invoiceHTML += `<h3>${invoiceData.companyName}</h3>`;
    }
    
    if (invoiceData.companyAddress) {
        invoiceHTML += `<p>${invoiceData.companyAddress.replace(/\n/g, '<br>')}</p>`;
    }
    
    if (invoiceData.companyPhone) {
        invoiceHTML += `<p>Phone: ${invoiceData.companyPhone}</p>`;
    }
    
    if (invoiceData.companyEmail) {
        invoiceHTML += `<p>Email: ${invoiceData.companyEmail}</p>`;
    }
    
    invoiceHTML += '</div>';
    
    invoiceHTML += '<div class="invoice-details">';
    invoiceHTML += '<h2>INVOICE</h2>';
    
    if (invoiceData.invoiceNumber) {
        invoiceHTML += `<p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>`;
    }
    
    if (invoiceData.invoiceDate) {
        invoiceHTML += `<p><strong>Date:</strong> ${new Date(invoiceData.invoiceDate).toLocaleDateString()}</p>`;
    }
    
    if (invoiceData.dueDate) {
        invoiceHTML += `<p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString()}</p>`;
    }
    
    invoiceHTML += '</div>';
    invoiceHTML += '</div>';

    // Client info
    if (invoiceData.clientName || invoiceData.clientAddress || invoiceData.clientPhone || invoiceData.clientEmail) {
        invoiceHTML += '<div class="client-info">';
        invoiceHTML += '<h4>Bill To:</h4>';
        
        if (invoiceData.clientName) {
            invoiceHTML += `<p><strong>${invoiceData.clientName}</strong></p>`;
        }
        
        if (invoiceData.clientAddress) {
            invoiceHTML += `<p>${invoiceData.clientAddress.replace(/\n/g, '<br>')}</p>`;
        }
        
        if (invoiceData.clientPhone) {
            invoiceHTML += `<p>Phone: ${invoiceData.clientPhone}</p>`;
        }
        
        if (invoiceData.clientEmail) {
            invoiceHTML += `<p>Email: ${invoiceData.clientEmail}</p>`;
        }
        
        invoiceHTML += '</div>';
    }

    // Items table
    if (invoiceData.items && invoiceData.items.length > 0) {
        invoiceHTML += '<table class="items-table">';
        invoiceHTML += '<thead><tr><th>Description</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead>';
        invoiceHTML += '<tbody>';
        
        let subtotal = 0;
        invoiceData.items.forEach(item => {
            invoiceHTML += `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.rate.toFixed(2)}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                </tr>
            `;
            subtotal += item.amount;
        });
        
        invoiceHTML += '</tbody></table>';

        // Totals
        invoiceHTML += '<div class="totals">';
        invoiceHTML += `<div class="total-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>`;
        
        let total = subtotal;
        
        if (invoiceData.discount > 0) {
            const discountAmount = (subtotal * invoiceData.discount) / 100;
            invoiceHTML += `<div class="total-row"><span>Discount (${invoiceData.discount}%):</span><span>-$${discountAmount.toFixed(2)}</span></div>`;
            total -= discountAmount;
        }
        
        if (invoiceData.tax > 0) {
            const taxAmount = (total * invoiceData.tax) / 100;
            invoiceHTML += `<div class="total-row"><span>Tax (${invoiceData.tax}%):</span><span>$${taxAmount.toFixed(2)}</span></div>`;
            total += taxAmount;
        }
        
        invoiceHTML += `<div class="total-row final"><span>Total:</span><span>$${total.toFixed(2)}</span></div>`;
        invoiceHTML += '</div>';
    }

    // Footer
    invoiceHTML += '<div class="invoice-footer">';
    
    if (invoiceData.notes) {
        invoiceHTML += `<div><h4>Notes:</h4><p>${invoiceData.notes.replace(/\n/g, '<br>')}</p></div>`;
    }
    
    if (invoiceData.terms) {
        invoiceHTML += `<div><h4>Terms & Conditions:</h4><p>${invoiceData.terms.replace(/\n/g, '<br>')}</p></div>`;
    }
    
    if (invoiceData.bankDetails) {
        invoiceHTML += `<div><h4>Bank Details:</h4><p>${invoiceData.bankDetails.replace(/\n/g, '<br>')}</p></div>`;
    }
    
    // Custom fields
    if (invoiceData.customFields && Object.keys(invoiceData.customFields).length > 0) {
        Object.values(invoiceData.customFields).forEach(field => {
            invoiceHTML += `<div><h4>${field.name}:</h4><p>${field.value.replace(/\n/g, '<br>')}</p></div>`;
        });
    }
    
    invoiceHTML += '</div>';

    invoiceContainer.innerHTML = invoiceHTML;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const invoice = document.getElementById('invoice');
    
    html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        const filename = invoiceData.invoiceNumber ? `Invoice_${invoiceData.invoiceNumber}.pdf` : 'Invoice.pdf';
        pdf.save(filename);
    });
}

function editInvoice() {
    updateProgressBar(2);
    document.getElementById('invoicePreview').classList.add('hidden');
    document.getElementById('invoiceForm').classList.remove('hidden');
}

function goBack() {
    updateProgressBar(1);
    document.getElementById('invoiceForm').classList.add('hidden');
    document.getElementById('fieldSelection').classList.remove('hidden');
}

function startOver() {
    updateProgressBar(1);
    document.getElementById('invoicePreview').classList.add('hidden');
    document.getElementById('fieldSelection').classList.remove('hidden');
    
    // Reset form
    const checkboxes = document.querySelectorAll('#fieldSelection input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = ['companyName', 'invoiceNumber', 'invoiceDate', 'clientName', 'items'].includes(checkbox.id);
    });
    
    // Clear custom fields
    customFields = [];
    customFieldCounter = 1;
    document.getElementById('customFieldsGrid').innerHTML = '';
    document.getElementById('customFieldName').value = '';
    document.getElementById('customFieldType').value = 'text';
    
    selectedFields = {};
    invoiceData = {};
}