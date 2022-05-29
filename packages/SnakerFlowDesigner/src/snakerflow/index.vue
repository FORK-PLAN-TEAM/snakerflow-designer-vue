<template>
  <div class="m-snakerflow-designer">
    <div id="LF-view"></div>
    <PropertySetting ref="propertySetting" :extendAttrConfig="extendAttrConfig" :node="nodeClick" v-model="processForm" :lf="lf"/>
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        destroy-on-close
        width="60%"
        :append-to-body="true"
        :before-close="handleClose">
        <component :is="dialogType" :graphData="graphData" ref="dialogComponent"></component>
        <span slot="footer" class="dialog-footer" v-if="dialogType=='ImportData' || dialogType=='HighLightData'">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
            <el-dropdown placement="top" trigger="click" style="float: left;" v-if="localStorageLfData.length" @command="handleCommand">
              <el-button type="text">选择<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :key="item.value" v-for="item in localStorageLfData" :command="item.value">
                  {{item.label}}&nbsp;&nbsp;<i class="el-icon-remove" @click="handleRemove(item.value)"></i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </span>
        <span slot="footer" class="dialog-footer" v-if="dialogType=='DataDetail'">
            <el-button type="primary" class="m-btn-copy" :data-clipboard-text="copyJsonContent">复制JSON</el-button>
            <el-button type="primary" class="m-btn-copy" :data-clipboard-text="copyXmlContent">复制XML</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import LogicFlow from '@logicflow/core'
import Task from './task'
import Transition from './transition'
import Custom from './custom'
import Start from './start'
import End from './end'
import Decision from './decision'
import Join from './join'
import Fork from './fork'
import PropertySetting from '../PropertySetting/index.vue'
import DataDetail from './control/DataDetail.vue'
import ImportData from './control/ImportData.vue'
import HighLightData from './control/HighLightData.vue'

import { Snapshot, DndPanel, SelectionSelect, Menu, Control } from '@logicflow/extension'
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'
import { snakerXml2LogicFlowJson, logicFlowJsonToSnakerXml } from './tool'
import Clipboard from 'clipboard'
import { Message } from 'element-ui'
export default {
  name: 'SnakerFlowDesigner',
  components: {
    PropertySetting,
    DataDetail,
    ImportData,
    HighLightData
  },
  props: {
    value: {
      type: [String, Object],
      default () {
        return undefined
      }
    },
    config: {
      type: Object,
      default () {
        return {
          grid: true
        }
      }
    },
    viewer: { // 预览模式
      type: Boolean,
      default: false
    },
    highLight: { // 高亮数据
      type: Object,
      default () {
        return {
        }
      }
    },
    extendAttrConfig: { // 扩展属性配置
      type: Object
    }
  },
  data () {
    return {
      lf: null,
      nodeClick: null,
      dialogTitle: '',
      dialogVisible: false,
      dialogType: 'DataDetail',
      graphData: {},
      clipboard: null,
      processForm: {},
      refreshLfData: 1
    }
  },
  watch: {
    value: {
      handler (n) {
        if (n && this.lf) {
          // this.init()
          const value = this.tranData(n)
          this.initProcessForm(value)
          if (value.nodes) {
            this.lf.render(value)
          }
        }
      },
      deep: true
    },
    processForm: {
      handler (n) {
        if (n) {
          delete n.type
          this.$emit('input', n)
        }
      },
      deep: true
    },
    highLight: {
      handler (n) {
        this.setHighLight(n)
      },
      deep: true
    }
  },
  computed: {
    copyJsonContent () {
      if (this.dialogType === 'DataDetail' && this.lf) {
        return JSON.stringify({
          ...this.tranData(this.value),
          ...this.lf.getGraphData()
        }, null, 2)
      }
      return ''
    },
    copyXmlContent () {
      if (this.dialogType === 'DataDetail' && this.lf) {
        return logicFlowJsonToSnakerXml({
          ...this.tranData(this.value),
          ...this.lf.getGraphData()
        })
      }
      return ''
    },
    localStorageLfData () {
      const res = []
      if (this.dialogType === 'ImportData' && [1, 2].includes(this.refreshLfData)) {
        Object.keys(window.localStorage).forEach(key => {
          if (key.startsWith('LFDATA###')) {
            const arr = key.split('###')
            res.push({
              value: key,
              label: arr[2]
            })
          }
        })
      }
      return res
    }
  },
  mounted () {
    this.init()
    if (this.tranData(this.value)) {
      this.initProcessForm(this.tranData(this.value))
      this.lf.render(this.tranData(this.value))
      this.setHighLight(this.highLight)
    }
    this.clipboard = new Clipboard('.m-btn-copy')
    this.clipboard.on('success', function (e) {
      Message.success('复制成功')
      e.clearSelection()
    })

    this.clipboard.on('error', function (e) {
      Message.error('复制失败')
    })
  },
  methods: {
    tranData (n) {
      if (typeof n === 'string') {
        return snakerXml2LogicFlowJson(n)
      }
      return n
    },
    /**
     * 初始化流程定义表单信息
     */
    initProcessForm (data) {
      this.$set(this.processForm, 'type', 'snaker:process')
      this.$set(this.processForm, 'name', data.name)
      this.$set(this.processForm, 'displayName', data.displayName)
      this.$set(this.processForm, 'expireTime', data.expireTime)
      this.$set(this.processForm, 'instanceUrl', data.instanceUrl)
      this.$set(this.processForm, 'instanceNoClass', data.instanceNoClass)
    },
    init () {
      // 画布配置
      LogicFlow.use(Snapshot)
      LogicFlow.use(DndPanel)
      LogicFlow.use(SelectionSelect)
      LogicFlow.use(Menu)
      LogicFlow.use(Control)
      const defaultConfig = {}
      if (this.viewer) {
        defaultConfig.isSilentMode = true
      }
      const lf = new LogicFlow({ ...this.config, ...defaultConfig, container: document.querySelector('#LF-view') })
      this.lf = lf
      // 注册自定义元素
      this.lf.register(Task)
      this.lf.register(Transition)
      this.lf.register(Custom)
      this.lf.register(Start)
      this.lf.register(End)
      this.lf.register(Decision)
      this.lf.register(Join)
      this.lf.register(Fork)
      // 初始化操作栏
      this.initOp(this.lf)
      // 初始化事件
      this.initEvent(lf)
    },
    initOp (lf) {
      if (this.viewer) return
      // 设置拖拽面板
      this.lf.extension.dndPanel.setPatternItems([
        {
          type: 'snaker:start',
          text: '开始',
          label: '开始节点',
          properties: {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg=='
        },
        {
          type: 'snaker:task',
          text: '用户任务',
          label: '用户任务',
          properties: {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==',
          className: 'important-node'
        },
        {
          type: 'snaker:custom',
          text: '自定义任务',
          label: '自定义任务',
          properties: {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII=',
          className: 'import_icon'
        },
        {
          type: 'snaker:decision',
          label: '条件判断',
          properties: {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII='
        },
        {
          type: 'snaker:fork',
          label: '分支',
          properties: {},
          className: 'lf-control-fork'
        },
        {
          type: 'snaker:join',
          label: '合并',
          properties: {},
          className: 'lf-control-join'
        },
        {
          type: 'snaker:end',
          text: '结束',
          label: '结束节点',
          properties: {},
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAA1BJREFUOBFtVE1IVUEYPXOf+tq40Y3vPcmFIdSjIorWoRG0ERWUgnb5FwVhYQSl72oUoZAboxKNFtWiwKRN0M+jpfSzqJAQclHo001tKkjl3emc8V69igP3znzfnO/M9zcDcKT67azmjYWTwl9Vn7Vumeqzj1DVb6cleQY4oAVnIOPb+mKAGxQmKI5CWNJ2aLPatxWa3aB9K7/fB+/Z0jUF6TmMlFLQqrkECWQzOZxYGjTlOl8eeKaIY5yHnFn486xBustDjWT6dG7pmjHOJd+33t0iitTPkK6tEvjxq4h2MozQ6WFSX/LkDUGfFwfhEZj1Auz/U4pyAi5Sznd7uKzznXeVHlI/Aywmk6j7fsUsEuCGADrWARXXwjxWQsUbIupDHJI7kF5dRktg0eN81IbiZXiTESic50iwS+t1oJgL83jAiBupLDCQqwziaWSoAFSeIR3P5Xv5az00wyIn35QRYTwdSYbz8pH8fxUUAtxnFvYmEmgI0wYXUXcCCSpeEVpXlsRhBnCEATxWylL9+EKCAYhe1NGstUa6356kS9NVvt3DU2fd+Wtbm/+lSbylJqsqkSm9CRhvoJVlvKPvF1RKY/FcPn5j4UfIMLn8D4UYb54BNsilTDXKnF4CfTobA0FpoW/LSp306wkXM+XaOJhZaFkcNM82ASNAWMrhrUbRfmyeI1FvRBTpN06WKxa9BK0o2E4Pd3zfBBEwPsv9sQBnmLVbLEIZ/Xe9LYwJu/Er17W6HYVBc7vmuk0xUQ+pqxdom5Fnp55SiytXLPYoMXNM4u4SNSCFWnrVIzKG3EGyMXo6n/BQOe+bX3FClY4PwydVhthOZ9NnS+ntiLh0fxtlUJHAuGaFoVmttpVMeum0p3WEXbcll94l1wM/gZ0Ccczop77VvN2I7TlsZCsuXf1WHvWEhjO8DPtyOVg2/mvK9QqboEth+7pD6NUQC1HN/TwvydGBARi9MZSzLE4b8Ru3XhX2PBxf8E1er2A6516o0w4sIA+lwURhAON82Kwe2iDAC1Watq4XHaGQ7skLcFOtI5lDxuM2gZe6WFIotPAhbaeYlU4to5cuarF1QrcZ/lwrLaCJl66JBocYZnrNlvm2+MBCTmUymPrYZVbjdlr/BxlMjmNmNI3SAAAAAElFTkSuQmCC'
        }
      ])
      // 设置右键菜单
      this.lf.extension.menu.setMenuConfig({
        nodeMenu: [
          {
            text: '删除',
            callback (node) {
            // node为该节点数据
              lf.deleteNode(node.id)
            }
          }
        ]
      })
      // 控制面板-清空画布
      this.lf.extension.control.addItem({
        iconClass: 'lf-control-clear',
        title: 'clear',
        text: '清空',
        onClick: (lf, ev) => {
          lf.clearData()
        }
      })
      // 控制面板-添加查看按钮
      this.lf.extension.control.addItem({
        iconClass: 'lf-control-see',
        title: '',
        text: '查看',
        onClick: (lf, ev) => {
          this.graphData = {
            ...this.tranData(this.value),
            ...lf.getGraphData()
          }
          this.$nextTick(() => {
            this.dialogTitle = '查看流程数据'
            this.dialogVisible = true
            this.dialogType = 'DataDetail'
          })
        }
      })
      // 控制面板-添加导入按钮
      this.lf.extension.control.addItem({
        iconClass: 'lf-control-import',
        title: '',
        text: '导入',
        onClick: (lf, ev) => {
          this.dialogTitle = '导入流程数据(同时支持xml/json)'
          this.dialogVisible = true
          this.dialogType = 'ImportData'
        }
      })
      // 控制面板-设置高亮数据
      this.lf.extension.control.addItem({
        iconClass: 'lf-control-setting',
        title: '',
        text: '设置高亮',
        onClick: (lf, ev) => {
          this.dialogTitle = '导入高亮数据(json)'
          this.dialogVisible = true
          this.dialogType = 'HighLightData'
        }
      })
      // 控制面板-清空画布
      this.lf.extension.control.addItem({
        iconClass: 'lf-control-save',
        title: '',
        text: '保存',
        onClick: (lf, ev) => {
          this.graphData = lf.getGraphData()
          this.$nextTick(() => {
            const res = {
              ...this.tranData(this.value),
              ...this.graphData
            }
            this.$emit('on-save', {
              json: res,
              xml: logicFlowJsonToSnakerXml(res)
            })
          })
        }
      })
    },
    initEvent (lf) {
      if (this.viewer) return
      const { eventCenter } = this.lf.graphModel
      eventCenter.on('node:click', (args) => {
        this.nodeClick = args.data
        this.$nextTick(() => {
          this.$refs.propertySetting.show()
        })
      })
      eventCenter.on('edge:click', (args) => {
        this.nodeClick = args.data
        this.$nextTick(() => {
          this.$refs.propertySetting.show()
        })
      })
      eventCenter.on('edge:add', (args) => {
        // 修改边类型
        lf.changeEdgeType(args.data.id, 'snaker:transition')
      })
      eventCenter.on('blank:contextmenu', (args) => {
        this.nodeClick = {
          name: this.processForm.name,
          displayName: this.processForm.displayName,
          expireTime: this.processForm.expireTime,
          instanceUrl: this.processForm.instanceUrl,
          instanceNoClass: this.processForm.instanceNoClass,
          type: 'snaker:process'
        }
        this.$nextTick(() => {
          this.$refs.propertySetting.show()
        })
      })
    },
    handleClose () {
      this.dialogVisible = false
      this.$refs.dialogComponent.handleClose()
    },
    handleSubmit () {
      if (this.dialogType === 'ImportData') {
        this.lf.clearData()
        try {
          this.importJson(this.$refs.dialogComponent.graphJsonStr)
        } catch {
          this.importXml(this.$refs.dialogComponent.graphJsonStr)
        }
      } else if (this.dialogType === 'HighLightData') {
        this.setHighLight(JSON.parse(this.$refs.dialogComponent.highLightJsonStr))
      }
      this.dialogVisible = false
    },
    /**
     * 导入snakerxml
     */
    importXml (xml) {
      if (!xml) return
      const data = snakerXml2LogicFlowJson(xml)
      this.initProcessForm(data)
      this.lf.render(data)
    },
    /**
     * 导入jsonstr
     */
    importJson (jsonStr) {
      if (!jsonStr) return
      let data = jsonStr
      if (typeof jsonStr === 'string') {
        data = JSON.parse(jsonStr)
      }
      this.initProcessForm(data)
      this.lf.render(data)
    },
    /**
     * 设置高亮数据
     * @param data { "historyNodeNames": [], "historyEdgeNames": [], "activeNodeNames": []}
     */
    setHighLight (data) {
      if (!this.lf || !data) return
      // 设置历史节点
      if (data && data.historyNodeNames) {
        data.historyNodeNames.forEach(nodeName => {
          this.lf.setProperties(nodeName, { state: 'history' })
        })
      }
      // 设置当前节点
      if (data && data.activeNodeNames) {
        data.activeNodeNames.forEach(nodeName => {
          this.lf.setProperties(nodeName, { state: 'active' })
        })
      }
      // 设置历史边
      if (data && data.historyEdgeNames) {
        data.historyEdgeNames.forEach(edgeName => {
          const edgeModel = this.lf.getEdgeModelById(edgeName)
          if (edgeModel) {
            edgeModel.setProperties({ state: 'history' })
          }
        })
      }
    },
    handleCommand (key) {
      this.$refs.dialogComponent.graphJsonStr = window.localStorage.getItem(key)
    },
    handleRemove (key) {
      window.localStorage.removeItem(key)
      if (this.refreshLfData === 1) {
        this.refreshLfData = 2
      } else {
        this.refreshLfData = 1
      }
    }
  }
}
</script>
<style scoped>
.m-snakerflow-designer {
  height: 100%;
  position: relative;
}
#LF-view{
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
<style>
.lf-control-see {
    background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ1NjgyNDM0MzQxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEzNzgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTEyIDE3MS4yODM2OTJjLTI1NS4wNTQ3NjkgMC00ODUuOTI3Mzg1IDMxMi40MzgxNTQtNDk2Ljc5NzUzOCAzMjcuMzI1NTM4bDAgMC42MzAxNTRDMjYuMDcyNjE1IDUxNC4xMjY3NjkgMjU2Ljk0NTIzMSA4MjYuNDg2MTU0IDUxMiA4MjYuNDg2MTU0YzI1NS4wMTUzODUgMCA0ODUuODg4LTMxMi4zOTg3NjkgNDk2Ljc5NzUzOC0zMjcuMzI1NTM4bDAtMC42MzAxNTRDOTk3LjkyNzM4NSA0ODMuNjgyNDYyIDc2Ny4wMTUzODUgMTcxLjI4MzY5MiA1MTIgMTcxLjI4MzY5Mkw1MTIgMTcxLjI4MzY5MnpNNTEyIDI5MS4yMDk4NDZjMTE0LjU2OTg0NiAwIDIwNy43NTM4NDYgOTMuMTA1MjMxIDIwNy43NTM4NDYgMjA3LjY3NTA3N1M2MjYuNTY5ODQ2IDcwNi42Mzg3NjkgNTEyIDcwNi42Mzg3NjljLTExNC41MzA0NjIgMC0yMDcuNzUzODQ2LTkzLjE4NC0yMDcuNzUzODQ2LTIwNy43NTM4NDZTMzk3LjQ2OTUzOCAyOTEuMjA5ODQ2IDUxMiAyOTEuMjA5ODQ2TTUxMiAzOTUuMjI0NjE1Yy01Ny4yNjUyMzEgMC0xMDMuNjYwMzA4IDQ2LjQzNDQ2Mi0xMDMuNjYwMzA4IDEwMy42NjAzMDhzNDYuMzk1MDc3IDEwMy42NjAzMDggMTAzLjY2MDMwOCAxMDMuNjYwMzA4YzU3LjIyNTg0NiAwIDEwMy42MjA5MjMtNDYuNDM0NDYyIDEwMy42MjA5MjMtMTAzLjY2MDMwOFM1NjkuMjI1ODQ2IDM5NS4yMjQ2MTUgNTEyIDM5NS4yMjQ2MTV6IiBwLWlkPSIxMzc5Ij48L3BhdGg+PC9zdmc+');
}
.lf-control-import {
    background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ1NjgyODQ5ODQ3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxODMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODg4LjMgNzU3LjRoLTUzLjhjLTQuMiAwLTcuNyAzLjUtNy43IDcuN3Y2MS44SDE5Ny4xVjE5Ny4xaDYyOS44djYxLjhjMCA0LjIgMy41IDcuNyA3LjcgNy43aDUzLjhjNC4yIDAgNy43LTMuNCA3LjctNy43VjE1OC43YzAtMTctMTMuNy0zMC43LTMwLjctMzAuN0gxNTguN2MtMTcgMC0zMC43IDEzLjctMzAuNyAzMC43djcwNi42YzAgMTcgMTMuNyAzMC43IDMwLjcgMzAuN2g3MDYuNmMxNyAwIDMwLjctMTMuNyAzMC43LTMwLjdWNzY1LjFjMC00LjMtMy41LTcuNy03LjctNy43eiIgcC1pZD0iMjE4NCI+PC9wYXRoPjxwYXRoIGQ9Ik05MDIgNDc2SDU4OHYtNzZjMC02LjctNy44LTEwLjUtMTMtNi4zbC0xNDEuOSAxMTJjLTQuMSAzLjItNC4xIDkuNCAwIDEyLjZsMTQxLjkgMTEyYzUuMyA0LjIgMTMgMC40IDEzLTYuM3YtNzZoMzE0YzQuNCAwIDgtMy42IDgtOHYtNTZjMC00LjQtMy42LTgtOC04eiIgcC1pZD0iMjE4NSI+PC9wYXRoPjwvc3ZnPg==');
}
.lf-control-clear {
  background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ1Nzg5MTYyODczIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwNDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODk5LjEgODY5LjZsLTUzLTMwNS42SDg2NGMxNC40IDAgMjYtMTEuNiAyNi0yNlYzNDZjMC0xNC40LTExLjYtMjYtMjYtMjZINjE4VjEzOGMwLTE0LjQtMTEuNi0yNi0yNi0yNkg0MzJjLTE0LjQgMC0yNiAxMS42LTI2IDI2djE4MkgxNjBjLTE0LjQgMC0yNiAxMS42LTI2IDI2djE5MmMwIDE0LjQgMTEuNiAyNiAyNiAyNmgxNy45bC01MyAzMDUuNmMtMC4zIDEuNS0wLjQgMy0wLjQgNC40IDAgMTQuNCAxMS42IDI2IDI2IDI2aDcyM2MxLjUgMCAzLTAuMSA0LjQtMC40IDE0LjItMi40IDIzLjctMTUuOSAyMS4yLTMwek0yMDQgMzkwaDI3MlYxODJoNzJ2MjA4aDI3MnYxMDRIMjA0VjM5MHogbTQ2OCA0NDBWNjc0YzAtNC40LTMuNi04LTgtOGgtNDhjLTQuNCAwLTggMy42LTggOHYxNTZINDE2VjY3NGMwLTQuNC0zLjYtOC04LThoLTQ4Yy00LjQgMC04IDMuNi04IDh2MTU2SDIwMi44bDQ1LjEtMjYwSDc3Nmw0NS4xIDI2MEg2NzJ6IiBwLWlkPSIyMDQ3Ij48L3BhdGg+PC9zdmc+');
}
.lf-control-save {
  background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ1Nzg5MTgwOTgzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4NDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNDI2LjY2NjY2NyAxMjhoLTE0OS4zMzMzMzR2MjM0LjQ1MzMzM2MwIDEyLjA3NDY2NyA5LjQ1MDY2NyAyMS41NDY2NjcgMjEuMjA1MzM0IDIxLjU0NjY2N2gyOTguOTIyNjY2YzExLjYyNjY2NyAwIDIxLjIwNTMzMy05LjYgMjEuMjA1MzM0LTIxLjU0NjY2N1YxMjhoLTY0djE0OS41MDRjMCAyMy40NjY2NjctMTkuMTU3MzMzIDQyLjQ5Ni00Mi42MjQgNDIuNDk2aC00Mi43NTJBNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA0MjYuNjY2NjY3IDI3Ny41MDRWMTI4ek0xOTIgODk2VjY2MS41NDY2NjdDMTkyIDYwMi40NzQ2NjcgMjM5Ljc4NjY2NyA1NTQuNjY2NjY3IDI5OC44MzczMzMgNTU0LjY2NjY2N2g0MjYuMzI1MzM0QTEwNi43MDkzMzMgMTA2LjcwOTMzMyAwIDAgMSA4MzIgNjYxLjU0NjY2N1Y4OTZoNDIuNTE3MzMzQTIxLjMxMiAyMS4zMTIgMCAwIDAgODk2IDg3NC43NTJWMjczLjY2NEw3NTAuMzM2IDEyOEg3MDR2MjM0LjQ1MzMzM2MwIDU4Ljk2NTMzMy00Ny43MDEzMzMgMTA2Ljg4LTEwNi41Mzg2NjcgMTA2Ljg4SDI5OC41Mzg2NjdBMTA2LjU2IDEwNi41NiAwIDAgMSAxOTIgMzYyLjQ1MzMzM1YxMjhIMTQ5LjI0OEEyMS4yNjkzMzMgMjEuMjY5MzMzIDAgMCAwIDEyOCAxNDkuNDgyNjY3djcyNS4wMzQ2NjZDMTI4IDg4Ni40MjEzMzMgMTM3LjU3ODY2NyA4OTYgMTQ5LjQ4MjY2NyA4OTZIMTkyek00Mi42NjY2NjcgMTQ5LjQ4MjY2N0ExMDYuNjAyNjY3IDEwNi42MDI2NjcgMCAwIDEgMTQ5LjI0OCA0Mi42NjY2NjdINzY4YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDEgMzAuMTY1MzMzIDEyLjUwMTMzM2wxNzAuNjY2NjY3IDE3MC42NjY2NjdBNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMSA5ODEuMzMzMzMzIDI1NnY2MTguNzUyQTEwNi42NDUzMzMgMTA2LjY0NTMzMyAwIDAgMSA4NzQuNTE3MzMzIDk4MS4zMzMzMzNIMTQ5LjQ4MjY2N0ExMDYuNzUyIDEwNi43NTIgMCAwIDEgNDIuNjY2NjY3IDg3NC41MTczMzNWMTQ5LjQ4MjY2N3ogbTcwNCA1MTIuMDQyNjY2YzAtMTIuMDEwNjY3LTkuNTM2LTIxLjUyNTMzMy0yMS41MDQtMjEuNTI1MzMzSDI5OC44MzczMzNDMjg2LjkzMzMzMyA2NDAgMjc3LjMzMzMzMyA2NDkuNiAyNzcuMzMzMzMzIDY2MS41NDY2NjdWODk2aDQ2OS4zMzMzMzRWNjYxLjU0NjY2N3oiIGZpbGw9IiMwMDAwMDAiIHAtaWQ9IjI4NDQiPjwvcGF0aD48L3N2Zz4=');
}
.lf-control-join {
  width: 70px;
  height: 55px;
  background-repeat: no-repeat;
  background-size: 35px 30px;
  background-position: center;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ2NDc3OTgyOTU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyMDQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNzU0Ljk2IDMwMC44NDhsLTU2LjU3NiA1Ni41Nkw4MDQuOTc2IDQ2NEg1MzUuNTY4Yy0yMy45NTItNDgtNzguODE2LTE0Mi4xMTItOTguODgtMTc3LjkyQzM5NS43OTIgMjEzLjA1NiAzMzYuNDMyIDE3NiAyNjAuMjg4IDE3Nkg0OHY4MGgyMTIuMjcyYzQ2Ljk0NCAwIDc5LjgyNCAyMS4zNiAxMDYuNjI0IDY5LjIxNiAyMC4yNTYgMzYuMTQ0IDc1LjkyIDEzNi41MjggOTkuMzYgMTc4Ljg0OGE4MjI0OS40MDggODIyNDkuNDA4IDAgMCAxLTk5LjM2IDE3OC43ODRDMzQwLjA5NiA3MzAuNjg4IDMwNy4yMTYgNzUyIDI2MC4yNzIgNzUySDQ4djgwaDIxMi4yNzJjNzYuMTQ0IDAgMTM1LjUwNC0zNy4wMjQgMTc2LjQzMi0xMTAuMDhDNDU2Ljc1MiA2ODYuMDk2IDUxMS42MTYgNTkyIDUzNS41NjggNTQ0aDI3MC4zODRsLTEwNy41NjggMTA3LjU2OCA1Ni41NzYgNTYuNTZMOTU4LjYwOCA1MDQuNDggNzU0Ljk2IDMwMC44NDh6IiBmaWxsPSIjMUI3RkZGIiBwLWlkPSI0MjA1Ij48L3BhdGg+PC9zdmc+');
}
.lf-control-fork {
  width: 70px;
  height: 55px;
  background-repeat: no-repeat;
  background-size: 35px 30px;
  background-position: center;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ2NDc3ODk0MjQzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI3MDEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNjk4LjQgNjI5LjI4TDgwNS4zMjggNzM2SDYwOS43NmMtNDYuOTQ0IDAtNzkuODI0LTIxLjA0LTEwNi42MjQtNjguOTEyLTIwLjE2LTM1Ljk4NC03My4zMjgtMTIyLjQ5Ni05OC4wOC0xNjIuNjg4IDI0Ljc1Mi00MC4xNzYgNzcuOTItMTI3LjA0IDk4LjA4LTE2My4wMDhDNTI5LjkyIDI5My41MzYgNTYyLjgxNiAyNzIgNjA5Ljc2IDI3MmgxOTUuODA4bC0xMDcuMTg0IDEwNy40NCA1Ni41NzYgNTYuNjg4IDIwMy42NDgtMjAzLjU4NEw3NTQuOTYgMjguOTZsLTU2LjU3NiA1Ni4zMkw4MDUuMzQ0IDE5Mkg2MDkuNzZjLTc2LjE0NCAwLTEzNS41MDQgMzcuMDI0LTE3Ni40MzIgMTEwLjA4LTE5LjQ3MiAzNC44LTczLjYxNiAxMjkuOTItOTcuNiAxNjEuOTJINDguMjA4bC0wLjE0NCA4MGgyODcuNjMyYzI0IDMyIDc4LjE0NCAxMjcuMTA0IDk3LjYzMiAxNjEuOTJDNDc0LjI0IDc3OC45NiA1MzMuNiA4MTYgNjA5Ljc2IDgxNmgxOTUuODA4bC0xMDcuMTg0IDEwNy40NCA1Ni41NzYgNTYuNjg4IDIwMy42NDgtMjAzLjU4NC0yMDMuNjQ4LTIwMy43MjgtNTYuNTc2IDU2LjQ4eiIgZmlsbD0iIzFCN0ZGRiIgcC1pZD0iMjcwMiI+PC9wYXRoPjwvc3ZnPg==');
}
.lf-control-setting {
  width: 70px;
  height: 55px;
  background-repeat: no-repeat;
  background-size: 35px 30px;
  background-position: center;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjQ5MDcyOTQyMTY5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ5MzQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj5AZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGZlZWRiYWNrLWljb25mb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUud29mZjI/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmMiIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTAzMTE1OF91Njl3OHloeGR1LndvZmY/dD0xNjMwMDMzNzU5OTQ0IikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xMDMxMTU4X3U2OXc4eWh4ZHUudHRmP3Q9MTYzMDAzMzc1OTk0NCIpIGZvcm1hdCgidHJ1ZXR5cGUiKTsgfQo8L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTY3LjEgNDI2LjZsNTAuOS02Ny41Yy0xMC42LTM1LjYtMjQuNy02OS42LTQyLjItMTAxLjdsLTgzLjctMTEuOEM4MzEgMjM3LjEgNzgyLjkgMTg5IDc3NC4zIDEyNy44bC0xMS44LTgzLjdjLTMyLTE3LjQtNjYuMS0zMS42LTEwMS43LTQyLjJsLTY3LjUgNTAuOWMtMjQuNyAxOC42LTU0IDI3LjktODMuNCAyNy45cy01OC43LTkuMy04My40LTI3LjlMMzU5LjEgMmMtMzUuNiAxMC42LTY5LjYgMjQuNy0xMDEuNyA0Mi4ybC0xMS44IDgzLjdDMjM3LjEgMTg5IDE4OSAyMzcuMSAxMjcuOCAyNDUuN2wtODMuNyAxMS44Yy0xNy40IDMyLTMxLjYgNjYuMS00Mi4yIDEwMS43bDUwLjkgNjcuNUM5MCA0NzYgOTAgNTQ0IDUyLjkgNTkzLjRMMiA2NjAuOWMxMC42IDM1LjYgMjQuNyA2OS42IDQyLjIgMTAxLjdsODMuNyAxMS44YzYxLjIgOC42IDEwOS4zIDU2LjcgMTE3LjkgMTE3LjlsMTEuOCA4My43YzMyIDE3LjQgNjYuMSAzMS42IDEwMS43IDQyLjJsNjcuNS01MC45YzI0LjctMTguNiA1NC0yNy45IDgzLjQtMjcuOXM1OC43IDkuMyA4My40IDI3LjlsNjcuNSA1MC45YzM1LjYtMTAuNiA2OS42LTI0LjcgMTAxLjctNDIuMmwxMS44LTgzLjdjOC42LTYxLjIgNTYuNy0xMDkuMyAxMTcuOS0xMTcuOWw4My43LTExLjhjMTcuNC0zMiAzMS42LTY2LjEgNDIuMi0xMDEuN2wtNTAuOS02Ny41QzkzMCA1NDQgOTMwIDQ3NiA5NjcuMSA0MjYuNnpNNTExLjUgNzEwQzQwMS45IDcxMCAzMTMgNjIxLjEgMzEzIDUxMS41UzQwMS45IDMxMyA1MTEuNSAzMTMgNzEwIDQwMS45IDcxMCA1MTEuNSA2MjEuMSA3MTAgNTExLjUgNzEweiIgcC1pZD0iNDkzNSI+PC9wYXRoPjwvc3ZnPg==');
}
</style>
