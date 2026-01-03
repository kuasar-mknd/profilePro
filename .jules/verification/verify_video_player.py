from playwright.sync_api import sync_playwright

def verify_videoplayer_poster():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        # Navigate to a project page with a video
        # Based on content exploration, 'corps-et-ame' seems to be a valid project
        # or we can check /project page
        try:
            page.goto("http://localhost:4321/project/corps-et-ame", timeout=60000)

            # Wait for content
            page.wait_for_selector(".video-player-wrapper")

            # Find the poster image
            poster = page.locator(".video-player-wrapper img").first

            # Assert width and height attributes
            width = poster.get_attribute("width")
            height = poster.get_attribute("height")

            print(f"Poster width: {width}, height: {height}")

            if width == "1280" and height == "720":
                print("Verification SUCCESS: Attributes match.")
            else:
                print("Verification FAILURE: Attributes do not match.")

            # Take screenshot
            poster.scroll_into_view_if_needed()
            page.screenshot(path=".jules/verification/videoplayer_optimized.png")

        except Exception as e:
            print(f"Verification FAILED with error: {e}")

        finally:
            browser.close()

if __name__ == "__main__":
    verify_videoplayer_poster()
