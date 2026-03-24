# Booking System Flow

## Understanding the Complete Booking Process

The booking system is the heart of Courtify, connecting players with courts and enabling seamless reservations. This document explains the entire booking journey from discovery through completion, including all stages, decisions points, and outcomes.

## Booking Flow Stages

### Stage 1: Court Discovery
**What Happens**: Player searches for courts
- Player opens Courtify and explores
- Uses search filters (location, sport type, price)
- Views court listings and details
- Reads reviews and ratings
- Checks availability calendar

**Possible Outcomes**:
- Player finds desired court → Proceeds to booking
- Player can't find suitable court → Continues searching
- Player adds court to favorites for later

### Stage 2: Booking Initiation
**What Happens**: Player creates booking request
- Player clicks "Book Now" or selects time slot
- Chooses booking date (today or future only)
- Selects start and end times
- System calculates total cost
- Booking details displayed for review

**Validation Checks**:
- Date cannot be in the past
- Start time must be before end time
- Times must fall within court's operating hours
- No overlapping bookings for same court/date/time
- Court must not be under maintenance

**Possible Outcomes**:
- All validation passes → Proceed to submission
- Validation fails → Error message, player corrects
- Player cancels → Return to search

### Stage 3: Booking Submission
**What Happens**: Player confirms and submits request
- Player reviews all booking details one final time
- Confirms court name, date, time, duration
- Confirms total cost calculation
- Clicks "Confirm Booking" button
- Booking sent to court owner

**What System Does**:
- Creates booking record in database
- Sets status to "Pending"
- Notifies court owner of new request
- Reserves the slot temporarily (optional hold)
- Records booking creation time

**Possible Outcomes**:
- Booking successfully created (Pending)
- System error → Booking fails, player can retry
- Slot booked by another player → Slot no longer available

### Stage 4: Court Owner Review
**What Happens**: Court owner decides to approve or reject
- Court owner receives notification
- Views booking in their owner dashboard
- Sees player details and booking information
- Decides whether to accept
- Takes 1-24 hours typically

**Owner's Decision Options**:
1. **Approve Booking**: Owner accepts request
   - Status changes to "Approved"
   - Player notified via email
   - Player shown payment prompt
   - Slot confirmed reserved

2. **Reject Booking**: Owner declines request
   - Status changes to "Rejected"
   - Player notified via email
   - Slot returns to availability
   - Player can search for alternatives

3. **No Response**: Owner doesn't respond within time limit
   - Booking may auto-expire
   - Platform may send reminder
   - Player can follow up or cancel

### Stage 5: Payment Processing
**What Happens**: Player pays advance deposit (after approval)
- Status: Approved, awaiting payment
- Player receives payment prompt/link
- Player directed to payment page
- Player enters payment information
- System processes payment through Stripe

**Payment Details**:
- Advance amount: Calculated and requested
- Payment method: Credit/debit card via Stripe
- Currency: PKR or other configured currency
- Receipt: Generated and emailed

**Possible Outcomes**:
1. **Payment Successful**:
   - Status changes to "Confirmed"
   - Player receives confirmation
   - Court owner notified
   - Booking fully secured

2. **Payment Failed**:
   - Status stays "Approved"
   - Player notified of failure
   - Player can retry payment
   - Card may be declined (insufficient funds, wrong details, etc.)

3. **Payment Cancelled by Player**:
   - Booking reverts to "Approved" (not confirmed)
   - Player can pay later or cancel
   - Slot remains held temporarily

### Stage 6: Confirmed Booking
**What Happens**: Booking is secured and active
- Status: Confirmed
- Court slot guaranteed
- Player receives confirmation details
- Court owner can see confirmed booking
- Time remaining until booking shown on dashboard

**During This Period**:
- Player can prepare for their game
- Player may cancel if needed (with refund implications)
- Court owner prepares court
- Any remaining balance due at court arrival

### Stage 7: Booking Execution
**What Happens**: Player arrives and uses the court
- Date and time of booking arrives
- Player should arrive 10-15 minutes early
- Player checks in (if required)
- Court owner verifies booking
- Remaining payment collected (usually in cash)
- Player uses court for booked duration
- Player should leave on time for next booking

**Typical Scenario**:
- Player arrives on time ✅
- Court is ready and clean ✅
- Remaining balance paid ✅
- Player plays their game ✅
- Player leaves after time expires ✅

**Possible Issues**:
- Player doesn't show (no-show)
- Player arrives late
- Court not ready as expected
- Player wants to extend time
- Equipment issues or safety concerns

### Stage 8: Booking Completion
**What Happens**: Booking time passes and session ends
- Playing session ends
- Player vacates court
- Court owner resets/prepares for next booking
- Booking automatically marked as "Completed"
- Moved to player's booking history
- Available for review and rating

### Stage 9: Review and Rating (Optional)
**What Happens**: Player can leave feedback
- Player sees "Leave Review" option
- Player provides 1-5 star rating
- Player may write comments (if feature available)
- Review submitted and visible to others
- Court owner can see feedback
- Rating incorporated into court's average

**Rating Scale**:
- 5 stars: Excellent - Highly recommended
- 4 stars: Good - Satisfied
- 3 stars: Average - Acceptable
- 2 stars: Poor - Issues noticed
- 1 star: Terrible - Not recommended

## Booking Status Summary

**Pending**: Request awaiting owner approval
- Player has submitted
- Owner hasn't responded yet
- No payment made
- Slot tentatively held

**Approved**: Owner accepted, awaiting payment
- Owner approved request
- Player needs to pay deposit
- Slot held pending payment
- 24-48 hours to complete payment typically

**Confirmed**: Payment received, booking secured
- Payment successfully processed
- Booking fully secured
- Court slot guaranteed
- Player can proceed with plans

**Completed**: Session ended
- Playing time has passed
- Booking archived
- Available for review
- Used for history and records

**Rejected**: Owner declined
- Owner rejected request
- Slot released to other players
- No charge to player
- Can search for alternatives

**Cancelled**: Booking cancelled
- Either player or owner cancelled
- Refund initiated if applicable
- Slot returns to availability
- Archived in history

## Key Decision Points

### Player Perspective
1. **Find court** (search and browse)
2. **Create booking request** (submit request)
3. **Wait for approval** (owner decides)
4. **Make payment** (secure deposit)
5. **Prepare for game** (confirm details)
6. **Use court** (play)
7. **Leave review** (provide feedback)

### Court Owner Perspective
1. **Receive booking notification** (new request arrives)
2. **Review request** (check player and details)
3. **Approve or reject** (make decision)
4. **Track payment** (monitor for completion)
5. **Prepare court** (get ready for player)
6. **Complete booking** (mark done after player leaves)
7. **Collect balance** (receive remaining payment in person)

## Cancellation Throughout Process

### Before Owner Approval
- Player can cancel anytime with no penalty
- Owner hasn't responded yet
- Slot becomes available

### After Owner Approval (Before Payment)
- Player can cancel with no penalty
- Owner notified of cancellation
- Slot returned to availability
- No payment charged

### After Payment (Before Booking)
- Player can cancel with refund considerations
- Early cancellation (24+ hours): Usually full refund
- Short notice (12-24 hours): Partial refund may apply
- Very late (within 12 hours): Deposit may be forfeit
- Check specific court's cancellation policy

### During Booking Time
- Cancellation rarely occurs but possible
- Would result in refund per policy
- Owner notified immediately
- Court slot may be rebooked

### After Completion
- Booking can't be cancelled
- Archived in history
- Player can request refund only for legitimate issues

## Booking Duration and Pricing

### Duration Calculation
- Start time: When player can start using court
- End time: When player must stop using court
- Duration: Number of hours between start and end
- Minimum: Usually 1 hour
- Maximum: Depends on court (typically up to 6 hours)

### Cost Calculation
- Hourly rate: Set by court owner (e.g., 2000 PKR/hour)
- Total cost: Hourly rate × number of hours
- Example: 2000 PKR/hour × 2 hours = 4000 PKR total
- Advance payment: Usually percentage of total (e.g., 50%)
- Balance due: Remaining amount, paid in person

### Payment Structure
**Online (Advance)**:
- Paid through Courtify payment system
- Processed via Stripe/card
- Receipt generated automatically
- Holds court slot

**In Person (Balance)**:
- Paid at court on day of booking
- Usually cash accepted
- Receipt provided by court
- Completes payment

## Special Booking Scenarios

### Group Bookings
- One person books for group
- Multiple players, one booking
- Payment covers all players
- Court owner aware of group usage

### Recurring Bookings
- Regular weekly/monthly bookings
- May be listed individually or as package
- Discounts may apply for recurring
- Build relationship with court owner

### Last-Minute Bookings
- Booking for today or same evening
- May have limited availability
- Quicker owner response usually needed
- Process same as regular booking

### Extended Bookings
- Booking longer than typical duration
- May need owner approval
- Price calculated normally
- Owner may accommodate or decline

## Booking Confirmation and Reminders

### Confirmation Email
After each status change, player receives email:
- Booking approved confirmation
- Payment received confirmation
- Booking confirmed notification
- Reminder 24 hours before booking

### Dashboard Notifications
- Pop-up alerts for status changes
- Calendar view of upcoming bookings
- Countdown to booking time
- Booking history accessible

### Communication
- Court owner can message player
- Player can ask questions
- Used for special instructions
- Confirm arrival time if needed

## Booking Records and History

### Booking History
Players can access:
- All completed bookings
- Past 1 year or longer
- Court information for each booking
- Dates, times, and costs
- Ratings they left

### Court Owner Records
- All bookings for their courts
- Player information
- Payment records
- Cancellation history
- No-show tracking

### Reporting and Exports
- Generate booking reports
- Download records for accounting
- Tax documentation
- Business analytics

Courtify's booking system is designed to make reservations simple, secure, and reliable for all parties. Understanding this flow helps users navigate the platform effectively!