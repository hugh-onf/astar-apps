import { expect, test } from '@playwright/test';
import { checkIsLightClient } from 'src/config/api/polkadot/connectApi';
import { endpointKey } from 'src/config/chainEndpoints';
import { providerEndpoints } from 'src/config/chainEndpoints';

test.beforeEach(async ({ page }) => {
  await page.goto('/astar/dashboard');
});

test.describe('on dashboard screen', () => {
  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
  });
  test('DocsBot AI answers inputted questions', async ({ page }) => {
    const widget = page.locator('.docsbot-chat-container');
    const botButton = page.locator('.floating-button');
    await botButton.click();
    await page.getByPlaceholder('Send a message...').fill('What is the decimals of ASTR token?');
    await page.locator('.docsbot-chat-btn-send').click();
    await expect(widget.getByText('18')).toBeVisible();
  });
  test('Endpoint has been selected randomly', async ({ page }) => {
    const isAppliedRandomEndpoint = await page.evaluate(() => {
      return localStorage.getItem('isAppliedRandomEndpoint');
    });
    const selectedEndpointObj: string = (await page.evaluate(() => {
      return localStorage.getItem('selectedEndpoint');
    })) as string;
    const selectedEndpoint = JSON.parse(selectedEndpointObj)[0];
    const isSomeOfAstarEndpoints = providerEndpoints[endpointKey.ASTAR].endpoints.some(
      (it) => it.endpoint === selectedEndpoint
    );
    const isLightClient = checkIsLightClient(selectedEndpoint);

    expect(isAppliedRandomEndpoint).toBe('true');
    expect(isSomeOfAstarEndpoints).toBe(true);
    expect(isLightClient).toBe(false);
  });
});
