---
title: 'AI Agent 全景架构：从 ReAct 到 Harness Engineering'
published: 2026-05-10
description: 'AI Agent 工程全景：核心概念与演进、六种范式（ReAct/Plan-Execute/Reflection/Multi-Agent/A2A/Agentic Workflows）、Function Calling 与工具调用、MCP 协议、Agent Skills、Context/Prompt Engineering、记忆系统、AI Workflow（Graph/Loop）、Harness Engineering 六层架构、一线团队实战、面试速答'
image: ''
tags: [AI, Agent, 大模型, 后端, 架构, 面试, MCP, Function Calling]
category: '后端'
draft: false
lang: 'zh-cn'
---

# AI Agent 全景架构：从 ReAct 到 Harness Engineering

## 一、Agent 核心概念与演进

### 1.1 什么是 AI Agent

AI Agent 是一个能感知环境、做决策、执行动作的自主软件系统，用 LLM 当大脑，替用户自动化完成复杂任务。和单纯聊天机器人的区别在于，Agent 强调自主性和交互性，能在动态环境中持续迭代，直到任务完成。

核心公式：**Agent = LLM + Planning + Memory + Tools**

![AI Agent 核心架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-core-arch.png)

![手绘版](./image/agent/agent-core-arch.svg)

四大组件：

| 组件 | 职责 | 说明 |
|------|------|------|
| **Planning（规划）** | 分析任务状态，拆解目标，决定下一步 | LLM 通过 CoT 逐步推理 |
| **Memory（记忆）** | 短期上下文 + 长期知识检索 | 保持对话连续，从历史经验学习 |
| **Tools（工具）** | 执行具体操作 | 查 API、读文件、执行代码 |
| **Observation（观察）** | 接收工具执行反馈 | 纳入上下文用于下一轮推理 |

### 1.2 Agent Loop：Agent 的运行引擎

Agent Loop 说到底是 **一个 while 循环**，每次迭代完成「LLM 推理 → 工具调用 → 上下文更新」，直到任务终止。

![Agent Loop 工作流程](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-loop-flow.png)

![手绘版](./image/agent/agent-loop-flow.svg)

流程概览：

1. 初始化：加载 System Prompt、可用工具列表、用户初始请求
2. 循环迭代：LLM 推理决定下一步（调工具还是直接回复），执行工具，结果追加到上下文
3. 退出判断：LLM 判断任务完成，不再调用工具时退出
4. 安全兜底：最大迭代轮次（一般 10-20 轮）或 Token 消耗阈值

工程难点不在循环本身，而在**如何管理随迭代不断增长的上下文**——这是 Context Engineering 要解决的。

### 1.3 Agent 的演进

| 阶段 | 时间 | 特征 | 代表产品 |
|------|------|------|---------|
| 萌芽期 | 2022 | 被动响应，依赖 Prompt Engineering | ChatGPT |
| 工具觉醒 | 2023 中 | Function Calling 出现，LLM 可调用外部 API | AutoGPT |
| 工程化编排 | 2023 底 | ReAct 确立，多智能体推广，低代码平台兴起 | Coze, Dify |
| 标准化与多模态 | 2024 底 | MCP 协议出现，Computer Use 使 Agent 可操作 GUI | Cursor, Claude Agent |
| 常驻自治 | 2025+ | Agent Skills + Heartbeat 机制，24 小时后台运行 | Claude Code, Codex |

### 1.4 Agent vs 传统编程 vs Workflow

**一句话区分：传统编程和 Workflow 是人在做决策，Agent 是 AI 在做决策。**

| 对比维度 | 传统编程 | Workflow | Agent |
|---------|---------|---------|-------|
| 决策者 | 程序员 | 产品/流程设计者 | AI |
| 执行路径 | 代码写死 | 流程图预设 | 运行时动态决定 |
| 灵活性 | 低 | 中 | 高 |
| 适用场景 | 逻辑固定、高频、高性能 | 步骤有限、需可视化管理 | 步骤不确定、需理解自然语言 |
| 维护成本 | 代码维护 | 流程维护 | 上下文+提示词维护 |
| 调试难度 | 成熟工具链 | 可视化追踪 | 黑盒、可观测性不足 |

### 1.5 Agent 面临的挑战

- **上下文窗口限制**：长任务中历史信息被截断，上下文越长推理质量反而可能下降
- **幻觉问题**：LLM 在推理中仍可能生成虚假事实
- **Token 消耗**：多轮迭代 + 工具调用，成本涨得很快
- **安全问题**：Prompt Injection 攻击风险，目前没有银弹
- **规划能力上限**：深度多步推理有明显瓶颈
- **可观测性不足**：推理过程黑盒，出问题难定位

---

## 二、Agent 核心范式

### 2.1 ReAct（Reasoning + Acting）

ReAct 由 Shunyu Yao 等人 2022 年提出，核心思想是**把思维链推理和外部环境交互结合起来**，让 AI "走一步看一步"。

![ReAct-LLM](https://oss.javaguide.cn/github/javaguide/ai/agent/ReAct-LLM.png)

![手绘版](./image/agent/react-llm.svg)

> 打破一次性规划全部流程的局限，动态交替循环，边思考边验证。

**示例：排查 user-service 接口变慢**

ReAct 会这样做：先查监控发现 CPU 飙到 98% + 慢 SQL 告警 → 翻日志捞出全表扫描 SQL → 查负责人王建国 → 组织排查报告发邮件。整个过程是观察驱动的动态决策——如果监控显示的是内存 OOM，第二步就会变成查 Heap Dump 而不是翻日志。

![ReAct 模式流程](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-react-flow.png)

![手绘版](./image/agent/agent-react-flow.svg)

五大组件协同：

| 组件 | 职责 |
|------|------|
| 历史上下文 | 统一交互日志：推理步骤 + 执行动作 + 反馈观察 |
| 实时环境输入 | 系统告警、用户反馈等外部变量 |
| LLM 推理模块 | 核心引擎，逻辑分析和规划 |
| 工具集与技能库 | 操作接口，原子工具 + Skills |
| 反馈观察机制 | 从环境采集响应，追加到历史上下文 |

**优势**：减少幻觉、提升复杂任务成功率、可解释性强。**代价**：多轮迭代带来响应延迟，表现依赖工具质量。

### 2.2 Plan-and-Execute

由 LangChain 团队 2023 年提出。核心思路：**先制定全局分步计划，再由执行器按步骤逐一完成**，而不是「边想边做」。

适合步骤繁多、逻辑依赖明确的长期复杂任务，能避免 ReAct 在长任务中的「迷失」问题。但偏向静态工作流，执行中动态调整和容错能力较弱。

**两种模式可以结合**：规划阶段用 CoT 生成全局步骤，执行阶段在每个步骤内嵌入 ReAct 子循环——既保证全局结构性，又兼顾局部灵活性。

### 2.3 Reflection（反思模式）

给 Agent 加上自我纠错和迭代优化能力，靠自然语言形式的口头反馈强化模型行为，**不调整模型权重**。

三种主流实现：

| 模式 | 机制 | 特点 |
|------|------|------|
| **Reflexion** | 任务失败后口头反思，结论存入记忆缓冲区 | 下次直接规避同类错误 |
| **Self-Refine** | 任务完成后对自身输出批判性审查，迭代改进 | 平均能提升输出质量 |
| **CRITIC** | 引入外部工具（搜索引擎、代码执行器）对输出做事实验证 | 基于外部信号自我修正 |

Reflection 一般不单独用，而是作为增强层叠加在 ReAct 或 Plan-and-Execute 之上，形成自适应 Agent。

### 2.4 Multi-Agent（多智能体协作）

多个独立 Agent 协作完成复杂任务，每个 Agent 专注特定角色。

![Multi-Agent 系统架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-multi-agent-arch.png)

![手绘版](./image/agent/agent-multi-agent-arch.svg)

**两种主流架构：**

| 架构 | 机制 | 适用场景 |
|------|------|---------|
| **Orchestrator-Subagent** | 编排 Agent 负责全局规划分发，子 Agent 并行/串行执行 | 有明确任务层级的项目 |
| **Peer-to-Peer** | Agent 间平等对话、相互审查 | 需要辩论或验证的场景 |

**优势**：并行效率高、专业化分工、单 Agent 失败不影响整体、可扩展性强。**代价**：通信开销高、协调失败可能导致全局崩溃、调试难度大。

### 2.5 A2A 协议（Agent-to-Agent）

单个 Agent 升级到 Multi-Agent 后，Agent 之间的通信是个难题。A2A 协议的核心思路：**Agent 间用结构化数据载体（带 Schema 的 JSON/XML）而非自然语言废话**。

![A2A 协议架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-a2a.png)

![手绘版](./image/agent/agent-a2a.svg)

类比：后端微服务之间不会通过解析 HTML 交换数据，A2A 协议就是给大模型之间定义接口契约。「产品经理 Agent」输出包含 TaskID、Dependencies、AcceptanceCriteria 的标准 JSON Payload，「开发 Agent」直接反序列化开始干活。

### 2.6 Agentic Workflows

吴恩达（Andrew Ng）重点倡导的概念，对上述所有范式的整合。核心观点：**构建强大的 AI 应用，没必要干等底层模型突破。用工程思维把推理、记忆、反思、多实体协作编排成流水线。**

![智能体工作流核心模式](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-agentic-workflows.png)

![手绘版](./image/agent/agent-agentic-workflows.svg)

四大核心设计模式：
1. **Reflection** — 让模型检查自己的工作
2. **Tool Use** — 给 LLM 配备网络搜索、代码执行等工具
3. **Planning** — 让模型提出多步计划并执行
4. **Multi-agent Collaboration** — 多个 Agent 共同工作

实际项目中这几个模式往往会组合使用。

---

## 三、Function Calling 工具调用

### 3.1 Function Calling 的本质

**Function Calling 不是模型调用了你的函数。** 它做的是：根据用户问题和工具描述，生成一个结构化的工具调用意图（工具名 + 参数 JSON）。真正执行工具的是你的业务服务。

完整链路：

```
用户请求 → 模型判断需要工具 → 生成工具名 + 参数 → 服务端校验 → 执行业务逻辑 → 结果回填模型 → 生成最终回答
```

Function Calling 的价值是完成「自然语言意图 → 结构化参数」的映射。**它只负责映射，不负责替你绕过权限、查数据库、发短信。**

### 3.2 OpenAI Function Calling Schema

现在主流数据格式标准基本统一在 OpenAI Function Calling Schema 上，Anthropic、Google 等厂商都支持。靠 JSON Schema 定义工具描述和参数规范。

示例——查询慢 SQL 日志：

```json
{
  "type": "function",
  "function": {
    "name": "query_slow_sql",
    "description": "查指定微服务在特定时间段的慢 SQL 日志。服务响应慢、数据库超时、CPU 飙升的时候用这个。如果用户问的是网络或内存问题，别调这个。",
    "parameters": {
      "type": "object",
      "properties": {
        "service_name": {
          "type": "string",
          "description": "服务名，比如 user-service、order-service"
        },
        "time_range": {
          "type": "string",
          "description": "时间范围，格式 HH:MM-HH:MM，比如 09:00-09:30"
        },
        "threshold_ms": {
          "type": "integer",
          "description": "慢 SQL 判定阈值（毫秒），默认 1000"
        }
      },
      "required": ["service_name", "time_range"]
    }
  }
}
```

**工具描述的质量直接决定 Agent 的决策准确性。** 好的描述要说清楚「什么时候该用」和「什么时候别用」。

### 3.3 Function Calling / MCP / HTTP API / Agent Skill 分层

| 能力 | 本质定位 | 解决的问题 |
|------|---------|-----------|
| JSON Mode | 输出格式开关 | 让模型输出合法 JSON |
| JSON Schema / Structured Outputs | 数据契约与结构化生成 | 让输出符合结构 |
| **Function Calling** | 模型工具调用意图生成 | 自然语言转工具名和参数 |
| **MCP** | 工具和上下文接入协议 | 标准化工具发现、调用、资源访问 |
| HTTP API | 业务服务接口 | 确定性业务读写 |
| Agent Skill | 可复用任务说明和 SOP | 复杂任务流程编排 |

一句话：**Function Calling 是底层「神经信号」，MCP 是工具接入「接口标准」，HTTP API 是业务系统「确定性能力」，Skill 是上层「执行说明书」。**

### 3.4 工具调用安全

**参数校验三层模型：**

| 层级 | 校验内容 | 说明 |
|------|---------|------|
| 结构校验 | 类型、必填、枚举、长度、格式 | JSON Schema 校验 |
| 业务校验 | 订单归属、状态流转、金额范围 | 业务规则校验 |
| 权限校验 | 用户身份、角色、租户、数据范围 | 权限边界校验 |

**按风险等级分层控制：**

| 风险等级 | 工具类型 | 控制策略 |
|---------|---------|---------|
| 低 | 查天气、读公开文档 | 基础限流 |
| 中 | 查订单、查用户资料 | 身份校验 + 数据范围 |
| 高 | 退款、发券、改地址 | 权限校验 + 二次确认 + 审计 |
| 极高 | 删数据、执行 SQL | 默认禁止，走人工审批 |

敏感操作拆成两步：`prepare_xxx`（生成预案）+ `confirm_xxx`（确认后执行）。

> 如果一个工具不能安全重试，它就不应该被 Agent 随意调用。

### 3.5 Java 落地示例

```java
public ToolResult dispatch(ToolCall toolCall, UserContext userContext) {
    Instant startedAt = Instant.now();
    try {
        ToolResult result = switch (toolCall.name()) {
            case "query_order" -> handleQueryOrder(toolCall.argumentsJson(), userContext);
            default -> ToolResult.failed("UNSUPPORTED_TOOL", "不支持的工具：" + toolCall.name());
        };
        auditLogService.record(AuditEvent.success(userContext.userId(), toolCall, result, startedAt));
        return result;
    } catch (Exception ex) {
        auditLogService.record(AuditEvent.failed(userContext.userId(), toolCall, ex, startedAt));
        return ToolResult.failed("TOOL_EXECUTION_FAILED", "工具执行失败。");
    }
}

private ToolResult handleQueryOrder(String argumentsJson, UserContext userContext) throws Exception {
    JsonNode arguments = OBJECT_MAPPER.readTree(argumentsJson);
    // 1. JSON Schema 结构校验
    Set<ValidationMessage> errors = queryOrderSchema.validate(arguments);
    if (!errors.isEmpty()) return ToolResult.failed("INVALID_ARGUMENTS", formatErrors(errors));

    QueryOrderArgs args = OBJECT_MAPPER.treeToValue(arguments, QueryOrderArgs.class);
    // 2. 业务权限校验
    if (!permissionService.canReadOrder(userContext.userId(), args.orderId()))
        return ToolResult.failed("FORBIDDEN", "无权查询该订单。");

    // 3. 执行查询
    OrderView order = orderService.queryOrder(args.orderId(), args.includeLogistics());
    if (order == null) return ToolResult.failed("ORDER_NOT_FOUND", "未查询到该订单。");
    return ToolResult.success(Map.of("orderId", order.orderId(), "status", order.status()));
}
```

重点：先按工具名分发 → 先做 Schema 校验 → 再做权限校验 → 工具返回结构化结果 → 全链路审计。

---

## 四、MCP 协议

### 4.1 什么是 MCP？

MCP（Model Context Protocol）是 Anthropic 在 2024 年底推出的开放协议，常见比喻是 **AI 领域的 USB-C**。核心价值：工具开发者只写一个 MCP Server，支持 MCP 的 AI 应用就能复用这套能力。

![MCP 图解](https://oss.javaguide.cn/github/javaguide/ai/skills/mcp-simple-diagram.png)

![手绘版](./image/agent/mcp-simple-diagram.svg)

MCP 通过 JSON-RPC 2.0 统一了 LLM 与外部数据源/工具的通信规范，支持四类原语：

| 原语类型 | 作用 | 例子 |
|---------|------|------|
| **Resources** | 只读数据流 | 本地文件、数据库记录、日志流 |
| **Tools** | 可执行动作 | Python 脚本、Slack 消息、SQL 查询 |
| **Prompts** | 可复用的提示词模板 | 代码审查模板、故障报告模板 |
| **Sampling** | Server 反过来请求 Host 的 LLM 推理 | 服务端主动触发生成 |

### 4.2 为什么需要 MCP？

在 MCP 出现之前，接入工具的工作量是：**工具数 × LLM 数量**。GitHub + GitLab + Jira + 文件系统 × GPT + Claude + DeepSeek，适配层代码就够写一个团队了。

MCP 要解决的碎片化问题：就像 USB-C 统一了充电口，一条线走天下。核心价值在于**解耦和标准化**——HTTP 统一了网页传输，MCP 统一的是 AI 与外部工具/数据源的交互方式。

### 4.3 MCP 与 Function Calling、Agent 的区别

| 场景 | 用什么 | 理由 |
|------|-------|------|
| 让 Claude 读取本地文件 | MCP | 标准化接口，跨平台复用 |
| 让 GPT 查天气 | Function Calling | 模型原生能力，简单直接 |
| 自动分析代码并修复 Bug | Agent | 需要多步规划、决策、反思 |

**Function Calling** 是 LLM 的推理层能力，负责把自然语言意图映射成结构化工具调用。**MCP** 是应用层的网络通信协议，定义工具怎么接入、被发现、被调用。**Agent** 是更高层的系统概念，规划、记忆、工具调用都算。

### 4.4 四层架构

MCP 采用分层架构：

- **MCP Host**：运行 AI 应用的地方（Claude Desktop、Cursor、VS Code）
- **MCP Client**：Host 内部组件，与 MCP Server 建立 1:1 连接
- **MCP Server**：开发者写的部分，暴露 Resources、Tools 等能力
- **Data Source**：实际数据和后端服务

> 常见误解：Host 直接连 Server。实际上 Host 内部会为每个配置的 Server 创建独立的 Client 实例，Server 之间互不影响。

### 4.5 完整调用流程

用「分析这个仓库的最新提交」走一遍：

```
用户提问 → LLM 决定需要外部能力 → 通过 Client 发 JSON-RPC 请求
→ Server 调后端服务 → 结果返回 → LLM 整合输出
```

### 4.6 为什么选 JSON-RPC 2.0？

- **轻量**：不用定义 Protobuf、生成桩代码
- **传输无关**：stdio、HTTP、WebSocket 都能跑
- **易调试**：纯文本格式，日志直接看
- **生态成熟**：几乎所有语言都有现成库

消息格式：

```json
// 请求
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": { "path": "/path/to/file.txt" }
  },
  "id": 1
}

// 响应
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{ "type": "text", "text": "文件内容..." }]
  }
}
```

### 4.7 传输方式：stdio vs Streamable HTTP

| 方式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **stdio** | 本地开发 | 极度轻量、无网络开销 | 权限边界需额外设计 |
| **Streamable HTTP** | 远程部署、生产环境 | 独立鉴权、兼容负载均衡 | 需要网络基础设施 |

![MCP 传输方式选择](https://oss.javaguide.cn/github/javaguide/ai/skills/mcp-transport-decision.png)

![手绘版](./image/agent/mcp-transport-decision.svg)

Streamable HTTP 是 2025 年 3 月引入的，核心变化：两个端点合并成一个 `/mcp` 端点，每条请求都能独立鉴权，天然兼容标准 HTTP 基础设施。

### 4.8 开发 MCP Server 的核心原则

**工具设计原则：**

- 反面典型：`execute_sql(sql)` — 什么都能干，也意味着可以执行任意 SQL
- 正确姿势：`get_user_by_id(id)` / `list_active_orders()` — 单一职责、语义明确
- 工具名称用动词+名词：`get_`、`list_`、`create_`、`update_`、`delete_`

**安全防护：**
- 路径遍历：验证文件路径，禁止 `../` 逃逸
- SQL 注入：用参数化查询
- 敏感信息：返回数据做脱敏
- 资源滥用：配置限速、配额和熔断

**大文件处理：** 分块加载（单块 ≤ 100KB）、按需加载、限制单条资源大小（< 10MB）、Token 控制交给 Host 端。

### 4.9 Python MCP Server 快速上手

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("weather-server")

@mcp.tool()
def get_weather(city: str) -> str:
    """获取指定城市的天气信息"""
    return f"{city} 今天晴天，温度 25°C"

@mcp.resource("weather://forecast")
def weather_forecast() -> str:
    """返回未来一周天气预报"""
    return "未来七天天气预报..."

if __name__ == "__main__":
    mcp.run()
```

---

## 五、Agent Skills

### 5.1 Skills 是什么？和 Prompt、MCP、Function Calling 到底差在哪？

**Prompt** 是一次性的意图表达。「帮我 Review 这段代码」说完就进入当前会话，换个项目很难稳定复用。

**MCP** 解决外部系统接入。文件系统、数据库、GitHub 通过 MCP Server 暴露给宿主。

**Function Calling** 更底层，描述模型怎么输出结构化调用意图（调哪个工具、参数怎么填）。

**Skills 卡在另一个位置：把一类任务的经验、约束和执行顺序沉淀下来，让 Agent 在需要时再读。**

一句话：**Skill 是一份「可调用的经验包」。**

真实链路里：
1. 用户提出任务
2. 宿主把可用 Skills 的简短描述放进上下文
3. 模型判断当前任务命中某个 Skill
4. 宿主再把完整 `SKILL.md` 加载进来
5. 模型按 Skill 里的流程去调工具、读资料、写结果

`load_skill()` 不是统一 API 名字，而是一个概念：宿主在合适的时候读取并激活 `SKILL.md`。

### 5.2 一个 Skill 长什么样？

```text
skill-name/
├── SKILL.md          ← YAML front-matter + 详细指令
├── scripts/          ← 可选：配套脚本
├── references/       ← 可选：参考资料
└── assets/           ← 可选：资源文件
```

`SKILL.md` 分两部分：前面是元数据（告诉宿主「我是谁、什么时候该用我」），后面是正文（具体流程、约束、示例和失败处理）。

**Skill 要拆小**：不要做「万能工程助手」——这种名字 Agent 不知道按 Review、重构、排障还是安全审计走。拆成：

- `api-endpoint-generator`：按项目统一响应结构生成接口代码
- `database-access-review`：检查索引、事务边界、慢查询风险
- `refactor-analysis`：先评估影响范围，再给出分步重构方案
- `security-audit`：盯 SQL 拼接、XSS、权限绕过

### 5.3 为什么要延迟加载？

Agent 的上下文窗口不是垃圾桶。几十条规范、十几份 SOP、几百个工具说明全塞进去，模型容易被噪声淹没，排在上下文中间的内容经常被忽略（Lost in the Middle）。

**渐进式披露（Progressive Disclosure）：**

![渐进式披露](https://oss.javaguide.cn/github/javaguide/ai/skills/skills-progressive-disclosure.svg)

![手绘版](./image/agent/skills-progressive-disclosure.svg)

两层设计：

| 层级 | 内容 | 作用 |
|------|------|------|
| 第一层（常驻） | Skill 名称 + description + 典型触发词 | 轻量目录，几十个 Skill 加起来也不重 |
| 第二层（按需） | 完整 `SKILL.md` 正文 | 模型命中后才加载 |

就像查书：先看目录，确定章节，再翻到具体页。Skill 元数据是目录，正文才是章节内容。

### 5.4 Skill 路由怎么做？

当 Skill 数量上来后，路由就变成一个小型检索问题。

![Skill 路由流程](https://oss.javaguide.cn/github/javaguide/ai/skills/skills-router.svg)

![手绘版](./image/agent/skills-router.svg)

路由流程：
1. **粗筛**：Skill 名称 + description + 典型 Query 样本向量化，用户请求向量化后取 top-5
2. **精排**：轻量 rerank 或规则（同时命中 title + description + examples 优先级更高）
3. **不选分支**：最高分都很低就走默认流程。「不选」比「硬选一个」更安全

**冷启动问题**：新 Skill 没有历史 Query，description 又写得虚。补救：加 `examples` 字段，把真实用户可能怎么问写进去。

路由四块：注册中心维护元信息和向量，路由引擎负责召回与打分，加载器按需读取正文，上下文装配器决定最终拼到哪里。

### 5.5 写 Skill 时最容易踩的坑

**坑一：把 Skill 当 README 写。** README 写给人看，Skill 写给 Agent 看。最重要的是可执行——告诉模型什么时候该用、按什么顺序做、哪些不能做、失败了怎么降级。

description 不是宣传语，而是路由索引。对比：

```yaml
# 差
name: log-analyzer
description: 分析系统日志

# 好
name: jvm-runtime-diagnosis
description: Diagnose Spring Boot production runtime issues. Use when the user pastes Java stack traces, mentions OOM, Full GC, high CPU, slow APIs, or asks why a service is stuck.
```

**坑二：Skill 太大。** 「系统故障排查器」里同时塞 JVM、数据库、K8s、网关、消息队列，Agent 不知道先看哪条线。按排查维度拆：`jvm-metrics-analyzer`、`distributed-trace-finder`、`k8s-pod-event-viewer`。

**坑三：让 LLM 做确定性工作。** 格式转换、精确计算、副作用操作交给脚本。LLM 负责读任务、提参数、解释结果，脚本负责真正的逻辑闭环。

**坑四：把所有参考资料塞进 SKILL.md。** 更好的结构：SKILL.md 放主流程，`references/` 放长文档，`runbooks/` 放历史案例。

### 5.6 第三方 Skills 的安全风险

恶意 `SKILL.md` 可能诱导模型读取敏感文件、把数据发到外部服务，或执行危险命令。企业场景做内部审核，只允许经过审查的 Skill；本地个人使用也建议先把正文读一遍。

---

## 六、Context Engineering 上下文工程

### 6.1 为什么上下文决定 Agent 表现？

同样的模型、同样的代码框架，Agent 表现天差地别——答案大概率出在**上下文**上。

**电商售后场景对比：**

| 版本 | 上下文 | 行为 |
|------|-------|------|
| 简陋版 | 只有用户消息 | 永远在要信息，从不主动整合 |
| 丰富版 | 订单记录 + 保修状态 + 用户画像 + 工具 | 直接告知订单详情，主动提出帮用户操作 |

**当前 Agent 的大部分失败，根源在上下文。** 上下文不够，模型再强也没用；上下文对了，中等水平的模型也能完成任务。

### 6.2 Context Engineering vs Prompt Engineering

| 维度 | Prompt Engineering | Context Engineering |
|------|-------------------|---------------------|
| 核心问题 | 怎么措辞、怎么排列 | 什么信息、什么格式、什么时机填入 |
| 关注点 | 指令本身的撰写 | 动态系统的构建 |
| 类比 | 教厨师做菜的口诀 | 配备齐全的厨房 |

![Prompt vs Context 工程维度对比](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/prompt-vs-context-engineering-dimension-comparison.svg)

![手绘版](./image/agent/prompt-vs-context-dimension.svg)

**Context Engineering 就是 LLM 的「内存管理与页面置换」**——上下文窗口是有限的内存，决定了这块内存里装什么、换出什么、什么时候读写。

### 6.3 六大核心板块

| 板块 | 内容 | 说明 |
|------|------|------|
| System Prompt | 静态规则的结构化编排 | `.cursorrules`、`.claude/rules` |
| User Prompt | 业务数据与指令 | 用户实际输入 |
| Memory | 短期滑动窗口 + 长期向量存储 | 跨 Session 记忆 |
| RAG & Tools | 动态检索外部文档 + 工具描述挂载 | 按需增强 |
| Structured Output | JSON Schema、Function Call 返回结构 | 影响下游解析衔接 |
| Token 优化 | 摘要压缩、历史剔除、Context Caching | 控制 Token 消耗 |

![上下文窗口 = LLM 的工作记忆](https://oss.javaguide.cn/github/javaguide/ai/llm/llm-context-window.png)

![手绘版](./img/llm-context-window.png)

### 6.4 上下文为何会失效？

**上下文存在边际效益递减，塞过头还会负向增长。** 原因：

- Transformer 注意力计算是 O(N²)，n 个 Token 产生 n² 量级的注意力关系
- 模型在更多 Token 间区分「相关」与「不相关」的辨别力下降
- **Context Rot（上下文腐化）**：上下文越长，信息回忆能力越差
- **Lost in the Middle**：对中间位置信息的记忆力显著低于首尾（U 型分布）
- 模型 Attention 模式在短序列数据上训练，长依赖处理经验不足

### 6.5 Token 预算的三级淘汰策略

![上下文 Token 预算的三级淘汰策略](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/context-token-budget-three-level-elimination-strategy.svg)

![手绘版](./image/agent/context-token-budget.svg)

| 优先级 | 内容 | 处理方式 |
|-------|------|---------|
| 低（可折叠） | 早期对话历史 | AI 摘要压缩 |
| 中（可精简） | RAG 检索的背景资料 | 二次裁剪，保留核心段落 |
| 高（绝对保护） | System Constraints + 核心工具描述 | 永不丢失 |

配套手段：**Context Caching**——大规模并发请求中，相同 System Prompt 部分只需加载一次。

### 6.6 动态信息的按需挂载

- **工具的懒加载（Tool Retrieval）**：面对大量 MCP 工具时，向量检索选出最相关的 Top-5 工具定义按需挂载
- **动态记忆与 RAG**：短期记忆滑动窗口管理，长期事实向量数据库检索，Observation 先摘要再写回上下文

### 6.7 Just-in-Time 按需加载

传统预检索在 Agent 场景下的问题：拿到的信息是「静态相关」的，Agent 执行中新发现的线索在预检索时根本不存在。

Just-in-Time 策略：Agent 运行时只维护轻量级引用句柄（文件路径、存储查询、Web 链接），真正需要时才通过工具动态拉取数据。**元数据本身就是信息**——文件路径就传递了语义差异。

**最优解：混合策略。** 确定性高的静态知识预检索，动态发现的信息按需拉取。Claude Code 就是典型——`CLAUDE.md` 预加载，具体文件内容靠运行时探索。

### 6.8 长任务上下文的三大武器

![长任务上下文持久化：抵抗腐化的三大武器](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/long-task-context-persistence-three-weapons-against-corruption.svg)

![手绘版](./image/agent/context-persistence-weapons.svg)

| 技术 | 机制 | 适用场景 |
|------|------|---------|
| **Compaction（压缩）** | 把历史内容给 LLM 总结，用摘要 + 最近文件创建新窗口 | 需要持续对话的长流程 |
| **Structured Note-taking（笔记）** | Agent 把进展写入 `NOTES.md`，重置后重新读取 | 迭代式开发、有清晰里程碑 |
| **Sub-agent（多 Agent）** | 子 Agent 处理专门任务，返回 1K-2K Token 摘要 | 复杂研究、需并行探索 |

---

## 七、Prompt Engineering 提示词工程

### 7.1 四要素框架（Role + Task + Context + Format）

![Prompt 四要素框架](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/prompt-four-element-framework.svg)

![手绘版](./image/agent/prompt-four-elements.svg)

| 要素 | 作用 | 常见表述 |
|------|------|---------|
| **Role（角色）** | 激活模型相关领域知识 | 「你是一位 10 年经验的 Java 架构师」 |
| **Task（任务）** | 明确要完成的具体动作 | 「请评审以下代码的性能问题」 |
| **Context（上下文）** | 提供任务相关的背景信息 | 「线上 QPS 2000，响应时间超 500ms」 |
| **Format（格式）** | 指定输出的结构要求 | 「输出 JSON，包含 bottleneck、solution 字段」 |

利用 Lost in the Middle 效应：角色定义放开头，格式要求放结尾。

### 7.2 六大核心技巧

![六大核心技巧](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/prompt-six-core-techniques.svg)

![手绘版](./image/agent/prompt-six-techniques.svg)

**角色扮演**：给模型明确的专家身份，回答更有针对性。「你是 AI」远不如「你是专注于性能优化的 Java 架构师」。

**思维链（CoT）**：给模型留中间计算的「草稿纸」。零样本 CoT 加一句「请一步步思考」；引导式 CoT 先思考三个关键问题；结构化 CoT 用 `<thinking>` 和 `<answer>` 标签分开推理和答案。

**少样本学习（Few-shot）**：复杂格式任务提供 1-3 个示例比纯文字描述更有效。选示例三原则：相关性要强、多样性要够、清晰性要好。简单格式 1 个够用，复杂格式 2-3 个，超过 3 个收益递减。

**任务分解**：静态分解（任务开始前完整规划子任务序列）和动态分解（执行中根据输出动态决定下一步）。

**结构化输出**：用 JSON Schema 精确定义输出结构。现代模型越来越多原生支持结构化输出（GPT-4o、Claude Sonnet 4.5、Gemini 1.5 Pro）。

**XML 标签与预填充**：用 `<analysis>` 等语义标签保持标签名一致，预填充强制模型跳过前言直接进入正题（如 Prompt 结尾加 `{`）。

### 7.3 减少幻觉

- **显式承认不确定性**：「如果对任何方面不确定，请直接说我没有足够的信息来评估」
- **引用验证**：先提取逐字引用，再基于引用分析
- **N 次最佳验证**：相同 Prompt 多次调用，比较输出不一致性
- **迭代改进**：将模型输出作为下一轮 Prompt 的输入验证

### 7.4 Prompt Injection 三层防护

![三层防护体系](https://oss.javaguide.cn/github/javaguide/ai/context-engineering/prompt-injection-protection-three-layer-defense-in-depth-system.svg)

![手绘版](./image/agent/prompt-injection-defense.svg)

| 层级 | 策略 | 核心措施 |
|------|------|---------|
| **执行层** | 权限最小化 + 沙箱隔离 | Docker/WebAssembly 隔离，API Key 严格受限 |
| **认知层** | Prompt 隔离与边界划分 | 分隔符包裹不可信数据，防止跨区覆盖 |
| **决策层** | 人机协同 | 高危操作触发中断，推送审批请求 |

---

## 八、Agent Memory 记忆系统

### 8.1 记忆系统概览

记忆层干两件事：**当下这一轮别把关键事实弄丢**，以及**隔几天再开本还能把用户偏好和历史决策捞回来**。

![记忆分类全景图](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-memory-taxonomy.svg)

![手绘版](./image/agent/memory-taxonomy.svg)

工业界通常划分为两个物理与逻辑隔离的层级：

![AI Agent 记忆系统架构](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-arch.png)

![手绘版](./image/agent/memory-arch.svg)

### 8.2 记忆的三种存储形式

| 存储形式 | 说明 | 典型实现 |
|---------|------|---------|
| **Token 级记忆** | 以自然语言或离散符号形式存于外部数据库 | 向量库中的文本块、结构化 JSON |
| **参数化记忆** | 将信息编码进模型参数中 | 预训练知识、LoRA 适配器、SFT 微调 |
| **潜在记忆** | 以隐式形式承载在模型内部表示中 | KV Cache、激活值、Hidden States |

MemOS 提出的「记忆立方体」框架支持三者动态流转：纯文本记忆 → 激活记忆（KV Cache）→ 参数记忆（通过蒸馏固化到模型）。

### 8.3 记忆的功能分类

| 功能类型 | 核心问题 | 存储内容 | 典型场景 |
|---------|---------|---------|---------|
| 事实记忆 | Agent 知道什么？ | 用户偏好、环境状态、显式事实 | 记住用户的技术栈偏好 |
| 经验记忆 | Agent 如何改进？ | 过往轨迹、成败教训、策略知识 | 从失败的代码审查中学习 |
| 工作记忆 | Agent 当前思考什么？ | 当前推理上下文、任务进展 | 多步推理中的中间状态 |

按内容性质细分：**情景记忆**（What happened?）、**语义记忆**（What does it mean?）、**程序记忆**（自动执行技能）。

### 8.4 记忆生命周期

![记忆操作的生命周期](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-lifestyle.png)

![手绘版](./image/agent/memory-lifecycle.svg)

```
编码(Encode) → 存储(Storage) → 提取(Retrieval) → 巩固(Consolidation) → 反思(Reflection) → 遗忘(Forgetting)
```

| 操作 | 说明 | 工程实现 |
|------|------|---------|
| **编码** | 原始交互 → 结构化信息 | LLM 提取事实三元组、生成摘要 |
| **存储** | 编码后信息持久化 | 写入向量库 / 图数据库 |
| **提取** | 根据上下文检索相关记忆 | 向量检索 + BM25 + 图遍历 |
| **巩固** | 短期记忆 → 长期记忆 | 异步任务：对话摘要 → 实体库 |
| **反思** | 主动回顾评估记忆内容 | 任务完成后提取 Meta-Knowledge |
| **遗忘** | 淘汰低价值或过时记忆 | 权重衰减 + 冲突标记废弃 |

**最容易被忽略的是遗忘。** 很多团队舍不得删，结果向量库里堆了几十万条记忆，检索召回 Top-K 里混着一堆过时噪音。

### 8.5 短期记忆 vs 长期记忆

**短期记忆（Working Memory）**：当前 Session 中的暂存信息，依托 LLM 上下文窗口。工程策略：滑动窗口裁剪、摘要压缩、重型结果卸载（大数据只保留引用标识）、多 Agent 间上下文隔离。

**长期记忆（Long-Term Memory）**：跨越 Session 的持久化知识与经验库。

- **写入**：对话结束后后台异步任务提取高价值结构化事实
- **检索**：新 Session 开始时向量化 Query，语义相似检索，prepend 进 System Prompt

![长期记忆与 RAG 的区别](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-rag-vs-memory.svg)

![手绘版](./image/agent/memory-rag-vs-memory.svg)

| RAG | 长期记忆 |
|-----|---------|
| 挂载共享知识源（公司规章、产品文档） | 管理个性化经验（偏好、习惯、历史决策） |
| 非个性化，所有用户返回相同内容 | 高度个性化，因人而异 |

两者是协作关系：RAG 提供「世界知识」，长期记忆提供「用户画像」。

### 8.6 主流 Memory 产品对比

| 产品 | 核心思想 | 技术亮点 | 适用场景 |
|------|---------|---------|---------|
| **Mem0** | 单次 ADD-only 抽取 + 多信号融合检索 | 语义 + BM25 + Entity Linking 并行打分 | 通用对话记忆 |
| **LETTA (原 MemGPT)** | 操作系统虚拟内存分页 | Main Context ↔ External Context 动态交换 | 长对话上下文管理 |
| **ZEP** | 时间感知知识图谱 | 情景/语义/社区三层子图 + 边失效机制 | 企业级多租户 |
| **A-MEM** | Zettelkasten 知识管理 | 卡片笔记法，记忆间自动建立语义连接 | 知识密集型任务 |
| **MemOS** | 三种记忆类型动态转换 | 纯文本 ↔ KV Cache ↔ LoRA | 全栈记忆管理 |
| **MIRIX** | 六模块分工协作 | 不同记忆组件采用不同存储结构 | 复杂决策支持 |

### 8.7 记忆检索优化

**核心结论：检索链路优化的 ROI 远高于写入链路。** 体感「记忆没用」时，十有八九是 Recall 跑偏或精排没把真相关顶上来。

![检索优化策略](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-retrieval-optimization.png)

![手绘版](./image/agent/memory-retrieval-optimization.svg)

- **混合检索（Hybrid Search）**：BM25 关键词 + 向量语义，RRF / 线性加权 / Cross-encoder Reranker 三种融合方式
- **元数据硬过滤**：向量检索前按 UserID、时间范围过滤，多租户场景最关键的数据隔离手段

### 8.8 Markdown 作为 Agent 记忆

Markdown 是**人机共写的明文长期记忆**：不强制向量检索，靠目录组织 + `@`/`rules` 运行。

![Markdown 记忆和传统长期记忆的适用边界](https://oss.javaguide.cn/github/javaguide/ai/agent/agent-memory-markdown-memory-boundary.svg)

![手绘版](./image/agent/memory-markdown-boundary.svg)

**CLAUDE.md 的层级：**

| 层级 | 位置 | 作用范围 |
|------|------|---------|
| 组织级 | 系统目录 | 所有用户 |
| 用户级 | `~/.claude/CLAUDE.md` | 个人所有项目 |
| 项目级 | `./CLAUDE.md` | 团队共享，提交至 Git |
| 本地级 | `./CLAUDE.local.md` | 个人当前项目，加入 .gitignore |

**该写什么**：技术栈版本信息、常用命令（代码块里）、架构决策和理由、团队约定和项目特有的坑。
**不该写什么**：代码风格（交给格式化工具）、语言/框架默认行为、大段参考文档（给链接）。

> 每条规则都应该对应一个 Claude 真实犯过的错误。如果删掉某条后 Claude 行为没变，那它从来就没起作用。

**Auto Memory**：Claude Code v2.1.59+ 默认开启，Claude 根据对话自动写入笔记到 `MEMORY.md`。

---

## 九、AI Workflow / Graph / Loop

### 9.1 为什么 AI 系统需要工作流？

单轮对话能回答问题，但很难稳定地**交付结果**。线上真实任务很少是「问一句答一句」就完事——检索信息、调用工具、输出结构化结果、校验格式、失败重试、不满意再来一轮，这些步骤串起来才叫交付。

LLM 的输出天然不确定，引出了三个核心需求：
1. 下一步不唯一，需动态决策路径
2. 结果不理想时需自动修正
3. 中间状态必须被记录

**工作流就是把一次性生成变成可迭代、可收敛、可控制的系统化流程。**

### 9.2 传统工作流 vs AI 工作流

![传统 Workflow 与 AI Workflow 对比](https://oss.javaguide.cn/github/javaguide/ai/workflow/traditional-vs-ai-workflow.svg)

![手绘版](./image/agent/traditional-vs-ai-workflow.svg)

| 维度 | 传统工作流 | AI 工作流 |
|------|----------|----------|
| 分支条件 | 设计时确定（金额 > 10000 走高级审批） | 运行时评估（生成结果是否达标） |
| 节点确定性 | 相同输入，相同输出 | 同一节点可能因不确定性反复执行 |
| 状态传递 | 参数传递 | 上下文、草稿、评分、错误信息、历史轮次 |
| 失败处理 | 报错结束 | 降级、回退、换策略 |

![传统 Workflow 与 AI Workflow 对比](https://oss.javaguide.cn/github/javaguide/ai/workflow/workflow-graph-loop-relation.svg)

![手绘版](./image/agent/workflow-graph-loop-relation.svg)

### 9.3 Graph：工作流的结构

> **Workflow 是目标与过程，Graph 是结构与载体，Loop 是图上的控制模式。**

三类核心元素：

**Node（节点）**：执行单元，读取状态 → 执行逻辑 → 更新状态。

**Edge（边）**：控制流抽象，决定节点间执行路径。

| 边类型 | 说明 |
|-------|------|
| 顺序边 | 固定顺序执行 |
| 条件边 | 根据运行时状态在预定义候选路径中选择 |
| 动态路由 | 候选节点在运行时动态确定 |
| 循环边 | 回到前序节点重复执行 |
| 终止边 | 流程结束 |
| 并行边 | 同时分发到多个后续节点 |

**State（状态）**：流程执行中持续被读写的共享上下文，常见实现是键值对数据结构。

三种更新策略：

| 策略 | 说明 | Spring AI Alibaba | LangGraph |
|------|------|-------------------|-----------|
| 覆盖（Replace） | 新值直接替换旧值 | `ReplaceStrategy` | 默认行为 |
| 追加（Append） | 新值追加到已有列表 | `AppendStrategy` | `Annotated[list, operator.add]` |
| 自定义合并（Reducer） | 自定义合并逻辑 | — | `add_messages` 等自定义函数 |

![Graph 核心元素：Node、Edge、State](https://oss.javaguide.cn/github/javaguide/ai/workflow/graph-core-elements.svg)

![手绘版](./image/agent/graph-core-elements.svg)

### 9.4 Loop：图上的回溯控制

**Loop 是图结构上的一种控制模式**——当某条边根据当前状态把控制流送回先前节点时，形成 Loop。

![Loop 概览](https://oss.javaguide.cn/github/javaguide/ai/workflow/loop-mechanism.svg)

![手绘版](./image/agent/loop-mechanism.svg)

两种 Loop：

| 类型 | 类比 | 示例 |
|------|------|------|
| 固定次数循环 | `for` | 「最多重试 3 次」 |
| 条件驱动循环 | `while` | 「只要评分低于 80 分，就继续修改」 |

AI 场景里第二类更有代表性，但实际开发两者必须同时使用——LLM 不确定性可能导致一直不合格，需要固定次数做降级兜底。

**可靠 Loop 三要素：**
- 继续条件：为什么还要再来一轮
- 退出条件：什么时候已经足够好
- 安全边界：最大轮次、超时、预算、熔断

> Agent Loop（外层）是 Agent 顶层运行引擎，Graph Loop（内层）是特定节点子集的回溯控制。两者可以嵌套。

### 9.5 Spring AI Alibaba Graph 代码实现

以「生成 → 审核 → 修改」文章审核工作流为例：

```java
// 配置状态键策略
public static KeyStrategyFactory createKeyStrategyFactory() {
    return () -> {
        HashMap<String, KeyStrategy> strategies = new HashMap<>();
        strategies.put("input", new ReplaceStrategy());
        strategies.put("messages", new AppendStrategy());        // 对话历史追加
        strategies.put("current_draft", new ReplaceStrategy());  // 当前草稿覆盖
        strategies.put("review_score", new ReplaceStrategy());
        strategies.put("review_feedback", new ReplaceStrategy());
        strategies.put("iteration_count", new ReplaceStrategy());
        strategies.put("output", new ReplaceStrategy());
        strategies.put("next_node", new ReplaceStrategy());      // 路由控制
        return strategies;
    };
}

// 审核节点中的路由逻辑
String nextNode = (score >= 80 || count >= 3) ? "exit" : "revise";
return Map.of(
    "review_score", score,
    "review_feedback", feedback,
    "iteration_count", count + 1,
    "next_node", nextNode
);

// 组装 Graph
StateGraph workflow = new StateGraph(createKeyStrategyFactory())
    .addNode("draft", draft)
    .addNode("review", review)
    .addNode("revise", revise)
    .addNode("exit", exit);

workflow.addEdge(START, "draft");
workflow.addConditionalEdges("draft",
    edge_async(state -> (String) state.value("next_node").orElse("review")),
    Map.of("review", "review"));
workflow.addConditionalEdges("review",
    edge_async(state -> (String) state.value("next_node").orElse("exit")),
    Map.of("revise", "revise", "exit", "exit"));
workflow.addConditionalEdges("revise",
    edge_async(state -> (String) state.value("next_node").orElse("review")),
    Map.of("review", "review"));
workflow.addEdge("exit", END);
```

### 9.6 工作流落地时的坑

| 问题 | 建议 |
|------|------|
| State 太粗/太细 | 按业务含义分块：用户输入、当前结果、审核结论、流程控制 |
| 循环终止条件模糊 | 明确最大轮次、评分阈值、超时上限、连续失败 fallback |
| 错误处理缺失 | 瞬时错误重试、LLM 可恢复错误循环回去、用户可修复转人工、意外错误冒泡 |
| Token 与成本失控 | 哪些节点必须大模型、哪些用代码替代、先粗筛再精修 |
| 节点间数据传递 | 统一 JSON Schema 或 Pydantic 模型定义 |

### 9.7 错误分类与处理策略

| 错误类型 | 示例 | 处理策略 |
|---------|------|---------|
| 瞬时错误 | 网络超时、API 限流 | 指数退避重试 |
| LLM 可恢复错误 | 工具调用失败、输出格式异常 | 塞进 State，循环回去让 LLM 调整 |
| 用户可修复错误 | 缺少必要信息 | `interruptBefore` 暂停，等人工输入 |
| 意外错误 | 未知异常 | 异常冒泡，交给开发者 |

分布式弹性模式：指数退避重试、熔断器、舱壁隔离、补偿事务（Saga）。

---

## 十、Harness Engineering

### 10.1 什么是 Harness？

**Agent = Model + Harness。你不是模型，那你就是 Harness。**

![Agent = Model + Harness](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-agent-equals-model-harness-arch.png)

![手绘版](./image/agent/harness-agent-model.svg)

Harness 就是模型之外的一切——系统提示词、工具调用、文件系统、沙箱环境、编排逻辑、钩子中间件、反馈回路、约束机制。

> 模型是 CPU，Harness 是操作系统。CPU 再强，OS 拉胯也白搭。

**模型做不到的，就是 Harness 要补的：**

| 模型做不到 | Harness 怎么补 | 核心组件 |
|-----------|---------------|---------|
| 记住多轮对话历史 | 维护对话历史，拼进上下文 | 记忆系统 |
| 执行代码、跑命令 | Bash + 代码执行环境 | 通用执行环境 |
| 获取实时信息 | Web Search、MCP 工具 | 外部知识获取 |
| 操作文件和环境 | 文件系统抽象 + Git | 文件系统 |
| 知道自己做对了没有 | 沙箱 + 测试工具 + 浏览器自动化 | 验证闭环 |
| 长任务中保持连贯 | 上下文压缩、记忆文件、进度追踪 | 上下文管理 |

### 10.2 Prompt / Context / Harness Engineering 三层关系

![三层关系](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-engineering-layers-arch.png)

![手绘版](./image/agent/harness-layers-relation.svg)

| 层级 | 解决的核心问题 | 关注点 |
|------|-------------|-------|
| **Prompt Engineering** | 表达——怎么写好指令 | 塑造局部概率空间 |
| **Context Engineering** | 信息——给 Agent 看什么 | 在合适时机拿到正确信息 |
| **Harness Engineering** | 执行——系统怎么防崩、怎么持续运转 | 长链路正确、偏差纠正、故障恢复 |

### 10.3 六层架构

![六层架构](https://oss.javaguide.cn/github/javaguide/ai/harness/harness-engineering-six-layer-architecture.svg)

![手绘版](./image/agent/harness-six-layer.svg)

| 层级 | 名称 | 解决问题 | 关键设计 |
|------|------|---------|---------|
| L1 | 信息边界层 | Agent 该知道什么、不该知道什么 | 定义角色与目标，裁剪无关信息 |
| L2 | 工具系统层 | Agent 怎么跟外部世界交互 | 工具选拔、调用时机、结果提炼 |
| L3 | 执行编排层 | 多步骤任务怎么串 | 理解目标→判断信息→分析→生成→检查 |
| L4 | 记忆与状态层 | 长任务中间结果怎么管 | 独立管理当前任务状态 + 长期记忆 |
| L5 | 评估与观测层 | Agent 怎么知道自己做对了 | 独立验证机制 |
| L6 | 约束、校验与恢复层 | 出错了怎么办 | 预设规则拦截，提供重试/回滚机制 |

**不要试图一开始就搭齐六层。** 从 L1（信息边界）和 L6（约束恢复）入手，投入产出比最高。

### 10.4 为什么瓶颈不在模型而在 Harness？

同一个模型只换了文件编辑接口的调用方式，编码基准分数从 6.7% 直接跳到 68.3%。模型没变，变的是 Harness。

LangChain 优化 Agent 运行环境（文档组织、验证回路、追踪系统），Terminal Bench 2.0 从第 30 名升到第 5 名，得分从 52.8% 提升到 66.5%。模型没换，Harness 换了。

> 很多团队 Agent 表现不好第一反应是「换更强的模型」——瓶颈大概率不在模型智能水平，而在 Harness 的基础设施质量。

### 10.5 40% 阈值：上下文喂越多越蠢

![40% 阈值现象](https://oss.javaguide.cn/github/javaguide/ai/harness/context-utilization-40-percent-threshold-phenomenon.svg)

![手绘版](./image/agent/context-40-percent.svg)

| 区间 | 占比 | 表现 |
|------|------|------|
| **Smart Zone** | 0~40% | 推理聚焦、工具调用准确、代码质量高 |
| **Dumb Zone** | >40% | 幻觉增多、兜圈子、格式混乱、低质量代码 |

建议设置 40% 阈值告警——当 Agent 上下文占用超过此比例时触发压缩或任务交接。

### 10.6 从零搭建 Harness 的行动清单

**P0（立即做）：**
- 创建 `AGENTS.md` 并持续维护（Agent 犯错就更新，形成反馈循环）
- 构建自定义 Linter + 修复指令（错误消息里告诉 Agent 怎么改）
- 把团队知识放进仓库（Slack/Wiki/Docs 里的知识对 Agent 等于不存在）

**P1（P0 之后）：**
- 分层管理上下文（渐进式披露，`AGENTS.md` 当目录用）
- 建立进度文件和功能列表（JSON 格式追踪状态）
- 给 Agent 端到端验证能力（Playwright/Puppeteer MCP）
- 控制上下文利用率（尽量不超过 40%，增量执行）

**P2（有余力再考虑）：**
- Agent 专业化分工
- 定期垃圾回收（后台 Agent 清理低质量代码）
- 可观测性集成

### 10.7 一线团队实战

#### OpenAI：三个人、五个月、一百万行、零手写代码

| 指标 | 数值 |
|------|------|
| 团队 | 3 名工程师（后扩至 7 人） |
| 代码规模 | 约 100 万行 |
| 手写代码 | **0 行** |
| 合并 PR 数 | 约 1,500 个 |
| 效率提升 | 约 10 倍 |

五大方法论：
1. **给 Agent 一张地图**：`AGENTS.md` 约 100 行当目录，详细文档按需加载
2. **架构约束靠工具强制执行**：自定义 Linter + 结构测试，违反就报错并告诉怎么改
3. **可观测性给 Agent 看**：Chrome DevTools Protocol 接入 Agent 运行时
4. **主动对抗熵**：后台 Agent 定期扫描低质量代码，自动提交清理 PR
5. **仓库为唯一事实源**：写在 Slack/Wiki 里的知识对 Agent 等于不存在

> If it cannot be enforced mechanically, agents will deviate.

#### Anthropic：从上下文焦虑到 GAN 式三 Agent 架构

![三智能体协同架构](https://oss.javaguide.cn/github/javaguide/ai/harness/anthropic-three-agent-collaborative-architecture-inspired-by-gan.svg)

![手绘版](./image/agent/anthropic-three-agent.svg)

- **Planner**：产品描述扩展为完整产品规格
- **Generator**：按功能做 Sprint，每个 Sprint 有明确完成标准
- **Evaluator**：用 Playwright MCP 实际运行应用打分

**上下文焦虑的解决方案——Context Resets**：上下文快满时不压缩而是直接清空，但通过结构化交接文档把关键状态留下来，启动全新 Agent 从干净状态继续工作。

Carlini 用 16 个并行 Agent、2000 个会话，产出 10 万行 Rust 代码的 C 编译器，GCC torture test 99% 通过率。关键设计：日志不打控制台避免上下文污染，测试不全部跑而是随机子集。

> Harness 中的每个组件都编码了一个关于「模型靠自己做不到什么」的假设，而这些假设值得定期压力测试。

#### Stripe：每周 1300+ PR，全程无人值守

![Stripe 混合状态机编排架构](https://oss.javaguide.cn/github/javaguide/ai/harness/stripe-hybrid-state-machine-orchestration-architecture.svg)

![手绘版](./image/agent/stripe-hybrid-state-machine.svg)

| 组件 | 关键设计 |
|------|---------|
| Devbox | AWS EC2 预热池分配，启动约 10 秒 |
| 编排状态机 | 混合确定性节点（lint、push）和 Agent 节点（实现功能、修 CI） |
| Toolshed MCP | 集中式 MCP 服务，近 500 个工具 |
| 反馈回路 | Pre-push hook 秒级修 lint，最多 2 轮 CI |

> What's good for humans is good for agents.

#### Mitchell Hashimoto：不跑多 Agent，一个人的 Harness

六步路线：放弃聊天模式 → 复现自己的工作 → 下班前启动 Agent → 外包确定性任务 → 工程化 Harness（Agent 犯错就工程化解决方案） → 始终有 Agent 在跑。

![持续进化的 Harness 防错反馈闭环](https://oss.javaguide.cn/github/javaguide/ai/harness/continuously-evolving-harness-error-prevention-feedback-loop.svg)

![手绘版](./image/agent/harness-feedback-loop.svg)

### 10.8 工作流安全

**OWASP LLM Top 10 相关威胁：**
- **提示注入级联**：恶意输入逐节点传播放大
- **工具调用权限边界**：每个节点最小权限原则
- **输出内容安全过滤**：进入下游系统前必须校验

**工作流特有安全风险：**
- **State 污染**：恶意输入通过路由控制字段（如 `next_node`）跳过审核节点。防御：路由字段白名单校验。
- **Loop 放大攻击**：恶意输入使 ReviewNode 永远返回低分，消耗大量 Token。防御：Token 消耗预算作为独立安全边界。

---

## 十一、面试速答

### 1. 什么是 AI Agent？和普通聊天机器人有什么区别？

Agent = LLM + Planning + Memory + Tools。和聊天机器人的区别在于自主性和交互性——Agent 能感知环境、做决策、执行动作，在动态环境中持续迭代直到任务完成，而不是一问一答。

### 2. Agent Loop 是什么？

Agent 的运行引擎，本质是一个 while 循环：LLM 推理 → 工具调用 → 上下文更新，直到任务终止。工程难点在于管理随迭代不断增长的上下文。

### 3. ReAct 和 Plan-and-Execute 有什么区别？

ReAct 是「边想边做」，每步根据当前观察动态决策。Plan-and-Execute 是「先规划再执行」，先生成全局计划再逐步完成。ReAct 更灵活，Plan-and-Execute 更结构化。实际项目往往结合使用。

### 4. Function Calling 的本质是什么？

不是模型调用了函数，而是模型根据工具描述生成结构化工具调用意图（工具名 + 参数 JSON）。真正执行函数的是业务服务。价值在于完成「自然语言意图 → 结构化参数」的映射。

### 5. Function Calling 和 MCP 有什么区别？

Function Calling 是 LLM 推理层能力，负责生成调用意图。MCP 是应用层通信协议，定义工具怎么接入、被发现、被调用。Function Calling 是底层「神经信号」，MCP 是工具接入「接口标准」。

### 6. MCP 的四层架构是什么？

Host（AI 应用）→ Client（Host 内部组件，与 Server 1:1 连接）→ Server（暴露 Resources/Tools/Prompts）→ Data Source（文件系统、数据库、API）。

### 7. Agent Skills 和 Prompt 的区别？

Prompt 是一次性的意图表达。Skill 是可复用的任务经验包——把一类任务的经验、约束、执行顺序沉淀为 `SKILL.md`，Agent 通过渐进式披露按需加载。

### 8. 为什么 Skill 要延迟加载？

上下文窗口有限。常驻轻量目录（名称 + description），只在模型判断命中后才加载完整正文。避免上下文被不相关流程撑爆。

### 9. Context Engineering 和 Prompt Engineering 的区别？

Prompt Engineering 管「怎么措辞」。Context Engineering 管「什么信息、什么格式、什么时机填入上下文」——构建的是一套动态上下文供给系统。

### 10. Token 预算的三级淘汰策略是什么？

低优先级（早期对话历史）→ 摘要压缩；中优先级（RAG 背景资料）→ 二次裁剪保留核心；高优先级（系统约束 + 核心工具描述）→ 绝对保护。

### 11. Agent 记忆的三种存储形式？

Token 级记忆（向量库文本块）、参数化记忆（预训练/LoRA）、潜在记忆（KV Cache/激活值）。三者可动态流转：文本 → KV Cache → LoRA。

### 12. 短期记忆和长期记忆的区别？

短期记忆活在当前 Session 进程里，依托上下文窗口。长期记忆落在数据库里，跨 Session 持久化。两者物理和逻辑隔离。

### 13. Workflow、Graph、Loop 三者什么关系？

Workflow 是目标与过程，Graph 是结构与载体，Loop 是图上的控制模式。三者是同一件事的三个观察角度。

### 14. Graph 的核心元素有哪些？

Node（执行单元，读状态 → 执行 → 更新状态）、Edge（控制流，顺序/条件/动态路由/循环/终止/并行）、State（共享上下文，覆盖/追加/自定义合并三种更新策略）。

### 15. Loop 如何防止死循环？

三要素：继续条件（为什么还要再来）、退出条件（什么时候够好了）、安全边界（最大轮次 + 超时 + Token 预算 + 熔断）。

### 16. Harness Engineering 的六层架构是什么？

L1 信息边界 → L2 工具系统 → L3 执行编排 → L4 记忆与状态 → L5 评估与观测 → L6 约束、校验与恢复。从 L1 和 L6 入手投入产出比最高。

### 17. 为什么瓶颈不在模型而在 Harness？

同一个模型只换了接口格式，分数从 6.7% 跳到 68.3%。LangChain 优化 Harness 后 Terminal Bench 从第 30 升到第 5。基础设施质量对 Agent 表现的影响往往大于模型本身。

### 18. 40% 阈值是什么意思？

上下文窗口用到约 40% 时，Agent 输出质量开始明显下降——幻觉增多、兜圈子、格式混乱。应监控上下文利用率，超出时触发压缩或任务交接。

### 19. Agent 面临的主要挑战有哪些？

上下文窗口限制、幻觉、Token 消耗、Prompt Injection 安全风险、规划能力上限、可观测性不足。

### 20. 一句话总结：怎么理解从 Function Calling 到 Agent Skills 的技术栈？

Function Calling 是底层「神经信号」（模型生成调用意图），MCP 是工具接入「接口标准」，Context Engineering 是「内存管理」，Prompt Engineering 是「措辞表达」，Skills 是「可复用经验包」，Harness Engineering 是「操作系统」。它们在不同层级解决不同问题，组合起来才是完整的 Agent。

---

## 总结

1. **Agent 的本质**：LLM + Planning + Memory + Tools，一个能感知环境、做决策、执行动作的自主系统。
2. **范式选择**：ReAct 灵活但延迟高，Plan-and-Execute 结构化但容错弱，Reflection 叠加增强，Multi-Agent 并行但调试难。实际项目组合使用。
3. **Function Calling ≠ 执行函数**：模型生成调用意图，业务侧执行、校验、权限、审计。
4. **MCP 是工具接入的 USB-C**：一次开发多处复用，JSON-RPC 2.0 + stdio/Streamable HTTP 双传输模式。
5. **Skills 是可复用的经验包**：渐进式披露（元数据常驻 + 正文按需加载），路由用向量检索 + 精排。
6. **上下文是系统输出，不是静态配置**：每次 LLM 调用前都在组装动态上下文，这个组装逻辑才是工程核心。
7. **记忆系统三层对齐**：Agent 知道什么事实、从过往任务学到了什么、此刻正在处理什么。
8. **Graph + State + Loop 是工作流不变的内核**：Node 抽象职责，Edge 抽象流转，State 驱动决策，Loop 控制回溯。
9. **Harness 是 Agent 的操作系统**：六层架构从信息边界到故障恢复形成完整闭环，瓶颈不在模型而在 Harness。
10. **服务端校验永远不能省**：这是 Agent 进入生产环境的底线。
11. **没有观测就没有稳定性**：traceId、TTFT、usage、attempt、parse failure rate——少一个字段，线上排查多几倍时间。
