//@ts-check
const { join } = require("node:path");
const { performance } = require("perf_hooks");
const {
    runDotNet,
    runNx,
    useConsolePerformanceObserver,
    clearBuildCacheAndNxCache,
    writePerformanceMeasuresToMd,
} = require("./utils");

const ITERATIONS = 50;

useConsolePerformanceObserver();

clearBuildCacheAndNxCache();
performance.mark("START NX (API)");
for (let iter = 0; iter < ITERATIONS; iter++) {
    runNx("build api");
    console.log(`Nx Iteration: ${iter}`);
}
performance.mark("END NX (API)");
performance.measure("Nx Time (API)", "START NX (API)", "END NX (API)");

clearBuildCacheAndNxCache();
performance.mark("START DOTNET (API)");
for (let iter = 0; iter < ITERATIONS; iter++) {
    runDotNet("build Api");
    console.log(`.NET Iteration: ${iter}`);
}
performance.mark("END DOTNET (API)");
performance.measure(".NET Time (API)", "START DOTNET (API)", "END DOTNET (API)");

performance.mark("START NX (ALL)");
for (let iter = 0; iter < ITERATIONS; iter++) {
    runNx("run-many --target build");
    console.log(`Nx Iteration: ${iter}`);
}
performance.mark("END NX (ALL)");
performance.measure("Nx Time (ALL)", "START NX (ALL)", "END NX (ALL)");

clearBuildCacheAndNxCache();
performance.mark("START DOTNET (ALL)");
for (let iter = 0; iter < ITERATIONS; iter++) {
    runDotNet("build");
    console.log(`.NET Iteration: ${iter}`);
}
performance.mark("END DOTNET (ALL)");
performance.measure(".NET Time (ALL)", "START DOTNET (ALL)", "END DOTNET (ALL)");

writePerformanceMeasuresToMd(
    join(__dirname, `benchmark_results_${process.arch}.md`)
);
