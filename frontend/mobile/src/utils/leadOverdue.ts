/**
 * Returns true if a lead has been in Follow-up for more than 48 hours
 * without being moved to a terminal status (CONVERTED / NOT_CONVERTED).
 *
 * The 48-hour clock starts from when the dealer purchased/unlocked the lead
 * (`purchasedAt`), NOT from when the lead was created.
 */

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

// Statuses that count as "closed" and should not be flagged as overdue
const TERMINAL_STATUSES = ['CONVERTED', 'NOT_CONVERTED', 'CLOSED', 'REJECTED'];

export function isLeadOverdue(lead: {
    purchasedAt?: string | null;
    status?: string;
}): boolean {
    if (!lead.purchasedAt) return false;
    if (TERMINAL_STATUSES.includes(lead.status ?? '')) return false;

    const elapsed = Date.now() - new Date(lead.purchasedAt).getTime();
    return elapsed > FORTY_EIGHT_HOURS_MS;
}
