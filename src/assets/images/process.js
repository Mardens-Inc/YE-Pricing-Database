import fs from 'fs';
import path from 'path';
import {spawn} from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);

const files = fs.readdirSync(__dirname, {recursive: true});
files.filter(i => i.endsWith('.jpg')).forEach(async file => {
    spawn("ffmpeg", ["-y", "-i", file, "-vf", "scale=150:-1", path.join(__dirname, path.basename(file).replace(".jpg", ".webp"))]);
});