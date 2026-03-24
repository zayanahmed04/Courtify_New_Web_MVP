# Payment Methods and Processing

## Payment System Overview

Courtify enables secure, convenient payment processing for booking deposits. This guide explains all payment options, how transactions work, security measures, and best practices for managing your payments.

## Accepted Payment Methods

### Primary Payment Method: Credit and Debit Cards

Courtify currently processes advance booking deposits through **card payments (Visa, Mastercard, etc.)**.

**Cards Accepted**:
- Visa
- Mastercard
- Debit cards with Visa/Mastercard networks
- International cards (where supported)

**Card Requirements**:
- Valid expiration date (not expired)
- Correct CVV security code
- Matching billing address (for security)
- Sufficient available balance
- Active account

### Payment Processor: Stripe

Courtify uses **Stripe**, a trusted international payment processor, to handle all card transactions securely.

**Why Stripe?**:
- Industry-leading security standards
- PCI compliance certification
- Global payment support
- Fraud detection systems
- Professional merchant services
- Automatic settlements to court owners

## How to Make a Payment

### Step 1: Booking Approval
After a court owner approves your booking:
- Booking status changes to "Approved"
- You receive notification via email
- You see "Make Payment" or "Pay Now" button in app

### Step 2: Payment Initiation
Click on your approved booking:
- Review booking details
- Verify date, time, and cost
- Check total amount due (advance deposit)
- Click "Pay Now" or "Proceed to Payment"

### Step 3: Secure Payment Page
You're directed to Stripe's secure payment page:
- Page is encrypted (look for "https://" in URL)
- Page is secure and verified
- Your information is protected
- Do not share page URL or details

### Step 4: Enter Card Information
Provide your card details:
- **Card Number**: Full 16-digit number
- **Expiration Date**: MM/YY format
- **CVV**: 3-4 digit security code on back of card
- **Cardholder Name**: As shown on card
- **Billing Zip Code**: Postal code matching card

### Step 5: Review and Confirm
Before finalizing:
- Verify all information is correct
- Confirm amount matches booking total
- Check court name and date
- No typos in card number
- Click "Pay" or "Complete Payment"

### Step 6: Payment Processing
System processes your payment:
- Card is charged for advance amount
- Transaction is verified by your bank
- Fraud checks performed automatically
- Processing typically takes seconds to minutes
- System confirms payment received

### Step 7: Payment Confirmation
Success page displays:
- "Payment Successful" confirmation
- Transaction/Receipt number
- Amount charged
- Booking now shows as "Confirmed"
- Email confirmation sent immediately

## Payment Amounts Explained

### Total Cost Calculation
**Formula**: Court Hourly Rate × Duration (hours) = Total Cost

**Example**:
- Court hourly rate: 2,000 PKR
- Duration: 2 hours
- Total cost: 2,000 × 2 = 4,000 PKR

### Advance Deposit
The amount charged through Courtify payment system typically includes:
- Usually 50% of total cost (varies by court)
- Purpose: Secures the booking reservation
- Proof of commitment from player
- Ensures court owner's time is valued

**Example**:
- Total cost: 4,000 PKR
- Advance deposit (50%): 2,000 PKR
- Remaining balance: 2,000 PKR

### Remaining Balance
Amount still owed after advance payment:
- Remaining = Total - Advance Paid
- Usually paid in cash at court
- Due on day of booking arrival
- Court owner collects from you

**Example**:
- Total: 4,000 PKR
- Advance paid online: 2,000 PKR
- Remaining balance: 2,000 PKR (pay in person)

**Note**: Some courts may accept full payment online (100%), or different percentages. Check individual court's policy.

## Security and Privacy

### Your Information is Protected

**Courtify Never Sees**:
- Full card numbers
- CVV security codes
- Sensitive card data
- Direct payment information

**Stripe Handles**:
- Card processing
- Encryption
- Fraud detection
- PCI compliance
- Data security

**This Means**:
- Your card details are not stored on Courtify servers
- No one at Courtify can access your card information
- Payments processed by industry-leading secure systems
- Your information is highly protected

### Secure Payment Features

**Encryption**: All payment data is encrypted during transmission
- Uses industry-standard SSL/TLS encryption
- Protects data in transit from interception
- Secure payment pages use "https://" protocol

**Verification**: Multiple security checks performed
- Card verification: Matches card details with bank records
- 3D Secure: Optional additional authentication
- Fraud detection: Automated systems check for suspicious activity
- CVV verification: Ensures you have physical card

**Compliance**: Meets international standards
- PCI DSS Compliance: Payment Card Industry Data Security Standard
- Regular security audits conducted
- Third-party verification of systems
- Continuous monitoring for threats

## Payment Issues and Troubleshooting

### Card Declined Error

**Common Reasons**:
1. **Insufficient Funds**: Card doesn't have enough balance
   - Solution: Ensure sufficient funds in account
   - Try again with adequate balance
   - Use different card if available

2. **Incorrect Card Information**: Wrong number, expiration, or CVV
   - Solution: Double-check all details against card
   - Verify expiration date hasn't passed
   - Confirm correct CVV (3-4 digits)
   - Try again with correct information

3. **Billing Address Mismatch**: Entered address doesn't match bank records
   - Solution: Enter exact address from card statement
   - Check spelling carefully
   - Include postal code
   - Contact bank if address changed

4. **Card Expired**: Card expiration date has passed
   - Solution: Use different card that's not expired
   - Contact your bank for new card
   - Update card details if available

5. **Bank Fraud Protection**: Bank declined as suspicious
   - Solution: Contact your bank to authorize payment
   - Inform bank you're using card for Courtify booking
   - Try payment again after authorization
   - Bank may need to verify your identity

6. **Card Locked**: Card temporarily locked for security
   - Solution: Contact card issuer immediately
   - May need to verify identity
   - Request card to be unlocked
   - Try payment again after unlocking

### Payment Gateway Timeout

If payment page times out or doesn't respond:
1. Wait a few minutes
2. Refresh the page
3. Try the payment again
4. Check your internet connection
5. Try from different browser if issue persists
6. Contact support if problem continues

### Payment Processed But Not Confirmed

If payment went through but booking isn't showing as confirmed:
1. Wait 5-10 minutes for processing
2. Refresh your booking page
3. Check email for confirmation
4. Look in your transaction history
5. If still not confirming after 15 minutes, contact support

### Forgotten Payment Prompt

If you closed payment before completing:
1. Go back to your booking
2. If status shows "Approved" but not "Confirmed"
3. Click "Make Payment" again
4. Complete the payment process

## Managing Your Payments

### Payment History
View all your payment records:
1. Go to your dashboard
2. Navigate to "Payment History" or "Transactions"
3. See all payments made
4. View transaction IDs and dates
5. Download receipts if needed

### Payment Receipts
After successful payment:
- Email receipt sent automatically
- Shows amount, date, booking details
- Include transaction ID for reference
- Useful for your records and accounting
- Can be reprinted from dashboard

### Payment Disputes

If you believe you were charged incorrectly:
1. Contact court owner first (may be misunderstanding)
2. Review booking details and confirmation
3. Check if charges match agreed amount
4. If unresolved, contact Courtify support
5. Provide booking ID and transaction number
6. Courtify will investigate your claim

### Refunds

**When You Get Refunds**:
- Cancellation with advance refund policy
- Payment error or overcharge
- Court booking rejection
- Refund claim approved by Courtify

**How Refunds Work**:
1. Refund initiated by court owner or Courtify
2. Refund to original payment method (your card)
3. May take 3-7 business days to appear
4. Check bank statement for refund
5. Contact bank if refund doesn't appear

## Payment Best Practices

### Before Payment
- ✅ Verify court name and booking details are correct
- ✅ Confirm date and time match your preferences
- ✅ Double-check total cost calculation
- ✅ Ensure you have sufficient card balance
- ✅ Use a reliable internet connection
- ✅ Don't share payment page with others

### During Payment
- ✅ Use secure, verified payment page (https://)
- ✅ Enter card information carefully
- ✅ Verify no typos in card number or expiration
- ✅ Use correct billing address
- ✅ Complete transaction on same device if possible
- ✅ Don't save card details on shared devices

### After Payment
- ✅ Wait for confirmation page (don't click back)
- ✅ Save transaction number for records
- ✅ Check email for receipt
- ✅ Verify booking shows as "Confirmed"
- ✅ Keep receipt for your records
- ✅ Note payment details in case of inquiry

### General Security
- ✅ Never share your card details in emails or messages
- ✅ Don't give card info over phone unless you initiated call
- ✅ Only use payment on official Courtify platform
- ✅ Check for suspicious charges regularly
- ✅ Use strong password on your account
- ✅ Enable notifications for payment confirmations

## Payment Currencies and Exchange Rates

### Supported Currencies
- Pakistani Rupees (PKR) - Primary currency
- Other currencies may be supported based on region
- Exchange rates may apply for international cards
- Your bank may charge foreign transaction fees

### Exchange Rates
- International cards may be converted to PKR
- Exchange rate applied by card issuer
- Courtify shows price in selected currency
- Check with bank about conversion fees

## Balance Payment (In Person)

### Completing Your Payment
When you arrive at the court:
1. Check in with court owner/staff
2. Confirm your booking
3. Ask about remaining balance due
4. Pay remaining amount (usually cash)
5. Receive receipt from court
6. Enjoy your booking!

**Note**: Courtify's online payment covers the advance only. Remaining balance is settled directly at the court location.

## Payment Support

If you experience issues with payments:
- Check your card details first
- Verify booking information
- Wait for processing if just submitted
- Contact your bank if card declined
- Reach out to Courtify support for platform issues
- Provide booking ID and transaction details

Courtify's payment system is designed to be secure, convenient, and straightforward. Enjoy hassle-free booking with confidence!