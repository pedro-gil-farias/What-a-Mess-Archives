// Turns an approved specimen-submission issue into files and a specimens.json entry.
import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises';
import { appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { lookup } from 'node:dns/promises';
import net from 'node:net';

const SPECIMENS_JSON = 'Specimens/specimens.json';
const MODELS_DIR = 'Specimens/models';
const IMAGES_DIR = 'Specimens/images';
const MAX_MODEL_BYTES = 200 * 1024 * 1024;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
// Test hook: lets a local http server stand in for a public host.
const ALLOW_LOCAL = process.env.INGEST_ALLOW_LOCAL === '1';

function fail(message) {
    throw new Error(message);
}

function parseIssueForm(body) {
    const fields = {};
    for (const section of body.split(/^### /m).slice(1)) {
        const newline = section.indexOf('\n');
        const label = section.slice(0, newline).trim();
        const value = section.slice(newline + 1).trim();
        fields[label] = value === '_No response_' ? '' : value;
    }
    return fields;
}

function cleanText(value, maxLength) {
    return value.replace(/<[^>]*>/g, '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isPrivateAddress(address) {
    if (net.isIPv4(address)) {
        const [a, b] = address.split('.').map(Number);
        return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) ||
            (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224;
    }
    const lower = address.toLowerCase();
    return lower === '::1' || lower === '::' || lower.startsWith('fc') ||
        lower.startsWith('fd') || lower.startsWith('fe80') || lower.startsWith('::ffff:');
}

function normalizeShareLink(rawUrl) {
    const url = new URL(rawUrl);
    if (/(^|\.)dropbox\.com$/.test(url.hostname)) {
        url.searchParams.delete('dl');
        url.searchParams.set('dl', '1');
    }
    const drive = url.hostname === 'drive.google.com' && url.pathname.match(/\/file\/d\/([^/]+)/);
    if (drive) {
        return `https://drive.google.com/uc?export=download&id=${drive[1]}`;
    }
    return url.toString();
}

async function assertSafeUrl(url) {
    if (!ALLOW_LOCAL && url.protocol !== 'https:') fail(`Link must use https: ${url.origin}`);
    if (ALLOW_LOCAL) return;
    const records = await lookup(url.hostname, { all: true });
    if (records.some((record) => isPrivateAddress(record.address))) {
        fail(`Link points to a private address: ${url.hostname}`);
    }
}

async function download(rawUrl, maxBytes) {
    let url;
    try {
        url = new URL(normalizeShareLink(rawUrl));
    } catch {
        fail(`Not a valid link: ${rawUrl}`);
    }

    // Redirects are followed manually so every hop is checked.
    for (let hop = 0; hop < 5; hop++) {
        await assertSafeUrl(url);
        const response = await fetch(url, { redirect: 'manual' });
        if (response.status >= 300 && response.status < 400 && response.headers.get('location')) {
            url = new URL(response.headers.get('location'), url);
            continue;
        }
        if (!response.ok) fail(`Download failed (${response.status}) for ${url.origin}`);

        const declared = Number(response.headers.get('content-length') || 0);
        if (declared > maxBytes) fail(`File is larger than ${maxBytes / 1024 / 1024} MB`);

        const chunks = [];
        let received = 0;
        for await (const chunk of response.body) {
            received += chunk.length;
            if (received > maxBytes) fail(`File is larger than ${maxBytes / 1024 / 1024} MB`);
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
    return fail('Too many redirects');
}

function imageExtension(buffer) {
    if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))) return 'png';
    if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'jpg';
    if (buffer.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
    return null;
}

function toPascalCase(title) {
    const slug = title
        .replace(/[^A-Za-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
        .slice(0, 40);
    return slug || 'Specimen';
}

function parseNumber(value, name, min, max) {
    const number = Number(value);
    if (!value || Number.isNaN(number) || number < min || number > max) {
        fail(`${name} must be a number between ${min} and ${max}`);
    }
    return number;
}

async function main() {
    const body = process.env.ISSUE_BODY || '';
    const form = parseIssueForm(body);

    if (!/\[x\]/i.test(form['Permission'] || '')) fail('The permission checkbox was not ticked');

    const title = cleanText(form['Title'] || '', 120);
    const location = cleanText(form['Location'] || '', 120);
    const description = cleanText(form['Description'] || '', 2000);
    const contributor = cleanText(form['Your name (for credit)'] || '', 80);
    if (!title || !location || !description || !contributor) fail('A required text field is empty');

    const date = (form['Date scanned'] || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
        fail('Date must be in YYYY-MM-DD format');
    }
    const latitude = parseNumber(form['Latitude'], 'Latitude', -90, 90);
    const longitude = parseNumber(form['Longitude'], 'Longitude', -180, 180);

    const modelBuffer = await download(form['Link to the 3D model (.glb)'] || '', MAX_MODEL_BYTES);
    if (modelBuffer.subarray(0, 4).toString('ascii') !== 'glTF') {
        fail('The model link did not return a binary .glb file (check it is a direct download link)');
    }

    const thumbBuffer = await download(form['Link to a thumbnail image (PNG or JPG)'] || '', MAX_IMAGE_BYTES);
    const thumbExt = imageExtension(thumbBuffer);
    if (thumbExt !== 'png' && thumbExt !== 'jpg') fail('The thumbnail link did not return a PNG or JPG image');

    let gifBuffer = null;
    const gifLink = (form['Link to an animated GIF (optional)'] || '').trim();
    if (gifLink) {
        gifBuffer = await download(gifLink, MAX_IMAGE_BYTES);
        if (imageExtension(gifBuffer) !== 'gif') fail('The GIF link did not return a GIF image');
    }

    const raw = await readFile(SPECIMENS_JSON, 'utf8');
    const existing = JSON.parse(raw).specimens;
    const lastNumber = Math.max(...existing.map((s) => Number(s.id.slice(1)) || 0));
    const id = `S${String(lastNumber + 1).padStart(3, '0')}`;
    const base = `${id}_${toPascalCase(title)}`;

    await mkdir(MODELS_DIR, { recursive: true });
    await mkdir(IMAGES_DIR, { recursive: true });

    const modelPath = `${MODELS_DIR}/${base}.glb`;
    await writeFile(`${modelPath}.tmp`, modelBuffer);
    execFileSync('npx', [
        '--yes', '@gltf-transform/cli', 'optimize', `${modelPath}.tmp`, modelPath,
        '--compress', 'meshopt', '--texture-compress', 'webp', '--texture-size', '2048'
    ], { stdio: 'inherit', shell: process.platform === 'win32' });
    await unlink(`${modelPath}.tmp`);

    const thumbnail = `${IMAGES_DIR}/${base}.${thumbExt}`;
    await writeFile(thumbnail, thumbBuffer);
    let gifPath = '';
    if (gifBuffer) {
        gifPath = `${IMAGES_DIR}/${base}.gif`;
        await writeFile(gifPath, gifBuffer);
    }

    const entry = {
        id,
        title,
        location,
        latitude,
        longitude,
        date,
        description,
        contributor,
        modelPath,
        thumbnail,
        gifPath
    };

    // Insert before the closing bracket so the rest of the file stays byte-identical.
    const closing = raw.lastIndexOf(']');
    const head = raw.slice(0, closing).trimEnd();
    const indented = JSON.stringify(entry, null, 2).replace(/^/gm, '    ');
    const updated = `${head},\n${indented}\n  ${raw.slice(closing)}`;
    JSON.parse(updated);
    await writeFile(SPECIMENS_JSON, updated);

    console.log(`Added ${id} (${base})`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `id=${id}\n`);
}

main().catch((error) => {
    console.error(`Ingest failed: ${error.message}`);
    process.exit(1);
});
