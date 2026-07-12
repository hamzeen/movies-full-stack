import { describe, expect, it } from "vitest";
import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
    it.each([
        ["PT2H35M", "2 hours: 35 mins"],
        ["PT1H1M", "1 hour: 1 min"],
        ["PT45M", "45 mins"],
        ["PT2H", "2 hours"],
        ["PT0H0M", "0 mins"],
    ])("formats %s as %s", (duration, expected) => {
        expect(formatDuration(duration)).toBe(expected);
    });

    it("returns unsupported duration values unchanged", () => {
        expect(formatDuration("135 minutes")).toBe("135 minutes");
    });
});
