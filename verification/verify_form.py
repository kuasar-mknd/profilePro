from playwright.sync_api import sync_playwright

def verify_contact_form(page):
    page.goto("http://localhost:4321")

    # Scroll to contact form
    contact_link = page.get_by_role("link", name="Me contacter")
    contact_link.click()

    # Wait for scroll
    page.wait_for_timeout(1000)

    # Find inputs and verify glow class structure
    name_input = page.locator("#name")
    name_input.click()

    # Take screenshot of focused input to verify visual appearance (glow)
    # Ideally we'd assert the CSS values, but visual verification is good too.
    page.screenshot(path="verification/contact_form_focus.png")

    # Verify the DOM structure matches our optimization
    # .input-glow should be a sibling of the input
    glow = page.locator("#name + .input-glow")

    # Check if glow has the box-shadow class/style we expect (or computed style)
    box_shadow = glow.evaluate("el => getComputedStyle(el).boxShadow")
    print(f"Box Shadow: {box_shadow}")

    opacity = glow.evaluate("el => getComputedStyle(el).opacity")
    print(f"Opacity (focused): {opacity}")

    # Blur to check opacity change
    page.locator("body").click()
    page.wait_for_timeout(500)
    opacity_blurred = glow.evaluate("el => getComputedStyle(el).opacity")
    print(f"Opacity (blurred): {opacity_blurred}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_contact_form(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
