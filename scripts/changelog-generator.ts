import fs from 'fs'
import path from 'path'
import { Url } from 'url'

const __filename = new URL(process.argv[1]).pathname
const __dirname = path.dirname(__filename)

function getChangelogPath() {
    return path.resolve(__dirname, '../CHANGELOG.md')
}

function ensureChangelogFile() {
    const changelogPath = getChangelogPath()
    if (!fs.existsSync(changelogPath)) {
        fs.writeFileSync(changelogPath, '')
    }
}

function writeChangelog(content: string) {
    const changelogPath = getChangelogPath()
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8')
    fs.writeFileSync(changelogPath, content + changelogContent)
}

function generateChangelog() {
    ensureChangelogFile()
    const changelogPath = getChangelogPath()
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8')
    const changelog = changelogContent.split('\n')
    const changelogHeader = changelog[0]
    const changelogBody = changelog.slice(1)
    const changelogBodyWithVersion = changelogBody.map(line => {
        if (line.startsWith('## ')) {
            return line.replace('## ', '## v')
        }
        return line
    })
    const changelogBodyWithVersionString = changelogBodyWithVersion.join('\n')
    const changelogString = changelogHeader + '\n' + changelogBodyWithVersionString
    writeChangelog(changelogString)
    console.log('changelog generated')
    return changelogString
}

function main() {
    const changelog = generateChangelog()
    console.log(changelog)
}

main();
