import {Client} from 'basic-ftp'
import {lstatSync, readdirSync, readFileSync, writeFileSync} from 'fs'

console.log("Uploading files")
const client = new Client()
client.ftp.verbose = true

const includePaths = [
    "dist:/",
    // "api:/api",
    "nginx.conf:/nginx.conf",
]

try {
    await client.access({
        host: "panel.mardens.com",
        user: "ftp_new_inv_mardens_com",
        password: "hH4s32i7FRDrkSEf"
    })

    const jsFiles = readdirSync("dist", {recursive: true}).filter(i => i.endsWith(".js"))

    for (const file of jsFiles) {
        const path = `dist/${file}`
        const data = readFileSync(path, "utf8")
        const newData = data.replace(/http:\/\/new.inv.local\//g, "/")
        writeFileSync(path, newData, "utf8")
    }

    for (const include of includePaths) {
        const [path, remotePath] = include.split(":")
        const isDirectory = lstatSync(path).isDirectory();

        if (isDirectory) {
            try {
                // Always delete the assets directory before uploading
                if (remotePath === "/") {
                    await client.removeDir(`${remotePath}assets`)
                } else {
                    await client.removeDir(remotePath)
                }
            } catch (err) {
                console.error(err)
            }
            try {
                await client.uploadFromDir(path, remotePath)
            } catch (err) {
                console.error(err)
            }
        } else {
            try {
                await client.remove(remotePath)
            } catch (err) {
                console.error(err)
            }
            try {
                await client.uploadFrom(path, remotePath)
            } catch (err) {
                console.error(err)
            }
        }
    }

} catch (err) {
    console.log(err)
}
client.close()