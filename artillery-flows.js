const BASE_URL = 'https://yearn-fi-sigma.vercel.app';
let urls = [];

// Fetch top 100 vaults by TVL on module load
async function initializeUrls() {
  const response = await fetch('https://kong.yearn.fi/api/gql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'query { vaults { address tvl { close } } }'
    })
  });

  if (!response.ok) {
    throw new Error(`Kong API failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.data?.vaults) {
    throw new Error('Invalid response from Kong API');
  }

  // Sort by TVL descending and take top 100
  const topVaults = data.data.vaults
    .filter(v => v.tvl?.close != null)
    .sort((a, b) => b.tvl.close - a.tvl.close)
    .slice(0, 100);

  // Build URLs from vault addresses with weights
  // Individual vaults: weight 1 each
  const vaultUrls = topVaults.map(v => ({ url: `/vaults/1/${v.address}`, weight: 1 }));

  // High-traffic pages: higher weights
  const highTrafficPages = [
    { url: '/index.html', weight: 20 },        // Homepage gets 20x more traffic
    // { url: '/', weight: 20 },        // Homepage gets 20x more traffic
    // { url: '/v3', weight: 10 },      // V3 page gets 10x more traffic
    // { url: '/vaults', weight: 10 }   // Vaults page gets 10x more traffic
  ];

  urls = [...highTrafficPages];
  // urls = [...highTrafficPages, ...vaultUrls];

  console.log(`Loaded ${urls.length} weighted URLs from GraphQL API`);
}

// Initialize URLs on first access
let initPromise = null;

function ensureInitialized() {
  if (!initPromise) {
    initPromise = initializeUrls();
  }
  return initPromise;
}

function selectWeightedUrl() {
  // Weighted random selection
  const totalWeight = urls.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of urls) {
    random -= item.weight;
    if (random <= 0) {
      return item.url;
    }
  }

  return '/'; // Fallback
}

function randomString(length) {
  return Math.random().toString(36).substring(2, 2 + length);
}

function getRandomUrlPath() {
  return `/index.html?${randomString(10)}`;
}

async function loadRandomPage(page) {
  // Ensure URLs are loaded before selecting
  await ensureInitialized();

  // const path = selectWeightedUrl();
  const path = getRandomUrlPath();
  const url = `${BASE_URL}${path}`;

  console.log(`navigating ${url}`);

  // Navigate to the page - use 'load' instead of 'networkidle'
  // 'load' waits for the page load event, but doesn't wait for all background requests
  await page.goto(url, {
    waitUntil: 'load',
    timeout: 60000 // 60 second timeout
  });

  // Give the page a bit more time to settle
  await page.waitForTimeout(3000);
}

async function headRequestOnly(page) {
  await ensureInitialized();

  const path = getRandomUrlPath();
  const url = `${BASE_URL}${path}`;

  console.log(`HEAD request to ${url}`);

  // Generate random payload as headers to simulate 1KB request size
  // Production shows ~1024 bytes per request incoming
  const randomPayload = randomString(512); // 512 chars ≈ 512 bytes
  const randomPayload2 = randomString(512);

  // Make HEAD request with extra headers to inflate request size
  const response = await page.request.head(url, {
    headers: {
      'X-Random-Payload-1': randomPayload,
      'X-Random-Payload-2': randomPayload2,
      'X-Test-Source': 'artillery-load-test'
    }
  });

  console.log(`HEAD response status: ${response.status()}`);
}

module.exports = {
  loadRandomPage,
  headRequestOnly
};
