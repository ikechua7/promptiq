const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export interface TrialState {
  installedAt: number;
  licensed: boolean;
  licenceKey: string;
}

export async function getTrialState(): Promise<TrialState> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["installedAt", "licensed", "licenceKey"], (data) => {
      const now = Date.now();
      if (!data.installedAt) {
        chrome.storage.local.set({ installedAt: now });
        resolve({ installedAt: now, licensed: false, licenceKey: "" });
      } else {
        resolve({
          installedAt: data.installedAt as number,
          licensed: (data.licensed as boolean) ?? false,
          licenceKey: (data.licenceKey as string) ?? "",
        });
      }
    });
  });
}

export function isTrialExpired(installedAt: number): boolean {
  return Date.now() - installedAt > THREE_DAYS_MS;
}

export function daysRemaining(installedAt: number): number {
  const elapsed = Date.now() - installedAt;
  return Math.max(0, Math.ceil((THREE_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000)));
}

// Basic UUID v4 format check — Lemon Squeezy licence keys are UUID v4
export function isValidKeyFormat(key: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key.trim());
}

export async function activateLicence(key: string): Promise<boolean> {
  const valid = isValidKeyFormat(key);
  if (valid) {
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ licensed: true, licenceKey: key.trim() }, resolve);
    });
  }
  return valid;
}
