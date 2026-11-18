import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const skill=readFileSync(join(root,'skills/fixture-data-generation.md'),'utf8');
export const inject=['skills'];

export function apply(ctx){
  ctx.effect(()=>ctx.skills.register({
    name:'fixture-data-generation',
    description:'Generate bounded, synthetic local test fixtures without connecting to or writing business systems.',
    source:'bundled',
    provider:'dsh-fixture-console',
    content:skill,
  }),'dsh-fixture-console: register synthetic fixture skill');
}
