import {createHash} from 'node:crypto';

const ID=/^[a-z][a-z0-9_]{0,39}$/;
const SENSITIVE=/(password|passwd|token|cookie|secret|authorization|api[_-]?key|credential|phone|mobile|email|address|customer|member|employee|account|user|person)/i;
const sensitiveValue=/(?:bearer\s+\S+|https?:\/\/|\b1[3-9]\d{9}\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|-----BEGIN .*PRIVATE KEY-----)/i;
const fail=(code,message)=>{throw Object.assign(new Error(message),{code});};
function randomUnit(seed,index){const bytes=createHash('sha256').update(`${seed}:${index}`).digest();return bytes.readUIntBE(0,6)/0x1000000000000;}
function safeString(value,label){if(typeof value!=='string'||!value||value.length>80||SENSITIVE.test(value)||sensitiveValue.test(value))fail('UNSAFE_SPEC_VALUE',`${label} must be a short non-sensitive synthetic value`);return value;}

export function generateFixtures(spec){
  if(!spec||spec.schemaVersion!==1||typeof spec.seed!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(spec.seed))fail('INVALID_SPEC','Expected schemaVersion 1 and a short synthetic seed');if(SENSITIVE.test(spec.seed)||sensitiveValue.test(spec.seed))fail('UNSAFE_SPEC_VALUE','seed must be a synthetic non-sensitive label');
  if(!Array.isArray(spec.entities)||spec.entities.length<1||spec.entities.length>20)fail('INVALID_SPEC','entities must contain between 1 and 20 definitions');
  const seen=new Set();let total=0,counter=0;
  const entities=spec.entities.map(entity=>{
    if(!entity||!ID.test(entity.name||'')||seen.has(entity.name))fail('INVALID_ENTITY','Entity names must be unique lowercase identifiers');seen.add(entity.name);
    if(!Number.isSafeInteger(entity.count)||entity.count<1||entity.count>1000)fail('INVALID_COUNT','Each entity count must be between 1 and 1000');
    total+=entity.count;if(total>5000)fail('FIXTURE_LIMIT','Total generated rows cannot exceed 5000');
    if(!Array.isArray(entity.fields)||entity.fields.length<1||entity.fields.length>30)fail('INVALID_FIELDS','Each entity needs 1 to 30 fields');
    const names=new Set();
    for(const field of entity.fields){if(!field||!ID.test(field.name||'')||names.has(field.name)||SENSITIVE.test(field.name))fail('UNSAFE_FIELD','Field names must be unique and cannot request personal or credential data');names.add(field.name);if(!['synthetic_id','synthetic_label','integer','boolean','enum','date'].includes(field.type))fail('INVALID_FIELD_TYPE','Unsupported field type');}
    const rows=Array.from({length:entity.count},(_,rowIndex)=>{
      const row={};for(const field of entity.fields){const r=randomUnit(spec.seed,counter++);switch(field.type){
        case 'synthetic_id': row[field.name]=`${entity.name.toUpperCase()}-${String(rowIndex+1).padStart(5,'0')}`;break;
        case 'synthetic_label': {const prefix=field.prefix||'FIXTURE';if(!/^(?:SYN|TEST|FIXTURE)(?:-[A-Z0-9_-]{1,20})?$/i.test(prefix))fail('UNSAFE_SPEC_VALUE','synthetic label prefixes must start with SYN, TEST or FIXTURE');row[field.name]=`${prefix.toUpperCase()}-${String(rowIndex+1).padStart(4,'0')}`;break;}
        case 'integer': {const min=field.min??0,max=field.max??100;if(!Number.isSafeInteger(min)||!Number.isSafeInteger(max)||min>max||max-min>10_000_000)fail('INVALID_RANGE','integer range must be safe and no wider than 10000000');row[field.name]=min+Math.floor(r*(max-min+1));break;}
        case 'boolean': row[field.name]=r>=0.5;break;
        case 'enum': if(!Array.isArray(field.values)||field.values.length<1||field.values.length>100)fail('INVALID_ENUM','enum values must contain 1 to 100 options');row[field.name]=safeString(field.values[Math.floor(r*field.values.length)],'enum value');break;
        case 'date': {const start=field.start||'2020-01-01',end=field.end||'2030-12-31',a=Date.parse(`${start}T00:00:00Z`),b=Date.parse(`${end}T00:00:00Z`);if(!Number.isFinite(a)||!Number.isFinite(b)||a>b||(b-a)/86400000>36525)fail('INVALID_DATE_RANGE','date range must be valid and no wider than 100 years');row[field.name]=new Date(a+Math.floor(r*((b-a)/86400000+1))*86400000).toISOString().slice(0,10);break;}
      }}return row;
    });return {name:entity.name,rows};
  });
  return {schemaVersion:1,seed:spec.seed,generatedBy:'dsh-fixture-console',targetWrites:0,entities};
}
