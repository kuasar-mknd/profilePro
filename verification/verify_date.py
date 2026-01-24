from playwright.sync_api import sync_playwright, expect
import re

def verify_date_format(page):
    print("Navigating to homepage...")
    page.goto("http://localhost:4321")

    print("Waiting for latest posts...")
    # Wait for the Latest Posts section
    page.wait_for_selector(".latest-posts-section")

    # Get the first time element inside a post
    # Note: PublishDate.astro renders a <time> tag.
    first_date = page.locator("time").first

    # Check text content format (dd-mm-yyyy)
    text = first_date.text_content()
    print(f"Date found: {text}")

    # Regex for dd-mm-yyyy (e.g. 01-12-2023)
    if not re.match(r"\d{2}-\d{2}-\d{4}", text.strip()):
        raise Exception(f"Date format incorrect: {text}")

    print("Taking screenshot...")
    # Screenshot
    page.screenshot(path="verification/date_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_date_format(page)
        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()
