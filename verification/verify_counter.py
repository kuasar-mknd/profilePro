import asyncio
from playwright.async_api import async_playwright, expect

async def run():
    async with async_playwright() as p:
        # Launch browser with reduced motion to speed up animations
        browser = await p.chromium.launch(headless=True)
        # Create a context with reduced motion
        context = await browser.new_context(reduced_motion="reduce")
        page = await context.new_page()

        # Check if we can access localhost:4321
        try:
            print("Navigating to localhost:4321...")
            await page.goto("http://localhost:4321", timeout=30000)
        except Exception as e:
            print(f"Could not connect to localhost:4321: {e}")
            await browser.close()
            return

        print("Page loaded.")

        # Locate the textarea
        # The textarea has id="message" and name="message"
        textarea = page.locator("textarea[name='message']")

        # Scroll to it
        await textarea.scroll_into_view_if_needed()

        # Verify initial state of counter
        counter = page.locator("#message-counter")
        print("Checking initial counter state...")
        await expect(counter).to_have_text("0 / 5000")

        # Type some text
        print("Typing text...")
        await textarea.fill("Hello World")

        # Verify counter updates
        print("Checking updated counter state...")
        await expect(counter).to_have_text("11 / 5000")

        # Take screenshot of the form area
        form = page.locator("#contact-form")
        await form.screenshot(path="verification/contact_form_counter.png")

        print("Verification successful!")
        await browser.close()

import asyncio
asyncio.run(run())
