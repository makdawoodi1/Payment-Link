import React from 'react'
import { MAIL_TO, SUPPORT_ADDRESS, SUPPORT_COMPANY, SUPPORT_CONTACT, SUPPORT_WEBSITE } from '../../config'

const ConfirmedPayment = () => {
  return (
    <div class="container col-md-6 py-5">
        <img src="/logo.png" className="mb-4" style={{width: "300px"}} />
        <div className="status">
            <p>Payment successfully charged.</p>
            <p>A receipt of this transaction has been sent to your email address on file. </p>
            <p>Please feel free to send us an email at<a href={MAIL_TO}>{SUPPORT_ADDRESS}</a> or call us at {SUPPORT_CONTACT} for billing related queries.</p>
            <p>Thank you for choosing <a href={SUPPORT_WEBSITE}>{SUPPORT_COMPANY}</a>.</p>
        </div>
    </div>
  )
}

export default ConfirmedPayment