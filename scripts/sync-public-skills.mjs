#!/usr/bin/env node
import {cp,mkdir,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,resolve,relative} from 'node:path';

const framework=resolve(process.argv[2]||'');
if(!process.argv[2])throw Error('Usage: node scripts/sync-public-skills.mjs <ai-test-engineer-integration-root>');
const source=join(framework,'.agents/skills');
const destination=resolve('packages/dsh-requirement-review/skills');
const ids=['requirement-spec-generate','generate-business-assertions','test-case-generate'];
const skills=[];
await rm(destination,{recursive:true,force:true});await mkdir(destination,{recursive:true});
for(const id of ids){
  const sourceDir=join(source,id),files=[];
  async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory())await walk(path);else if(entry.name==='SKILL.md'||relative(sourceDir,path).startsWith('references/')){const rel=relative(sourceDir,path);const target=join(destination,id,rel);await mkdir(resolve(target,'..'),{recursive:true});await cp(path,target);const bytes=await readFile(path);files.push({path:`${id}/${rel}`,sha256:createHash('sha256').update(bytes).digest('hex')});}}}
  await walk(sourceDir);
  const entry=await readFile(join(sourceDir,'SKILL.md'),'utf8');const name=entry.match(/^name:\s*([a-z0-9-]+)/m)?.[1];const description=entry.match(/^description:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g,'');
  if(name!==id||!description)throw Error(`Invalid canonical skill metadata: ${id}`);
  skills.push({id,description,files});
}
const registry={schemaVersion:1,sourceRepository:'https://github.com/lichufeng123/ai-test-engineer',sourcePath:'.agents/skills',generatedAt:new Date().toISOString(),skills};
await writeFile(join(destination,'registry.json'),JSON.stringify(registry,null,2)+'\n');
console.log(JSON.stringify({status:'synced',source,skills:skills.map(({id,files})=>({id,files:files.length}))},null,2));
