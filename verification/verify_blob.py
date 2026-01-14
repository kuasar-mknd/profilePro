
from playwright.sync_api import sync_playwright

def verify_blob_optimization():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home page
        page.goto("http://localhost:4321/")

        # Wait for blob to be present
        blob = page.locator("#mouse-blob")
        blob.wait_for(state="attached")

        # Initial state check
        print(f"Initial will-change: {blob.evaluate('el => el.style.willChange')}")

        # Simulate mouse move to trigger animation
        # Move mouse to center
        # We need to ensure we are moving over the body/container
        page.mouse.move(500, 500)

        # Wait a bit for animation to start
        page.wait_for_timeout(50)

        # Check if will-change is applied during animation
        # Since the animation runs on requestAnimationFrame, we might need to check repeatedly

        for i in range(5):
            page.mouse.move(500 + i*10, 500 + i*10)
            page.wait_for_timeout(20)
            will_change = blob.evaluate('el => el.style.willChange')
            print(f"Animation step {i} will-change: {will_change}")

        # Stop moving mouse and wait for animation to settle
        page.wait_for_timeout(2000)

        # Check final state
        will_change_after = blob.evaluate('el => el.style.willChange')
        print(f"After animation will-change: {will_change_after}")

        page.screenshot(path="verification/blob_verification.png")
        browser.close()

if __name__ == "__main__":
    verify_blob_optimization()
