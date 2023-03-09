# Nx w/ .NET and C# under `.nx`

Hello! This repo is a demo of Nx, installed under the `.nx` directory. For more information on the feature, see: https://nx.dev/more-concepts/nx-and-the-wrapper

## Running Commands

To build a project, you can use `nx build`. If you are on windows, this would look like `./nx.bat build {project}`. If you are on a unix system, you can use `./nx build {project}`. If you are inside of a project's directory, you can use Nx without specifying the project name. E.g. `../nx build` would work inside of the Api directory.

You can run tests with `nx test`, or run the project with `nx serve` similarly.

## Caching

Nx caches any build or terminal outputs in the .nx/cache folder. This cache is used to retrieve existing artifacts rather than rerunning the command if possible.

## Benchmark

A simple benchmark is provided in the `benchmark` folder. You can run it yourself with `node benchmark`. The results are not necessarily super fair to the `dotnet` CLI, as it doesn't provide a holistic cache for builds. If you update the benchmark to change Api/Program.cs slightly (adding a comment or similar) in between each build, the results are nearly identical between Nx and `dotnet`.

Nonetheless, in a monorepo containing more than 1 application, the benchmark would be representative of if only the other app was changed. In CI, you still check if both build. The caching Nx provides would make building the non-changed app
- Unnecessary if using affected
- Nearly instant if it runs anyways.

The benchmark runs the build command against the API project 50 times, as well as against the whole solution 50 times. All cache and build intermediates are cleared in between each category measure running.

Sample results are included below, but I'd encourage running the benchmark on your own machine as well.

| Measure              | Time (ms)            | Time (Readable)      |
| -------------------- | -------------------- | -------------------- |
| Nx Time (API)        | 21260.8221           | 21.260s              |
| .NET Time (API)      | 89773.4468           | 1m 29.773s           |
| Nx Time (ALL)        | 19773.0107           | 19.773s              |
| .NET Time (ALL)      | 86934.3048           | 1m 26.934s           |