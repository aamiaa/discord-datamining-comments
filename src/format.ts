import { ASTExperiment, BuildDiffType, BuildDiff } from "./types.js";

export default function formatMessage(diff: BuildDiff, options: {strings?: boolean, endpoints?: boolean, experiments?: boolean}): string {
	const mainParts: string[] = []

	if(options.strings && diff.strings_diff.length > 0) {
		const stringParts: string[] = []

		const added = diff.strings_diff.filter(x => x.type === BuildDiffType.ADDED)
		const changed = diff.strings_diff.filter(x => x.type === BuildDiffType.CHANGED)
		const removed = diff.strings_diff.filter(x => x.type === BuildDiffType.REMOVED)

		if(added.length > 0) {
			stringParts.push("# Added\n" + added.map(x => `+ ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
		}
		if(changed.length > 0) {
			stringParts.push("# Updated\n" + changed.map(x => `- ${x.key}: ${JSON.stringify(x.old_value)}\n+ ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
		}
		if(removed.length > 0) {
			stringParts.push("# Removed\n" + removed.map(x => `- ${x.key}: ${JSON.stringify(x.value)}`).join("\n"))
		}

		mainParts.push("## Strings\n```diff\n" + stringParts.join("\n\n") + "\n```")
	}

	if(options.endpoints && diff.endpoints_diff.length > 0) {
		// TODO, not needed for now
	}

	if(options.experiments && diff.experiments_diff.length > 0) {
		const addedExps = []
		const removedExps = []
		const updatedExps = []

		const expAdditions = diff.experiments_diff.filter(x => x.type === BuildDiffType.ADDED || x.type === BuildDiffType.REMOVED)
		const expUpdates = diff.experiments_diff.filter(x => x.type === BuildDiffType.CHANGED)
		for(const change of expAdditions) {
			switch(change.type) {
				case BuildDiffType.ADDED:
					addedExps.push(
						`+ ${change.value.id} (${change.value.label}, ${change.value.kind})` +
						"\n * Control" +
						change.value.treatments.map(x => "\n * Treatment " + x.id + ": " + x.label).join("")
					)
					break
				case BuildDiffType.REMOVED:
					removedExps.push(
						`- ${change.value.id} (${change.value.label}, ${change.value.kind})` +
						"\n * Control" +
						change.value.treatments.map(x => "\n * Treatment " + x.id + ": " + x.label).join("")
					)
					break
			}
		}
		for(const change of expUpdates) {
			let changes = []

			if(change.value.label !== change.old_value.label) {
				changes.push(
					"# Updated Title\n" +
					`- ${change.old_value.label}\n+ ${change.value.label}\n`
				)
			}

			const newTreatments = change.value.treatments.filter(x => !change.old_value.treatments.find(y => y.id === x.id))
			const removedTreatments = change.old_value.treatments.filter(x => !change.value.treatments.find(y => y.id === x.id))
			const updatedTreatments: {old: ASTExperiment["treatments"][0], new: ASTExperiment["treatments"][0]}[] = []
			change.value.treatments.forEach(x => {
				let old = change.old_value.treatments.find(y => y.id === x.id)
				if(old && old.label !== x.label) {
					updatedTreatments.push({
						old,
						new: x
					})
				}
			})

			if(newTreatments.length > 0) {
				changes.push(
					"# New Treatments\n" +
					newTreatments.map(x => "+ Treatment " + x.id + ": " + x.label).join("\n")
				)
			}
			if(removedTreatments.length > 0) {
				changes.push(
					"# Removed Treatments\n" +
					removedTreatments.map(x => "- Treatment " + x.id + ": " + x.label).join("\n")
				)
			}
			if(updatedTreatments.length > 0) {
				changes.push(
					"# Updated Treatments\n" +
					updatedTreatments.map(x => "- Treatment " + x.old.id + ": " + x.old.label + "\n+ Treatment " + x.new.id + ": " + x.new.label).join("\n\n")
				)
			}

			if(changes.length > 0) {
				updatedExps.push(
					"### " + change.value.id + "\n" +
					"```diff\n" +
					changes.join("\n") +
					"\n```"
				)
			}
		}

		if(addedExps.length > 0) {
			mainParts.push(
				"## New Experiments\n" +
				"```diff\n" +
				addedExps.join("\n") +
				"\n```"
			)
		}
		if(removedExps.length > 0) {
			mainParts.push(
				"## Removed Experiments\n" +
				"```diff\n" +
				removedExps.join("\n") +
				"\n```"
			)
		}
		if(updatedExps.length > 0) {
			mainParts.push(
				"## Experiment Changes\n" +
				updatedExps.join("\n")
			)
		}
	}

	if(mainParts.length > 0) {
		return mainParts.join("\n")
	}
	return null
}