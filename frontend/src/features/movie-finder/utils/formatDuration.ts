export function formatDuration(duration: string): string {
    const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);

    if (!match) {
        return duration;
    }

    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);

    if (hours === 0 && minutes === 0) {
        return "0 mins";
    }

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
    }

    return parts.join(": ");
}
