export interface BuildDiff {
	strings_diff: BuildStringDiff[],
	endpoints_diff: BuildEndpointDiff[],
	experiments_diff: BuildExperimentDiff[],
	apex_experiments_diff: BuildApexExperimentDiff[]
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

interface BuildObjectDiff<T> {
	type: BuildDiffType,
	value: T
	old_value?: T
}

export type BuildExperimentDiff = BuildObjectDiff<ASTExperiment>
export type BuildApexExperimentDiff = BuildObjectDiff<ASTApexExperiment>

export interface ASTExperiment {
	kind: ExperimentType,
	id: string,
	label: string,
	treatments: {
		id: number,
		label: string
	}[]
}

export interface ASTApexExperiment {
	name: string,
	kind: ExperimentType,
	variations: Record<number, Record<string, number | string | boolean>>
}

export enum ExperimentType {
	USER = "user",
	GUILD = "guild"
}