 function payWithPaystack() {
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const event = document.getElementById('event');
      const eventSelected = event.options[event.selectedIndex];
      
      if (!fullName || !email || !event.value) {
        alert("Please fill out all fields");
        return;
      }
      
      const eventName = eventSelected.text;
      const price = eventSelected.getAttribute('data-price');
      const location = eventSelected.getAttribute('data-location');
      const date = eventSelected.getAttribute('data-date');
      
       var handler = PaystackPop.setup({
        key: 'pk_live_dd8aa5bda243a559fec7f11f3df339c86a1f76f6', 
        email: email,
        amount: price * 100, 
        currency: "NGN",
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: fullName
            },
            {
              display_name: "Event Name",
              variable_name: "event_name",
              value: eventName
            },
            {
              display_name: "Location",
              variable_name: "location",
              value: location
            },
            {
              display_name: "Date",
              variable_name: "date",
              value: date
            }
          ]
        },
        callback: function(response) {
          alert('Payment Successful. Transaction ref is ' + response.reference);
          generateQRCodeAndReceipt(fullName, eventName, price, location, date, response.reference);
        },
        onClose: function() {
          alert('Transaction was not completed.');
        }
      });
      handler.openIframe();
    }
    
    function generateQRCodeAndReceipt(fullName, eventName, price, location, date, reference) {
      const qrCodeData = `Name: ${fullName}, Event: ${eventName}, Reference: ${reference}`;
      document.getElementById('qrcode').innerHTML= "";

      const qrcode = new QRCode(document.getElementById("qrcode"), {
        text: qrCodeData,
        width: 128,
        height: 128
      });

      const receiptDetails = `
        <h3>Payment Successful!</h3>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Price:</strong> #${price}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Transaction Reference:</strong> ${reference}</p>
      `;
      document.body.insertAdjacentHTML("beforeend", receiptDetails);

     
      createDownloadButtons(fullName, eventName, price, location, date, reference);
    }

    function createDownloadButtons(fullName, eventName, price, location, date, reference) {
      document.getElementById("downloadButtons")?.remove();

      const buttonContainer = document.createElement("div");
      buttonContainer.id = "downloadButtons";
      document.body.appendChild(buttonContainer);
      const downloadQRCodeBtn = document.createElement('button');
      downloadQRCodeBtn.textContent = 'Download QR Code';
      downloadQRCodeBtn.onclick = downloadQRCode;
      buttonContainer.appendChild(downloadQRCodeBtn);
      const downloadReceiptBtn = document.createElement('button');
      downloadReceiptBtn.textContent = 'Download Receipt';
      downloadReceiptBtn.onclick = function() {
        downloadReceipt(fullName, eventName, price, location, date, reference);
      };
      buttonContainer.appendChild(downloadReceiptBtn);
    }

    function downloadQRCode() {
  const qrCodeCanvas = document.querySelector('#qrcode canvas');
  if (!qrCodeCanvas) {
    alert("QR code not generated yet");
    return;
  }
  const imageURL = qrCodeCanvas.toDataURL("image/png");
  
  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'event-ticket-qrcode.png'; 
  link.click();
}


    function downloadReceipt(fullName, eventName, price, location, date, reference) {
  const receiptText = `
    Payment Successful!
    Full Name: ${fullName}
    Event: ${eventName}
    Price: ₦${price}
    Location: ${location}
    Date: ${date}
    Transaction Reference: ${reference}
  `;
  
  const blob = new Blob([receiptText], { type: 'text/plain' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'event-receipt.txt'; 
  link.click();
  URL.revokeObjectURL(link.href);
}

