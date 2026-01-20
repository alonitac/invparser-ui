import unittest
from playwright.sync_api import sync_playwright
from playwright.sync_api import expect
import re
import os

APP_URL = os.getenv('APP_URL', 'http://localhost:3000')
HEADLESS = bool(os.getenv('HEADLESS', False))


class TestInvParserUI(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Set up the browser once for all tests in this class."""
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=HEADLESS)  # headless=False to see the browser
        
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after all tests are done."""
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self):
        """Set up before each test method."""
        self.context = self.browser.new_context()
        # Start tracing before creating the page
        self.context.tracing.start(screenshots=True, snapshots=True, sources=True)
        self.page = self.browser.new_page()

    def tearDown(self):
        """Clean up after each test method."""
        # Stop tracing and save it into a zip file
        self.context.tracing.stop(path="trace.zip")
        self.context.close()
    
    def test_valid_login(self):
        """Test that the page title is correct."""

        self.page.goto(APP_URL)

        username = self.page.locator('#username')
        password = self.page.locator('#password')

        username.fill('admin')
        password.fill('admin')

        self.page.get_by_role('button', name='Sign In').click()

        expect(self.page).to_have_url(re.compile('.*/dashboard'))


 


if __name__ == "__main__":
    unittest.main()