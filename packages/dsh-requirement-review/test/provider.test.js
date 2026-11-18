import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {apply,inject} from '../src/index.js';
const root=join(fileURLToPath(new URL('..',import.meta.url)));
test('registers the three canonical public workflow skills through the DSH skill service',()=>{
 assert.deepEqual(inject,['skills']);const registered=[];const ctx={skills:{register(value){registered.push(value);return()=>{};}},effect(fn){fn();}};apply(ctx);
 assert.deepEqual(registered.map(x=>x.name),['requirement-spec-generate','generate-business-assertions','test-case-generate']);
 for(const skill of registered){assert.equal(skill.source,'bundled');assert.ok(skill.content.includes('/SKILL.md'));assert.ok(skill.content.length>500);}
});
test('bundle metadata and payload exclude private business adapters and credentials',()=>{
 const manifest=JSON.parse(readFileSync(join(root,'package.json'),'utf8'));assert.equal(manifest.private,undefined);assert.equal(manifest.dsh.bundle.patch,'./cordis.patch.yml');
 const registry=JSON.parse(readFileSync(join(root,'skills/registry.json'),'utf8'));assert.equal(registry.sourceRepository,'https://github.com/lichufeng123/ai-test-engineer');
 const payload=registry.skills.flatMap(x=>x.files).map(x=>readFileSync(join(root,'skills',x.path),'utf8')).join('\n');
 for(const pattern of [/https?:\/\/[a-z0-9.-]+\.(?:cn|com)\//i,/Bearer\s+\S+/i,/Cookie:\s*\S+/i,/(?:member|staff)(?:Id)?\s*[=:]\s*\d{5,}/i])assert.equal(pattern.test(payload),false,String(pattern));
});
