import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const registry=JSON.parse(readFileSync(join(root,'skills/registry.json'),'utf8'));
export const inject=['skills'];

export function apply(ctx){
  const dispose=[];
  ctx.effect(()=>{
    for(const item of registry.skills){
      const content=item.files.map(file=>`\n\n---\n\n# ${file.path}\n\n${readFileSync(join(root,'skills',file.path),'utf8')}`).join('');
      const result=ctx.skills.register({name:item.id,description:item.description,source:'bundled',provider:'dsh-requirement-review',content});
      if(typeof result==='function')dispose.push(result);
    }
    return ()=>{for(const release of dispose.splice(0).reverse())release();};
  },'dsh-requirement-review: register portable requirement skills');
}
