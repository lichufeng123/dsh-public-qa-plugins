#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {generateFixtures} from '../lib/generator.js';

const args=process.argv.slice(2);
if(args[0]!=='generate')throw new Error('Usage: dsh-fixture-console generate --spec <fixture-spec.json> [--output <new-file.json>]');
function option(name){const i=args.indexOf(name);return i<0?null:args[i+1]||null;}
const specPath=option('--spec');if(!specPath)throw new Error('--spec is required');
const outputPath=resolve(option('--output')||'generated-fixtures.json');
const spec=JSON.parse(await readFile(resolve(specPath),'utf8'));
const fixtures=generateFixtures(spec);
await writeFile(outputPath,JSON.stringify(fixtures,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({status:'generated',output:outputPath,entities:fixtures.entities.map(e=>({name:e.name,count:e.rows.length})),targetWrites:0},null,2));
