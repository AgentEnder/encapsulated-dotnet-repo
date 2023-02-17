//@ts-check
const { PerformanceObserver, performance } = require("node:perf_hooks");
const { execSync } = require("node:child_process");
const { join } = require("node:path");
const { rmSync, writeFileSync } = require("node:fs");

/**
 * @type {import('node:child_process').ExecSyncOptions}
 */
const execSyncOptions = { cwd: join(__dirname, ".."), stdio: "ignore" };

function useConsolePerformanceObserver() {
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            console.log(
                `Time for '${entry.name}'`,
                formatMsToReadableTime(entry.duration)
            );
        }
    });
    performanceObserver.observe({ entryTypes: ["measure"] });
}

function writePerformanceMeasuresToMd(fileName) {
    const measures = performance.getEntriesByType("measure");
    const cellSize = 20;
    /**
     * @type {string[][]}
     */
    const tableCells = [
        ["Measure", "Time (ms)", "Time (Readable)"].map((x) =>
            x.padEnd(cellSize)
        ),
        ["-".repeat(cellSize), "-".repeat(cellSize)],
        ...measures.map((e) => [
            e.name,
            e.duration.toFixed(4),
            formatMsToReadableTime(e.duration),
        ]),
    ];
    const tableContents = tableCells
        .map(
            (row) =>
                "| " +
                row.map((cell) => cell.padEnd(cellSize)).join(" | ") +
                " |"
        )
        .join("\n");

    writeFileSync(
        fileName,
        `# Benchmark Results (${new Date().toISOString()})

${tableContents}`
    );
}

/**
 * @param {string} s
 */
const runNx = (s) => {
    if (process.platform === "win32") {
        return execSync(`./nx.bat ${s}`, execSyncOptions);
    }
    return execSync(`./nx ${s}`, execSyncOptions);
};

/**
 * @param {string} s
 */
const runDotNet = (s) => {
    return execSync(`dotnet ${s}`, execSyncOptions);
};

function clearBuildCacheAndNxCache() {
    runNx("reset");
    rmSync("dist", { recursive: true, force: true });
}

/**
 * @param {number} ms
 */
function formatMsToReadableTime(ms) {
    const secondsFactor = 1000;
    const minutesFactor = secondsFactor * 60;
    const hoursFactor = minutesFactor * 60;
    const hours = Math.floor(ms / hoursFactor);
    const minutes = Math.floor((ms - hours * hoursFactor) / minutesFactor);
    const seconds = Math.floor(
        (ms - hours * hoursFactor - minutes * minutesFactor) / secondsFactor
    );
    const fractional = Math.floor(
        ms -
            hours * hoursFactor -
            minutes * minutesFactor -
            seconds * secondsFactor
    );
    const parts = [];
    if (hours) {
        parts.push(`${hours}h`);
    }
    if (minutes) {
        parts.push(`${minutes}m`);
    }
    parts.push(`${seconds}.${fractional}s`);
    return parts.join(" ");
}

module.exports = {
    runNx,
    runDotNet,
    clearBuildCacheAndNxCache,
    useConsolePerformanceObserver,
    writePerformanceMeasuresToMd,
};
