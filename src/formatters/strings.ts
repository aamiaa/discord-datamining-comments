import { BuildDiffType, BuildStringDiff } from "../types.js";

export function formatStrings(diff: BuildStringDiff[]) {
	const stringParts: string[] = []

	const added = diff.filter(x => x.type === BuildDiffType.ADDED)
	const changed = diff.filter(x => x.type === BuildDiffType.CHANGED)
	const removed = diff.filter(x => x.type === BuildDiffType.REMOVED)

	if(added.length > 0) {
		stringParts.push("# Added\n" + added.map(x => `+ ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
	}
	if(changed.length > 0) {
		stringParts.push("# Updated\n" + changed.map(x => `- ${x.key}: ${JSON.stringify(x.old_value)}\n+ ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
	}
	if(removed.length > 0) {
		stringParts.push("# Removed\n" + removed.map(x => `- ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
	}

	return "## Strings\n```diff\n" + stringParts.join("\n\n") + "\n```"
}