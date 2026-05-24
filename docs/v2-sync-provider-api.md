# V2 服务端模型同步接口规范

Lobe 通过 `POST /api/sync-providers` 从 V2 服务端拉取 Provider 和模型信息。
本文档描述 V2 服务端需要实现的接口格式，以确保模型能力被 Lobe 正确识别。

---

## 接口

```
GET /api/lobe/providers/:userId
Header: X-Lobe-Secret: <V2_LOBE_SHARED_SECRET>
```

---

## 响应格式

```json
{
  "providers": [
    {
      "id": "my-openai",
      "name": "My OpenAI",
      "api_key": "sk-xxx",
      "base_url": "https://api.example.com/v1",
      "sdk_type": "openai",
      "models": [
        {
          "id": "gpt-4o",
          "display_name": "GPT-4o",
          "type": "chat",
          "context_window_tokens": 128000,
          "released_at": "2024-05-13",
          "abilities": {
            "vision": true,
            "function_call": true,
            "reasoning": false,
            "search": false,
            "image_output": false,
            "video": false,
            "files": false
          }
        },
        {
          "id": "claude-3-5-sonnet-20241022",
          "display_name": "Claude 3.5 Sonnet",
          "type": "chat",
          "context_window_tokens": 200000,
          "released_at": "2024-10-22",
          "abilities": {
            "vision": true,
            "function_call": true
          }
        },
        {
          "id": "deepseek-r1",
          "display_name": "DeepSeek R1",
          "type": "chat",
          "context_window_tokens": 64000,
          "abilities": {
            "reasoning": true
          }
        },
        {
          "id": "dall-e-3",
          "display_name": "DALL·E 3",
          "type": "image",
          "abilities": {
            "image_output": true
          }
        }
      ]
    }
  ]
}
```

> **注意**：`abilities` 中只需填写值为 `true` 的能力，其余字段可省略，Lobe 默认视为 `false`。

---

## Provider 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | string | ✅ | Provider 唯一 ID，对应 Lobe 内的 `providerId` |
| `name` | string | ✅ | 显示名称 |
| `api_key` | string | ✅ | API 密钥 |
| `base_url` | string | ✅ | OpenAI 兼容的 base URL（含 `/v1`） |
| `sdk_type` | string | ❌ | 默认 `"openai"` |
| `models` | array | ✅ | 模型列表（有此字段时不再回退调用 `/models` 端点） |

---

## Model 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | string | ✅ | 模型 ID，需与推理 API 调用时完全一致 |
| `display_name` | string | ❌ | 下拉框显示名称，缺省使用 `id` |
| `type` | string | ❌ | 模型类型枚举，缺省 `"chat"`，见下表 |
| `context_window_tokens` | integer | ❌ | 最大上下文 token 数，如 `128000` |
| `released_at` | string | ❌ | 发布日期，格式 `YYYY-MM-DD` |
| `abilities` | object | ❌ | 能力标志，见下表 |

### `type` 枚举

| 值 | 含义 |
|----|------|
| `"chat"` | 对话模型（默认） |
| `"image"` | 图片生成模型（DALL·E、Flux 等） |
| `"embedding"` | 向量嵌入模型 |
| `"tts"` | 文字转语音 |
| `"stt"` | 语音转文字 |
| `"video"` | 视频生成模型 |
| `"realtime"` | 实时对话模型 |
| `"text2music"` | 文字转音乐 |

### `abilities` 字段

| 字段 | 类型 | 对应 Lobe 功能 |
|------|------|---------------|
| `vision` | boolean | 图像 / 视觉理解（可上传 JPG、截图等） |
| `function_call` | boolean | 工具调用 / Function Call |
| `reasoning` | boolean | 深度思考 / 链式推理（DeepSeek-R1、o1 等） |
| `search` | boolean | 内置联网搜索 |
| `image_output` | boolean | 生成图片输出（DALL·E、Flux 等） |
| `video` | boolean | 视频识别 / 理解 |
| `files` | boolean | 文件上传分析（PDF、Word 等原生支持） |

---

## Lobe 侧处理逻辑

| 情况 | 行为 |
|------|------|
| `models` 有值 | 直接按字段写入数据库（含全部能力），不调用 `/models` 端点 |
| `models` 无值 | 回退调用 `{base_url}/models`（Legacy，能力字段为空） |
| 重复同步 | `abilities`、`context_window_tokens`、`display_name`、`type` 均会覆盖更新 |

---

## 常见模型参考配置

```json
[
  {
    "id": "gpt-4o",
    "type": "chat",
    "context_window_tokens": 128000,
    "abilities": { "vision": true, "function_call": true }
  },
  {
    "id": "gpt-4o-mini",
    "type": "chat",
    "context_window_tokens": 128000,
    "abilities": { "vision": true, "function_call": true }
  },
  {
    "id": "o1",
    "type": "chat",
    "context_window_tokens": 200000,
    "abilities": { "reasoning": true, "function_call": true }
  },
  {
    "id": "claude-opus-4-5",
    "type": "chat",
    "context_window_tokens": 200000,
    "abilities": { "vision": true, "function_call": true }
  },
  {
    "id": "claude-sonnet-4-5",
    "type": "chat",
    "context_window_tokens": 200000,
    "abilities": { "vision": true, "function_call": true }
  },
  {
    "id": "claude-3-5-sonnet-20241022",
    "type": "chat",
    "context_window_tokens": 200000,
    "abilities": { "vision": true, "function_call": true }
  },
  {
    "id": "deepseek-r1",
    "type": "chat",
    "context_window_tokens": 64000,
    "abilities": { "reasoning": true }
  },
  {
    "id": "deepseek-v3",
    "type": "chat",
    "context_window_tokens": 64000,
    "abilities": { "function_call": true }
  },
  {
    "id": "gemini-2.0-flash",
    "type": "chat",
    "context_window_tokens": 1048576,
    "abilities": { "vision": true, "function_call": true, "search": true }
  },
  {
    "id": "dall-e-3",
    "type": "image",
    "abilities": { "image_output": true }
  }
]
```

---

## 相关文件

- Lobe 同步路由：`src/app/(backend)/api/sync-providers/route.ts`
- Lobe 模型能力类型：`packages/model-bank/src/types/aiModel.ts`（`ModelAbilities`）
- Lobe 数据库 schema：`packages/database/src/schemas/aiInfra.ts`（`aiModels` 表）
