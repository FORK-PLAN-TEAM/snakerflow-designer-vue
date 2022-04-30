# snaker工作流引擎web设计器
[在线体验] (https://snaker.mldong.com/)

[编辑模式] (https://snaker.mldong.com/)

[只读模式] (https://snaker.mldong.com/preview)

[高亮模式] (https://snaker.mldong.com/about)
# 如何使用
## 安装
```
npm install snakerflow-designer-vue@latest --save
```
## 其他依赖
设计器依赖于以下第三方库，工程中没有的，请自行安装。
```
npm install @logicflow/core@^1.1.3 --save
npm install @logicflow/extension@^1.1.3 --save
npm install clipboard@^2.0.10 --save
npm install element-ui@^2.15.6 --save
npm install vue-json-pretty@^1.8.2 --save
```
## 引入
```
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入组件库
import SnakerFlowDesigner from 'snakerflow-designer-vue'
Vue.config.productionTip = false
Vue.use(ElementUI)
// 注册组件库
Vue.use(SnakerFlowDesigner)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

```
## 样例
### 编辑模式
```
https://gitee.com/mldong/snakerflow-designer-vue/blob/master/src/views/Home.vue
<SnakerFlowDesigner ref='designer' v-model="flowData" @on-save="handleSave"/>

```
### 只读模式
```
// https://gitee.com/mldong/snakerflow-designer-vue/blob/master/src/views/Preview.vue
<SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
```
### 高亮模式
```
// https://gitee.com/mldong/snakerflow-designer-vue/blob/master/src/views/About.vue
<SnakerFlowDesigner :viewer="true" ref='designer' v-model="flowData"/>
```
# 本地演示
## 安装
```
npm install
```

## 开发
```
npm run serve
```

## 打包编译
```
npm run build
```

## 校验
```
npm run lint
```
# 数据
## 样例数据
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