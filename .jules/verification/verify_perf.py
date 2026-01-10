from playwright.sync_api import sync_playwright

def verify_performance_layout(page):
    # Go to homepage
    page.goto("http://localhost:4321")

    # 1. Verify containment on Navigation (Desktop)
    # Use .first to resolve strict mode violation (desktop vs mobile menu)
    nav = page.locator("nav[aria-label='Menu principal'] ul").first
    style = nav.get_attribute("style")
    print(f"Navigation style: {style}")
    assert "contain: layout" in style

    # 2. Verify containment on SocialIcon
    # Target social icons in footer specifically
    social_icon = page.locator("footer a[href^='https']").first
    style_icon = social_icon.get_attribute("style")
    print(f"SocialIcon style: {style_icon}")
    assert "contain: layout style" in style_icon

    # 3. Verify containment on #scroll-sentinel
    sentinel = page.locator("#scroll-sentinel")
    style_sentinel = sentinel.get_attribute("style")
    print(f"Sentinel style: {style_sentinel}")
    assert "contain: strict" in style_sentinel

    # 4. Verify containment on #main-content
    main = page.locator("#main-content")
    style_main = main.get_attribute("style")
    print(f"Main content style: {style_main}")
    assert "contain: layout" in style_main

    # Take screenshot of footer where social icons are
    footer = page.locator("footer")
    footer.scroll_into_view_if_needed()
    page.screenshot(path=".jules/verification/performance-check.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_performance_layout(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
        finally:
            browser.close()
