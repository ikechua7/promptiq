const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export type LicenceTier = "individual" | "team" | "business" | "enterprise";

export interface TrialState {
  installedAt: number;
  licensed: boolean;
  licenceKey: string;
  tier: LicenceTier | null;
}

const TIER_MAP: Record<string, LicenceTier> = {
  IND: "individual",
  TEM: "team",
  BIZ: "business",
  ENT: "enterprise",
};

const TIER_LABELS: Record<LicenceTier, string> = {
  individual: "Individual",
  team:       "Team (5 seats)",
  business:   "Business (20 seats)",
  enterprise: "Enterprise",
};

const TIER_SEATS: Record<LicenceTier, number> = {
  individual: 1,
  team:       5,
  business:   20,
  enterprise: Infinity,
};

export function getTierLabel(tier: LicenceTier): string {
  return TIER_LABELS[tier];
}

export function getTierSeats(tier: LicenceTier): number {
  return TIER_SEATS[tier];
}

// Key format: PIQ-{IND|TEM|BIZ|ENT}-{UUID4}
// Example: PIQ-TEM-3f4a1b2c-5d6e-4f7a-8b9c-0d1e2f3a4b5c
const KEY_REGEX = /^PIQ-(IND|TEM|BIZ|ENT)-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseLicenceKey(key: string): { valid: boolean; tier: LicenceTier | null } {
  const trimmed = key.trim().toUpperCase();
  const match = trimmed.match(/^PIQ-(IND|TEM|BIZ|ENT)-/);
  if (!KEY_REGEX.test(trimmed) || !match) return { valid: false, tier: null };
  return { valid: true, tier: TIER_MAP[match[1]] };
}

export async function getTrialState(): Promise<TrialState> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["installedAt", "licensed", "licenceKey", "tier"], (data) => {
      const now = Date.now();
      const installedAt =
        typeof data.installedAt === "number" && isFinite(data.installedAt)
          ? data.installedAt
          : now;
      if (!data.installedAt) chrome.storage.local.set({ installedAt: now });
      resolve({
        installedAt,
        licensed:   data.licensed === true,
        licenceKey: typeof data.licenceKey === "string" ? data.licenceKey : "",
        tier:       (["individual","team","business","enterprise"] as LicenceTier[]).includes(data.tier)
                      ? data.tier as LicenceTier
                      : null,
      });
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

export async function activateLicence(key: string): Promise<{ success: boolean; tier: LicenceTier | null; error?: string }> {
  const { valid, tier } = parseLicenceKey(key);
  if (!valid || !tier) {
    return { success: false, tier: null, error: "Invalid key — check your purchase confirmation email." };
  }
  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ licensed: true, licenceKey: key.trim(), tier }, resolve);
  });
  return { success: true, tier };
}
