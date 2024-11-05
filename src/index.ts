const { Octokit } = await import("@octokit/core")
import axios from "axios"
import "dotenv/config"
import fs from "fs"
import formatMessage from "./format.js"
import { BuildDiff } from "./types.js"

const octokit = new Octokit({auth: process.env.GITHUB_TOKEN})

function getLastHash(): string {
	return fs.readFileSync("last.dat").toString()
}

function setLastHash(hash: string) {
	fs.writeFileSync("last.dat", hash)
}

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
	console.log("Checking...")
	
	const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
		owner: "Discord-Datamining",
		repo: "Discord-Datamining"
	})
	
	const builds = commits.data.map(x => ({
		sha: x.sha,
		build_hash: x.commit.message.match(/Build \d+ \(([0-9a-f]{40})\)/)[1],
	}))
	
	const lastHash = getLastHash()
	const idx = builds.findIndex(x => x.build_hash === lastHash)
	if(idx < 0) {
		throw new Error("Last hash " + lastHash + " is not in the list of commits")
	}
	if(idx === builds.length - 1) {
		throw new Error("Last hash is at the end of the commits list, which is currently unsupported")
	}

	if(idx === 0) {
		console.log("No new builds")
		return
	}

	console.log(idx, "new build(s)")

	const newBuilds = builds.slice(0, idx + 1).reverse()
	for(let i=1;i<newBuilds.length;i++) {
		const previous = newBuilds[i-1]
		const current = newBuilds[i]

		console.log("Previous:", previous.build_hash, "current:", current.build_hash)

		const res = await axios.get(`https://nelly.tools/api/private/builds/app/diff/${previous.build_hash}/${current.build_hash}`, {
			headers: {
				Authorization: process.env.NELLY_API_KEY
			}
		})
		if(!res.data.success) {
			throw new Error(res.data.error)
		}

		const diff = res.data.data as BuildDiff
		const commentMsg = formatMessage(diff, {
			strings: true,
			experiments: true
		})
		if(commentMsg) {
			console.log(commentMsg)
			// TODO: post comment
		}

		setLastHash(current.build_hash)
	}

}

while(true) {
	try {
		await main()
	} catch(ex) {
		console.error(ex)
	}
	await sleep(5 * 60 * 1000)
}