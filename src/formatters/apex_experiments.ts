import { BuildDiffType, BuildApexExperimentDiff } from "../types.js";

export function formatApexExperiments(diff: BuildApexExperimentDiff[]) {
	const strParts = []

	const addedExps = []
	const removedExps = []

	const expAdditions = diff.filter(x => x.type === BuildDiffType.ADDED || x.type === BuildDiffType.REMOVED)
	const expUpdates = diff.filter(x => x.type === BuildDiffType.CHANGED)
	for(const change of expAdditions) {
		switch(change.type) {
			case BuildDiffType.ADDED:
				addedExps.push(
					`+ ${change.value.name} (${change.value.kind})` +
					Object.keys(change.value.variations).map(x => "\n * Variant " + x).join("")
				)
				break
			case BuildDiffType.REMOVED:
				removedExps.push(
					`- ${change.value.name} (${change.value.kind})` +
					Object.keys(change.value.variations).map(x => "\n * Variant " + x).join("")
				)
				break
		}
	}
	for(const change of expUpdates) {
		let changes = []

		const newVariants = Object.keys(change.value.variations).filter(x => !Object.keys(change.old_value.variations).includes(x))
		const removedVariants = Object.keys(change.old_value.variations).filter(x => !Object.keys(change.value.variations).includes(x))

		if(newVariants.length > 0) {
			changes.push(
				"# New Variants\n" +
				newVariants.map(x => "+ Variant " + x).join("\n")
			)
		}
		if(removedVariants.length > 0) {
			changes.push(
				"# Removed Variants\n" +
				removedVariants.map(x => "- Variant " + x).join("\n")
			)
		}
	}

	if(addedExps.length > 0) {
		strParts.push(
			"## New Apex Experiments\n" +
			"```diff\n" +
			addedExps.join("\n") +
			"\n```"
		)
	}
	if(removedExps.length > 0) {
		strParts.push(
			"## Removed Apex Experiments\n" +
			"```diff\n" +
			removedExps.join("\n") +
			"\n```"
		)
	}

	return strParts.join("\n")
}