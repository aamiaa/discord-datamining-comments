import { formatApexExperiments } from "./formatters/apex_experiments.js";
import { formatExperiments } from "./formatters/experiments.js";
import { formatStrings } from "./formatters/strings.js";
import { BuildDiff } from "./types.js";

export default function formatMessage(diff: BuildDiff, options: {strings?: boolean, endpoints?: boolean, experiments?: boolean, apex_experiments?: boolean}): string {
	const mainParts: string[] = []

	if(options.strings && diff.strings_diff.length > 0) {
		mainParts.push(formatStrings(diff.strings_diff))
	}

	if(options.endpoints && diff.endpoints_diff.length > 0) {
		// TODO, not needed for now
	}

	if(options.experiments && diff.experiments_diff.length > 0) {
		mainParts.push(formatExperiments(diff.experiments_diff))
	}

	if(options.apex_experiments && diff.apex_experiments_diff.length > 0) {
		mainParts.push(formatApexExperiments(diff.apex_experiments_diff))
	}

	if(mainParts.length > 0) {
		return mainParts.join("\n")
	}
	return null
}