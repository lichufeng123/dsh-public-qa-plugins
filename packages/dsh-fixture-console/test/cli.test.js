import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,writeFile,realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
test('CLI writes a local synthetic file once and refuses an overwrite',async t=>{
 const dir=await realpath(await mkdtemp(join(tmpdir(),'dsh-fixture-cli-')));
 t.after(async()=>{const base=await realpath(tmpdir());assert.ok(dir.startsWith(base+'/dsh-fixture-cli-'));await rm(dir,{recursive:true,force:true});});
 const spec=join(dir,'spec.json'),output=join(dir,'fixtures.json');
 await writeFile(spec,JSON.stringify({schemaVersion:1,seed:'cli-seed-01',entities:[{name:'case',count:2,fields:[{name:'id',type:'synthetic_id'}]}]}));
 const cli=join(root,'bin/cli.js');execFileSync(process.execPath,[cli,'generate','--spec',spec,'--output',output],{stdio:'pipe'});
 const result=JSON.parse(await readFile(output,'utf8'));assert.equal(result.entities[0].rows.length,2);assert.equal(result.targetWrites,0);
 assert.throws(()=>execFileSync(process.execPath,[cli,'generate','--spec',spec,'--output',output],{stdio:'pipe'}));
});
