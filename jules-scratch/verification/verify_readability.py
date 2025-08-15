import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for console events and print them
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text()}"))

        # Get the absolute path to the HTML file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, 'index.html')

        # Use wait_until='networkidle' to give fonts a chance to load
        await page.goto(f'file://{file_path}', wait_until='networkidle')

        # Locate the "Topics" section
        topics_section = page.locator("section#latest")

        # Scroll this section into view
        await topics_section.scroll_into_view_if_needed()

        # Wait for animations to complete by waiting for the last card
        await topics_section.locator("article.article-card").last.wait_for(state="visible")

        # Take a screenshot of just the topics section
        screenshot_path = 'jules-scratch/verification/readability_improvements.png'
        await topics_section.screenshot(path=screenshot_path)

        await browser.close()
        print(f"Screenshot saved to {screenshot_path}")

if __name__ == '__main__':
    asyncio.run(main())
