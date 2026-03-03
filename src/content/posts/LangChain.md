---
title: LangChain
published: 2026-02-26
description: 'LangChain 概述、Model I/O、Chains、Memory、Tools、Agents、RAG、流式输出与常见面试题'
image: ''
tags: [LangChain, 大模型, RAG, Agent, 面试]
category: '前端'
draft: false
lang: 'zh-cn'
---

# LangChain

LangChain 是用于构建**基于大模型（LLM）应用**的开源框架，通过统一模型接口、链式编排、工具调用与检索增强等能力，简化从开发到上线的全流程。本文结合 [LangChain 官方文档](https://python.langchain.com/docs/concepts) 与本地课件，按模块顺序整理核心概念与常见面试题。

---

## 一、概述（官方文档）

### 1. 是什么

- LangChain 提供**预置的 Agent 架构**与多种**模型/工具集成**，用少量代码即可接入 OpenAI、Anthropic、Google、Ollama 等，构建可随生态演进的 Agent 与应用。
- **核心价值**：标准化模型调用方式（避免厂商锁定）、易上手且可深度定制的 Agent、基于 LangGraph 的持久化与可观测（流式、人机回环、调试）。

### 2. LangChain vs LangGraph vs Deep Agents

| 选择 | 适用场景 |
|------|----------|
| **Deep Agents** | 需要“开箱即用”：长对话压缩、虚拟文件系统、子 Agent 等，可直接用官方实现。 |
| **LangChain** | 快速搭建 Agent/应用，或对 Agent 行为做自定义，无需从底层写 LangGraph。 |
| **LangGraph** | 需要**确定性 + 智能体**混合工作流、强定制编排与运行时（持久化、人机回环等）时使用。 |

LangChain 的 Agent 底层基于 LangGraph，提供持久执行、流式、人机回环与可观测，日常开发以 LangChain 为主即可。

### 3. 快速创建 Agent（官方示例）

```python
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-5-20250929",
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)
agent.invoke({"messages": [{"role": "user", "content": "what is the weather in sf"}]})
```

---

## 二、第一章：使用概述（课件）

- **Chat Models**：输入/输出为消息（HumanMessage、AIMessage、SystemMessage），推荐作为默认模型抽象。
- **PromptTemplate / ChatPromptTemplate**：带占位符的提示模板，便于复用与维护。
- **LCEL**：用 `pipe()` 串联 prompt → model → parser，形成链式调用。

### 获取大模型（LangChain.js）

```javascript
import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
  model: "qwen3-coder:480b-cloud",
  baseUrl: "http://localhost:11434",
  temperature: 0.7,
});
const response = await model.invoke("什么是大模型？");
```

### 提示词模板

```javascript
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是世界级的技术文档编写者"],
  ["human", "{input}"],
]);
const formatted = await prompt.formatMessages({ input: "大模型中的 LangChain 是什么?" });
const response = await model.invoke(formatted);
```

---

## 三、第二章：Model I/O（模型输入输出）

### 1. 模型分类

- **按功能**：LLM（字符串进字符串出）、**Chat Model**（消息进消息出，推荐）、Embedding（用于 RAG）。
- **按配置**：硬编码、环境变量（`.env`）、配置文件（生产推荐）。
- **按 API**：LangChain 统一接口（推荐）或厂商原生 API。

### 2. 对话模型调用

```javascript
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const res = await model.invoke([new HumanMessage("你好")]);
const res2 = await model.invoke([
  new SystemMessage("你是编程助手，回答简短。"),
  new HumanMessage("什么是 REST API？"),
]);
```

### 3. 提示词模板与输出解析

- **PromptTemplate**：单轮字符串模板，`fromTemplate("...{question}...")`，`format({ question })`。
- **ChatPromptTemplate**：多角色消息模板，`fromMessages([["system", "..."], ["human", "{input}"]])`，`formatMessages({ input })`。
- **输出解析器**：`StringOutputParser`、`JsonOutputParser`、`StructuredOutputParser`（Zod schema），链末尾 `pipe(parser)` 得到结构化结果。

```javascript
const chain = prompt.pipe(model).pipe(new StringOutputParser());
const result = await chain.invoke({ input: "你好" });
```

---

## 四、第三章：Chains（链）

### 1. LCEL 链式调用（推荐）

用 `pipe()` 串联：**Prompt → Model → Parser**。

```javascript
const prompt = PromptTemplate.fromTemplate("你是一个数学高手，帮我解决：{question}");
const chain = prompt.pipe(model).pipe(parser);
const result = await chain.invoke({ question: "1 + 2 * 3 = ?" });
```

### 2. 多步顺序链

前一步输出作为后一步输入，可手动串联或组合成新的 RunnableSequence。

```javascript
const step1Result = await chain1.invoke({ question: "..." });
const step2Result = await chain2.invoke({ input: step1Result });
```

### 3. 传统 Chain 与 LCEL 对应

| 传统概念 | LangChain.js 对应 |
|----------|-------------------|
| LLMChain | `prompt.pipe(model)` |
| SimpleSequentialChain | 多步 `pipe` 或手动串联 |

---

## 五、第四章：Memory（记忆）

### 1. 无记忆时

每次 `invoke` 仅当前消息，模型无法获知历史对话。

### 2. 有记忆时

- **手动维护**：维护一个 `messages` 数组，每次将用户消息与 AI 回复追加进去，再整体传入 `model.invoke(messages)`。
- **ChatMessageHistory**：用 `ChatMessageHistory` 存消息，`addUserMessage` / `addAIChatMessage`，调用时 `getMessages()` 传入模型。
- **RunnableWithMessageHistory**：将记忆集成到 LCEL 链，通过 `getMessageHistory` 注入会话存储（如 InMemoryChatMessageHistory）。

### 3. 记忆类型概览

| 类型 | 说明 |
|------|------|
| ConversationBufferMemory | 保存全部历史 |
| ConversationBufferWindowMemory | 只保留最近 N 轮 |
| ConversationSummaryMemory | 用模型总结历史，节省 token |

---

## 六、第五章：Tools（工具）

### 1. 定义工具（tool 函数）

```javascript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const addNumber = tool(
  async ({ a, b }) => a + b,
  {
    name: "add_number",
    description: "计算两个整数的和",
    schema: z.object({
      a: z.number().describe("第一个整数"),
      b: z.number().describe("第二个整数"),
    }),
  }
);
```

### 2. 工具属性

| 属性 | 说明 |
|------|------|
| name | 工具名称，供模型识别 |
| description | 帮助模型决定何时调用 |
| schema | 参数结构（Zod） |
| returnDirect | 为 true 时工具结果直接作为最终答案 |

### 3. 工具调用流程

1. 模型根据用户问题判断是否调用工具；  
2. 若需要，返回 `tool_calls`；  
3. 应用执行工具；  
4. 将结果以 `ToolMessage` 回传模型；  
5. 模型整合后生成最终回答。

---

## 七、第六章：Agents（智能体）

### 1. Agent 与 Chain 区别（面试常问）

| | Chain | Agent |
|--|--------|--------|
| 流程 | 固定步骤，不可动态调整 | 根据问题自主决定是否/何时调用哪些工具 |
| 适用 | 逻辑固定的流水线 | 复杂、动态或未知流程 |

### 2. 单工具：bindTools

模型 `bindTools([getWeather])` 后，返回中可能包含 `tool_calls`；应用执行工具，构造 `ToolMessage` 并再次 `invoke`，将结果交给模型生成最终回复。

### 3. 多工具与 ReAct

- **ReAct**（Reasoning + Acting）：模型先“推理”再“行动”（调用工具），适合多工具选择。
- 推荐使用 **LangGraph** 或 **createReactAgent** 等预置方式构建 Agent，替代已弃用的 AgentExecutor；多工具时由模型在循环中决定调用哪个工具直至结束。

### 4. 带记忆的 Agent

将历史消息（如 `previousMessages`）与当前用户消息一起放入 `messages` 再调用 `modelWithTools.invoke(messages)`，即可在对话中保持上下文。

---

## 八、第七章：RAG（检索增强生成）

### 1. RAG 流程

1. **文档加载**：TXT、PDF、HTML、CSV、JSON 等 → Document。  
2. **文档拆分**：Text Splitter（如 RecursiveCharacterTextSplitter），chunk_size、chunk_overlap。  
3. **文档嵌入**：Embedding 模型将文本转为向量。  
4. **向量存储**：写入向量库（Chroma、FAISS、MemoryVectorStore 等）。  
5. **检索**：根据用户问题检索相关文档（Retriever）。  
6. **生成**：将检索到的上下文与问题一起拼进 Prompt，调用 LLM 生成回答。

### 2. 关键组件

| 组件 | 作用 |
|------|------|
| Document Loaders | 从各类数据源加载为 Document 列表 |
| Text Splitters | 将长文本按块切分 |
| Embeddings | 文本 → 向量 |
| Vector Stores | 存储并检索向量 |
| Retriever | 封装“查询 → 相关文档”的逻辑 |
| RAG Chain | 检索 + Prompt + Model + Parser 组合成链 |

### 3. 链的写法示例（概念）

```javascript
const retriever = vectorStore.asRetriever({ k: 3 });
const chain = RunnableSequence.from([
  {
    context: (input) => retriever.invoke(input.question).then(docs => docs.map(d => d.pageContent).join("\n\n")),
    question: (input) => input.question,
  },
  (input) => prompt.format({ context: input.context, question: input.question }),
  model,
  new StringOutputParser(),
]);
```

---

## 九、大模型流式返回（Streaming）

**流式输出**指大模型**边生成边返回**，而不是等整段回答完成后再一次性返回。用户能更快看到首字、获得打字机式体验，适合对话、长文生成等场景；同时可降低**首字延迟（TTFT）**，提升体感流畅度。

### 1. 两种常用方式

#### （1）链的流式：`chain.stream(input)`

当使用 **LCEL 链**（如 `prompt.pipe(model).pipe(parser)`）时，对**整条链**调用 `.stream(input)`，得到的是**解析后的结果流**（例如字符串块），直接可写前端或终端。

```javascript
import { ChatOllama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOllama({ model: "qwen3-coder:480b-cloud" });
const prompt = PromptTemplate.fromTemplate("用三句话介绍一下{topic}，每句简短。");
const parser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(parser);

// 流式：逐块得到字符串
const stream = await chain.stream({ topic: "区块链" });
process.stdout.write("回复: ");
for await (const chunk of stream) {
  process.stdout.write(chunk);
}
process.stdout.write("\n");
```

- **优点**：写法简单，直接拿到最终类型（如字符串）的流。  
- **适用**：单轮问答、固定「模板 + 模型 + 解析器」流水线。

#### （2）模型的流式：`model.stream(messages)`

直接对**聊天模型**调用 `.stream(messages)`，得到的是 **AIMessageChunk** 的异步迭代器，每块里带 `content` 字段（可能为空或部分文本）。

```javascript
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const messages = [
  new SystemMessage("你是一个简洁的助手。"),
  new HumanMessage("用两句话介绍什么是流式输出。"),
];

const stream = await model.stream(messages);
process.stdout.write("回复: ");
for await (const chunk of stream) {
  if (chunk.content) process.stdout.write(chunk.content);
}
process.stdout.write("\n");
```

- **优点**：不依赖链和解析器，适合多轮对话、自定义消息结构。  
- **注意**：每块是 `AIMessageChunk`，需从 `chunk.content` 取文本（可能多块才组成一个完整 token）。

### 2. 对比小结

| 方式       | 调用                     | 迭代得到               | 典型用法                     |
|------------|--------------------------|------------------------|------------------------------|
| 链流式     | `chain.stream(input)`    | 解析后结果（如字符串块） | 模板 + 模型 + 解析器         |
| 模型流式   | `model.stream(messages)` | `AIMessageChunk`（用 `chunk.content`） | 多轮对话、纯消息输入         |

### 3. 在 HTTP/API 里做流式

若要在 Web 接口中返回流式响应（如 **SSE / Server-Sent Events**）：

1. 用 `chain.stream()` 或 `model.stream()` 得到异步迭代器。  
2. 按所选协议（如 SSE）按块写入响应体，每块发送 `chunk` 或 `chunk.content`，并做编码与安全处理。  
3. 具体实现依赖框架（Express、Fastify、Next.js 等），可参考各框架的流式响应与 SSE 文档。

**面试可答**：流式返回 = 边生成边返回，降低首字延迟、提升体验；LangChain 里用 `chain.stream()` 拿解析后流，或用 `model.stream()` 拿 `AIMessageChunk` 流；在 Web 侧用 SSE 等协议把块推给前端即可。

---

## 十、常见面试题速查

### 1. LangChain 是什么？

LangChain 是用于构建基于大模型应用的开发框架，通过**模块化组件**和**标准化接口**简化大模型与外部数据、工具、环境的集成。核心价值：降低开发门槛、增强大模型能力（检索、工具、记忆）、提升开发灵活性。

### 2. 六大核心部分

Models（模型）、Prompts（提示词）、Memory（记忆）、Indexes/Retrieval（索引与检索）、Chains（链）、Agents（代理）。

### 3. Chain 与 Agent 的区别？

- **Chain**：按预设固定流程执行，步骤明确、不可动态调整，适合逻辑固定的场景。  
- **Agent**：具备自主决策能力，可动态选择工具、规划步骤，适合复杂、动态或未知流程的场景。

### 4. 常见 Chain 类型？

- LLMChain：直接调用大模型的基础链。  
- SequentialChain / SimpleSequentialChain：按顺序执行多个链。  
- RetrievalQAChain：结合 RAG 的检索问答链。  
- 现代做法：多用 **LCEL**（`prompt.pipe(model).pipe(parser)`）替代传统 Chain 类。

### 5. Memory 有哪些类型？

- ConversationBufferMemory：保存完整对话历史。  
- ConversationBufferWindowMemory：只保留最近 N 轮。  
- ConversationTokenBufferMemory：按 token 数量限制。  
- ConversationSummaryMemory：用模型将历史总结为摘要，节省 token。

### 6. RAG 实现流程？

数据加载 → 文档处理（清洗、切分）→ 嵌入 → 向量存储 → 检索 → 将检索结果作为上下文与问题一起喂给模型生成。关键组件：Document Loaders、Text Splitters、Embeddings、Vector Stores、Retrievers、QA Chain。

### 7. Tool 工具调用注意点？

定义工具（name、description、schema）→ 绑定到模型/Agent → 执行时需：限制工具权限、校验参数、设置超时、记录日志，避免任意执行与越权。

### 8. 生产优化方向？

- **性能**：缓存 Embedding 结果、预分割与预嵌入、模型负载均衡。  
- **可靠性**：工具调用超时与重试、输入校验、监控告警。  
- **成本**：简单任务用轻量模型、限制记忆长度、批处理。

---

以上内容按「官方概述 → 课件第一章至第七章 → 流式输出 → 面试题」顺序组织，便于系统复习与面试准备。示例以 LangChain.js 为主，概念与 Python 版一致，具体 API 以 [LangChain 官方文档](https://python.langchain.com/docs/concepts) 与 [LangChain.js](https://js.langchain.com) 为准。
