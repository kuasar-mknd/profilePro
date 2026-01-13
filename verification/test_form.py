import time
from playwright.sync_api import sync_playwright, expect
import json
import re

def test_contact_form(page):
    print("Navigating to home page...")
    page.goto("http://localhost:4321/")

    # Wait for the contact form to be visible (it's at the bottom)
    # The form id is 'contact-form'
    contact_form = page.locator("#contact-form")

    print("Waiting for contact form...")
    # Scroll to it
    contact_form.scroll_into_view_if_needed()
    expect(contact_form).to_be_visible()

    # Intercept the request to Web3Forms to verify payload and mock success
    def handle_route(route):
        print(f"Intercepted request to: {route.request.url}")
        if "api.web3forms.com/submit" in route.request.url:
            post_data = route.request.post_data
            print(f"Request payload: {post_data}")

            try:
                data = json.loads(post_data)

                message = data.get("message", "")
                print(f"Message sent: {message}")

                # Verify sanitization
                if "<script>" in message:
                    print("FAIL: Message NOT sanitized")
                elif "&lt;script&gt;" in message:
                    print("SUCCESS: Message sanitized")
                else:
                    print("INFO: Message doesn't contain script tag (maybe input failed?)")

            except Exception as e:
                print(f"Error parsing payload: {e}")

            # Return success mock
            route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({"success": True, "message": "Form submitted successfully"})
            )
        else:
            route.continue_()

    page.route("**/*", handle_route)

    # Fill the form
    print("Filling form...")

    # Name - use exact match or role
    page.get_by_role("textbox", name=re.compile("Nom complet")).fill("Test User")

    # Email
    page.get_by_role("textbox", name=re.compile("Email")).fill("test@example.com")

    # Message (inject XSS payload)
    message_content = "Hello <script>alert(1)</script> world"
    page.get_by_role("textbox", name=re.compile("Message")).fill(message_content)

    # Wait a bit for validation
    time.sleep(1)

    # Click submit
    print("Submitting form...")
    page.get_by_role("button", name="Envoyer le message").click()

    # Wait for success message
    # The success message is inside #form-success-message which becomes flex (was hidden)
    success_msg = page.locator("#form-success-message")

    # Wait for it to have class 'flex' or check visibility
    # The code removes 'hidden' and adds 'flex'
    expect(success_msg).to_be_visible(timeout=5000)

    print("Form submitted successfully and success message visible.")

    # Take screenshot
    page.screenshot(path="verification/contact_form_success.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with French locale
        context = browser.new_context(locale="fr-FR")
        page = context.new_page()
        try:
            test_contact_form(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/failure.png")
            raise
        finally:
            browser.close()
