# snaker工作流引擎web设计器
情怀！N年前使用的工作流引擎，虽然原作者已经不再维护，但是还是有那么一波人还在使用。个人看来其核心功能尚好，麻雀虽少，五脏俱全，是用来学习工作流引擎的好项目。但其流程设计器所用的技术栈可能就跟不上时代了（2016年前的开源项目）。为了让大伙或自己用得更舒心，或者也为了让更多人认识或重新认识这个工作流引擎。本人就花些许时间，使用现阶段前端主流的技术栈重新开发此款流程设计器。如大家在使用的过程中如有啥问题，欢迎留言或进群交流！

# 加群交流可加作者微信：mldong_  （`微信号有下划线`）

[在线体验] (https://snaker.mldong.com/)

[编辑模式] (https://snaker.mldong.com/)

[只读模式] (https://snaker.mldong.com/preview)

[高亮模式] (https://snaker.mldong.com/highLight)

[xml数据] (https://snaker.mldong.com/xml)

# 使用案例
[后端工程] (https://gitee.com/mldong/mldong)

[前端工程] (https://gitee.com/mldong/mldong-vue)

# 如何使用
## 安装
```bash
npm install snakerflow-designer-vue@latest --save
```
## 其他依赖
设计器依赖以下第三方库，如果工程中没有引入这些第三库将会无法正常使用，需自行安装。
```bash
npm install @logicflow/core@^1.1.3 --save
npm install @logicflow/extension@^1.1.3 --save
npm install clipboard@^2.0.10 --save
npm install element-ui@^2.15.6 --save
npm install vue-json-pretty@^1.8.2 --save
```
## 引入
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

// 导入组件库
import SnakerFlowDesigner from 'snakerflow-designer-vue'
// 注册组件库
Vue.use(SnakerFlowDesigner)
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```
## 样例
### 编辑模式
```html
<!-- https://gitee.com/mldong/snakerflow-designer-vue/blob/master/examples/views/Home.vue -->
<SnakerFlowDesigner ref='designer' v-model="flowData" @on-save="handleSave"/>

```
### 只读模式
```html
<!-- https://gitee.com/mldong/snakerflow-designer-vue/blob/master/examples/views/Preview.vue -->
<SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
```
### 高亮模式
```html
<!-- https://gitee.com/mldong/snakerflow-designer-vue/blob/master/examples/views/HighLight.vue -->
<SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData" :high-light="highLight"/>
```
### XML数据
```html
<!-- https://gitee.com/mldong/snakerflow-designer-vue/blob/master/examples/views/Xml.vue -->
<SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
```
## 属性
|  参数   | 说明  | 类型  |可选值  |默认值  |
|  ----  | ----  | ----  | ----  |----  |
| value / v-model	  | 绑定值（xml或json） | string/object  |--  |--  |
| config	  | LogicFlow配置 | object  |--  |--  |
| viewer	  | 是否预览模式 | boolean  | true/false |false  |
| highLight	  | 高亮数据，具体见下表 | object  | -- | --  |
### highLight
|  参数   | 说明  | 类型  |可选值  |默认值  |
|  ----  | ----  | ----  | ----  |----  |
| historyNodeNames	  | 历史节点名称 | array  |--  |--  |
| historyEdgeNames	  | 历史边名称 | array  |--  |--  |
| activeNodeNames	  | 活跃节点名称 | array  |--  |--  |
## 方法
|  方法名   | 说明  | 参数  |
|  ----  | ----  | ----  |
| importXml | 导入SnakerFlow流程定义数据  | (xml) snakerflow流程定义xml |
| importJson | 导入LogicFlow流程定义数据  | (data) LogicFlow流程定义json对象或json字符串 |
| setHighLight | 设置高亮数据  | (data) 和属性中的hightLight数据结构一致  |
## 事件
|  事件名称   | 说明  | 回调参数  |
|  ----  | ----  | ----  |
| on-save | 点击右上角工具栏保存按钮时触发  | 传递流程图数据对象data,包含json和xml数据({json, xml})  |


# 本地开发
## 安装
```bash
npm install
```

## 开发
```bash
npm run serve
```

## 打包编译
```bash
npm run build
```

## 校验
```bash
npm run lint
```
# 数据
## JSON样例数据
``` json
{
  "name": "leave",
  "displayName": "请假",
  "expireTime": "",
  "instanceUrl": "leaveForm",
  "nodes": [
    {
      "id": "start",
      "type": "snaker:start",
      "x": 340,
      "y": 160,
      "properties": {},
      "text": {
        "x": 340,
        "y": 200,
        "value": "开始"
      }
    },
    {
      "id": "apply",
      "type": "snaker:task",
      "x": 520,
      "y": 160,
      "properties": {
        "taskType": "Major",
        "performType": "ANY",
        "autoExecute": "N",
        "assignee": "approve.operator"
      },
      "text": {
        "x": 520,
        "y": 160,
        "value": "请假申请"
      }
    },
    {
      "id": "approveDept",
      "type": "snaker:task",
      "x": 740,
      "y": 160,
      "properties": {
        "assignee": "",
        "taskType": "Major",
        "performType": "ANY",
        "autoExecute": "N",
        "assignmentHandler": "com.mldong.config.FlowAssignmentHandler"
      },
      "text": {
        "x": 740,
        "y": 160,
        "value": "部门领导审批"
      }
    },
    {
      "id": "end",
      "type": "snaker:end",
      "x": 1080,
      "y": 160,
      "properties": {},
      "text": {
        "x": 1080,
        "y": 200,
        "value": "结束"
      }
    },
    {
      "id": "2c75eebf-5baf-4cd0-a7b3-05466be13634",
      "type": "snaker:decision",
      "x": 740,
      "y": 340,
      "properties": {}
    },
    {
      "id": "approveBoss",
      "type": "snaker:task",
      "x": 900,
      "y": 480,
      "properties": {
        "assignee": "",
        "taskType": "Major",
        "performType": "ANY",
        "autoExecute": "N",
        "assignmentHandler": "com.mldong.config.FlowAssignmentHandler"
      },
      "text": {
        "x": 900,
        "y": 480,
        "value": "公司领导审批"
      }
    }
  ],
  "edges": [
    {
      "id": "3037be41-5682-4344-b94a-9faf5c3e62ba",
      "type": "snaker:transition",
      "sourceNodeId": "start",
      "targetNodeId": "apply",
      "startPoint": {
        "x": 358,
        "y": 160
      },
      "endPoint": {
        "x": 460,
        "y": 160
      },
      "properties": {},
      "pointsList": [
        {
          "x": 358,
          "y": 160
        },
        {
          "x": 460,
          "y": 160
        }
      ]
    },
    {
      "id": "c79642ae-9f28-4213-8cdf-0e0d6467b1b9",
      "type": "snaker:transition",
      "sourceNodeId": "apply",
      "targetNodeId": "approveDept",
      "startPoint": {
        "x": 580,
        "y": 160
      },
      "endPoint": {
        "x": 680,
        "y": 160
      },
      "properties": {},
      "pointsList": [
        {
          "x": 580,
          "y": 160
        },
        {
          "x": 680,
          "y": 160
        }
      ]
    },
    {
      "id": "09d9b143-9473-4a0f-8287-9abf6f65baf5",
      "type": "snaker:transition",
      "sourceNodeId": "approveDept",
      "targetNodeId": "2c75eebf-5baf-4cd0-a7b3-05466be13634",
      "startPoint": {
        "x": 740,
        "y": 200
      },
      "endPoint": {
        "x": 740,
        "y": 315
      },
      "properties": {},
      "pointsList": [
        {
          "x": 740,
          "y": 200
        },
        {
          "x": 740,
          "y": 315
        }
      ]
    },
    {
      "id": "517ef2c7-3486-4992-b554-0f538ab91751",
      "type": "snaker:transition",
      "sourceNodeId": "2c75eebf-5baf-4cd0-a7b3-05466be13634",
      "targetNodeId": "end",
      "startPoint": {
        "x": 764,
        "y": 339
      },
      "endPoint": {
        "x": 1080,
        "y": 178
      },
      "properties": {
        "expr": "#f_day<3"
      },
      "text": {
        "x": 912,
        "y": 339,
        "value": "请假天数小于3"
      },
      "pointsList": [
        {
          "x": 764,
          "y": 339
        },
        {
          "x": 1080,
          "y": 339
        },
        {
          "x": 1080,
          "y": 178
        }
      ]
    },
    {
      "id": "d7ec4166-f3fc-4fd6-a2ac-a6c4d509c4dd",
      "type": "snaker:transition",
      "sourceNodeId": "2c75eebf-5baf-4cd0-a7b3-05466be13634",
      "targetNodeId": "approveBoss",
      "startPoint": {
        "x": 740,
        "y": 365
      },
      "endPoint": {
        "x": 840,
        "y": 480
      },
      "properties": {
        "expr": "#f_day>=3"
      },
      "text": {
        "x": 740,
        "y": 422.5,
        "value": "请假天数大于等于3"
      },
      "pointsList": [
        {
          "x": 740,
          "y": 365
        },
        {
          "x": 740,
          "y": 480
        },
        {
          "x": 840,
          "y": 480
        }
      ]
    },
    {
      "id": "a64348ec-4168-4f36-8a61-15cf12c710b9",
      "type": "snaker:transition",
      "sourceNodeId": "approveBoss",
      "targetNodeId": "end",
      "startPoint": {
        "x": 960,
        "y": 480
      },
      "endPoint": {
        "x": 1080,
        "y": 142
      },
      "properties": {},
      "pointsList": [
        {
          "x": 960,
          "y": 480
        },
        {
          "x": 1140,
          "y": 480
        },
        {
          "x": 1140,
          "y": 112
        },
        {
          "x": 1080,
          "y": 112
        },
        {
          "x": 1080,
          "y": 142
        }
      ]
    }
  ]
}
```
## XML样例数据
```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<process  name="leave" displayName="请假" instanceUrl="leaveForm">
	<start name="start" displayName="开始" layout="340,160,120,80">
		<transition name="3037be41-5682-4344-b94a-9faf5c3e62ba" to="apply" g="358,160;460,160"></transition>
	</start>
	<task name="apply" displayName="请假申请" layout="520,160,120,80" taskType="Major" performType="ANY" autoExecute="N" assignee="approve.operator">
		<transition name="c79642ae-9f28-4213-8cdf-0e0d6467b1b9" to="approveDept" g="580,160;680,160"></transition>
	</task>
	<task name="approveDept" displayName="部门领导审批" layout="740,160,120,80" taskType="Major" performType="ANY" autoExecute="N" assignmentHandler="com.mldong.config.FlowAssignmentHandler">
		<transition name="09d9b143-9473-4a0f-8287-9abf6f65baf5" to="2c75eebf-5baf-4cd0-a7b3-05466be13634" g="740,200;740,315"></transition>
	</task>
	<decision name="2c75eebf-5baf-4cd0-a7b3-05466be13634" layout="740,340,120,80">
		<transition name="517ef2c7-3486-4992-b554-0f538ab91751" displayName="请假天数小于3" to="end" expr="#f_day&lt;3" g="764,339;1080,339;1080,178"></transition>
	<transition name="d7ec4166-f3fc-4fd6-a2ac-a6c4d509c4dd" displayName="请假天数大于等于3" to="approveBoss" expr="#f_day&gt;=3" g="740,365;740,480;840,480"></transition>
	</decision>
	<end name="end" displayName="结束" layout="1080,160,120,80">
		</end>
	<task name="approveBoss" displayName="公司领导审批" layout="900,480,120,80" taskType="Major" performType="ANY" autoExecute="N" assignmentHandler="com.mldong.config.FlowAssignmentHandler">
		<transition name="a64348ec-4168-4f36-8a61-15cf12c710b9" to="end" g="960,480;1140,480;1140,112;1080,112;1080,142"></transition>
	</task>
</process>
```
## 高亮数据
``` json
{
    "historyNodeNames": [
        "start",
        "apply"
    ],
    "historyEdgeNames": [
        "3037be41-5682-4344-b94a-9faf5c3e62ba",
        "c79642ae-9f28-4213-8cdf-0e0d6467b1b9"
    ],
    "activeNodeNames": [
        "approveDept"
    ]
}
```

# 相关资料
[LogicFlow] (http://logic-flow.org/)

[snaker工作流中文文档] (https://yunmel.gitbooks.io/snakerflow/content/)

[snaker源码] (https://gitee.com/yuqs/snakerflow)