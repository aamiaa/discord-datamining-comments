export interface BuildDiff {
	strings_diff: BuildStringDiff[],
	endpoints_diff: BuildEndpointDiff[],
	experiments_diff: BuildExperimentDiff[]
}

export interface BuildString {
	key: string,
	value: string,
}

export interface BuildStringDiff extends BuildString {
	type: BuildDiffType,
	old_value?: string
}

export enum BuildDiffType {
	ADDED = "added",
	REMOVED = "removed",
	CHANGED = "changed"
}

export interface BuildEndpoint {
	key: string,
	path: string
}

export interface BuildEndpointDiff extends BuildEndpoint {
	type: BuildDiffType,
	old_path?: string
}

export interface BuildExperimentDiff {
	type: BuildDiffType,
	value: ASTExperiment
	old_value?: ASTExperiment
}

export interface ASTExperiment {
	kind: ExperimentType,
	id: string,
	label: string,
	treatments: {
		id: number,
		label: string
	}[]
}

export enum ExperimentType {
	USER = "user",
	GUILD = "guild"
}