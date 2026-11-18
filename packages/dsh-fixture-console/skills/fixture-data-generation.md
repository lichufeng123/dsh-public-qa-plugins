# 本地合成测试数据

这个插件只从明确提供的 fixture specification 生成合成 JSON 文件。它不会登录系统、调用 API、创建业务记录或上传数据。生成物只适合本地夹具、离线测试和用户自行审核后的接入。

## 命令

```bash
dsh-fixture-console generate --spec fixture-spec.json --output generated-fixtures.json
```

输出文件必须不存在；工具拒绝覆盖已有文件。每次生成有 1–20 个实体定义、每实体 1–1000 行、总数最多 5000 行、每实体最多 30 个字段。

## 输入格式

```json
{
  "schemaVersion": 1,
  "seed": "demo-seed-01",
  "entities": [
    {
      "name": "ticket",
      "count": 3,
      "fields": [
        { "name": "id", "type": "synthetic_id" },
        { "name": "label", "type": "synthetic_label", "prefix": "FIXTURE-CASE" },
        { "name": "priority", "type": "integer", "min": 1, "max": 5 },
        { "name": "active", "type": "boolean" },
        { "name": "state", "type": "enum", "values": ["new", "ready", "closed"] },
        { "name": "created", "type": "date", "start": "2025-01-01", "end": "2025-12-31" }
      ]
    }
  ]
}
```

Field names are short lowercase identifiers. Personal/credential field names, URLs, bearer values, phone-number-like strings, raw customer records, keys and passwords are rejected or unsupported. Identifiers and labels are generated from the seed; the seed must itself be a short synthetic label.

## Safe use

1. Use only synthetic fields and values.
2. Review the generated output and count before using it.
3. To populate a real application, configure and review a separate domain adapter. This plugin deliberately contains no generic HTTP write adapter and cannot seed applications by itself.
4. Keep the independent readback, side-effect rules and cleanup contract in that adapter; a generated JSON file is not proof that data was accepted by a system.
