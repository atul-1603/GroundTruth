import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings

def generate_volunteer_email(volunteer_name: str, ngo_id: str) -> str:
    """
    Format: firstname.ngocode@civicpulse.org
    Example: priya.ngo4721@civicpulse.org
    ngocode = "ngo" + last 4 chars of ngo_id
    """
    first_name = volunteer_name.split(" ")[0].lower()
    ngocode = f"ngo{ngo_id[-4:]}"
    return f"{first_name}.{ngocode}@civicpulse.org"

async def send_volunteer_credentials(
    volunteer_name: str,
    volunteer_email: str,
    temp_password: str,
    ngo_name: str,
    recipient_personal_email: str
) -> None:
    """
    Send HTML email with volunteer credentials.
    """
    msg = MIMEMultipart("alternative")
    msg['Subject'] = f"Welcome to CivicPulse - Volunteer for {ngo_name}"
    msg['From'] = settings.EMAIL_FROM
    msg['To'] = recipient_personal_email

    html = f"""
    <html>
      <body>
        <h2>Welcome to CivicPulse!</h2>
        <p>Hi {volunteer_name},</p>
        <p>You have been registered as a volunteer for <b>{ngo_name}</b>.</p>
        <p>Your login credentials are:</p>
        <ul>
          <li><b>Email:</b> {volunteer_email}</li>
          <li><b>Temporary Password:</b> {temp_password}</li>
        </ul>
        <p>Please <a href="http://localhost:5173/volunteer/login">login here</a> and you will be prompted to change your password.</p>
        <br/>
        <p>Thank you,<br/>The CivicPulse Team</p>
      </body>
    </html>
    """
    part = MIMEText(html, 'html')
    msg.attach(part)

    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(settings.EMAIL_FROM, recipient_personal_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")
        # Not throwing error here to avoid blocking volunteer creation if SMTP is broken locally
