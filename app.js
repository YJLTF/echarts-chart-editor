const ChartEditor = {
  chart: null,
  chartType: 'line',
  zoom: 1,
  isDarkTheme: false,
  debounceTimer: null,
 
  state: {
    title: {
      show: true,
      text: '图表标题',
      subtext: '数据可视化展示',
      left: 'center'
    },
    legend: {
      show: true,
      position: 'bottom',
      orient: 'horizontal'
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    background: {
      color: '#ffffff'
    },
    animation: {
      show: true,
      duration: 1000
    },
    series: {
      name: '数据系列',
      lineColor: '#5470c6',
      lineWidth: 2,
      lineType: 'solid',
      smooth: false,
      symbolShow: true,
      symbolType: 'circle',
      symbolSize: 8,
      areaShow: false,
      areaOpacity: 30,
      barColor: '#5470c6',
      barWidth: 40,
      barRadius: 0,
      pieInnerRadius: 0,
      pieOuterRadius: 60,
      pieRose: 'none',
      pieLabelShow: true,
      labelShow: false,
      labelPosition: 'top',
      labelFontSize: 12,
      colorPalette: 'default'
    },
    xAxis: {
      show: true,
      type: 'category',
      name: '',
      lineColor: '#666666',
      showGrid: false
    },
    yAxis: {
      show: true,
      type: 'value',
      name: '',
      lineColor: '#666666',
      showGrid: true,
      startZero: true
    },
    data: [
      { name: '周一', value: 120 },
      { name: '周二', value: 200 },
      { name: '周三', value: 150 },
      { name: '周四', value: 80 },
      { name: '周五', value: 170 },
      { name: '周六', value: 110 },
      { name: '周日', value: 140 }
    ],
    seriesCount: 1
  },
 
  colorPalettes: {
    default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    vintage: ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'],
    dark: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'],
    light: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#00B2FF', '#15D6B3', '#FF9900', '#F56C6C'],
    chalk: ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0', '#d4a4eb', '#d2f5a6', '#76f2f2'],
    essos: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4', '#95d475', '#68be8d', '#52c4a7'],
    wonderland: ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9', '#4ea397', '#22c3aa', '#7bd9a5'],
    walden: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8', '#3fb1e3', '#6be6c1', '#626c91'],
    westeros: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3', '#516b91', '#59c4e6', '#edafda'],
    shine: ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'],
    infographic: ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B'],
    macarons: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d'],
    roma: ['#E01F54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8f0', '#234b78', '#fdb933', '#83795f']
  },

  themeStateMap: {
    default: {
      background: { color: '#ffffff' },
      series: { lineColor: '#5470c6', barColor: '#5470c6' },
      xAxis: { lineColor: '#666666' },
      yAxis: { lineColor: '#666666' },
      title: { textColor: '#333333' }
    },
    vintage: {
      background: { color: '#fef8ef' },
      series: { lineColor: '#d87c7c', barColor: '#d87c7c' },
      xAxis: { lineColor: '#c2b29a' },
      yAxis: { lineColor: '#c2b29a' },
      title: { textColor: '#4b565b' }
    },
    dark: {
      background: { color: '#100c2a' },
      series: { lineColor: '#4992ff', barColor: '#4992ff' },
      xAxis: { lineColor: '#4b565b' },
      yAxis: { lineColor: '#4b565b' },
      title: { textColor: '#ffffff' }
    },
    light: {
      background: { color: '#ffffff' },
      series: { lineColor: '#409EFF', barColor: '#409EFF' },
      xAxis: { lineColor: '#DCDFE6' },
      yAxis: { lineColor: '#DCDFE6' },
      title: { textColor: '#303133' }
    },
    chalk: {
      background: { color: '#293441' },
      series: { lineColor: '#fc97af', barColor: '#fc97af' },
      xAxis: { lineColor: '#759aa0' },
      yAxis: { lineColor: '#759aa0' },
      title: { textColor: '#ffffff' }
    },
    essos: {
      background: { color: '#fcf8ef' },
      series: { lineColor: '#893448', barColor: '#893448' },
      xAxis: { lineColor: '#e4d6bc' },
      yAxis: { lineColor: '#e4d6bc' },
      title: { textColor: '#333333' }
    },
    wonderland: {
      background: { color: '#333333' },
      series: { lineColor: '#4ea397', barColor: '#4ea397' },
      xAxis: { lineColor: '#444444' },
      yAxis: { lineColor: '#444444' },
      title: { textColor: '#ffffff' }
    },
    walden: {
      background: { color: '#fcfafc' },
      series: { lineColor: '#3fb1e3', barColor: '#3fb1e3' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#333333' }
    },
    westeros: {
      background: { color: '#ffffff' },
      series: { lineColor: '#516b91', barColor: '#516b91' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#516b91' }
    },
    shine: {
      background: { color: '#ffffff' },
      series: { lineColor: '#c12e34', barColor: '#c12e34' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#333333' }
    },
    infographic: {
      background: { color: '#fcf8ef' },
      series: { lineColor: '#C1232B', barColor: '#C1232B' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#333333' }
    },
    macarons: {
      background: { color: '#ffffff' },
      series: { lineColor: '#2ec7c9', barColor: '#2ec7c9' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#333333' }
    },
    roma: {
      background: { color: '#ffffff' },
      series: { lineColor: '#E01F54', barColor: '#E01F54' },
      xAxis: { lineColor: '#cccccc' },
      yAxis: { lineColor: '#cccccc' },
      title: { textColor: '#333333' }
    }
  },

  chartTypeNames: {
    line: '折线图',
    bar: '柱状图',
    pie: '饼图',
    scatter: '散点图',
    radar: '雷达图',
    gauge: '仪表盘',
    funnel: '漏斗图',
    pictorialBar: '象形柱图',
    area: '面积图',
    candlestick: 'K线图',
    effectScatter: '涟漪散点',
    graph: '关系图'
  },

  dataFormatHints: {
    line: {
      title: '折线图',
      text: '需要包含「类目名称」和「数值」两列数据，用于展示数据随类目的变化趋势。',
      example: '周一, 120 | 周二, 200 | 周三, 150'
    },
    bar: {
      title: '柱状图',
      text: '需要包含「类目名称」和「数值」两列数据，用于对比不同类目之间的数值大小。',
      example: '产品A, 320 | 产品B, 180 | 产品C, 250'
    },
    pie: {
      title: '饼图',
      text: '需要包含「名称」和「数值」两列数据，用于展示各部分占整体的比例关系。',
      example: '直接访问, 335 | 邮件营销, 310 | 视频广告, 234'
    },
    scatter: {
      title: '散点图',
      text: '需要包含「X轴数值」和「Y轴数值」两列数据，用于展示两个变量之间的相关性。',
      example: '10, 25 | 20, 45 | 30, 65 | 40, 35'
    },
    radar: {
      title: '雷达图',
      text: '需要包含「指标名称」和「数值」两列数据，用于多维度数据的综合对比。',
      example: '销售, 6500 | 管理, 7000 | 技术, 8000 | 客服, 6000'
    },
    gauge: {
      title: '仪表盘',
      text: '只需一列「数值」数据，用于展示单个指标的完成度或进度。',
      example: '完成率, 75'
    },
    funnel: {
      title: '漏斗图',
      text: '需要包含「阶段名称」和「数值」两列数据，用于展示业务流程各环节的转化情况。',
      example: '浏览, 1000 | 点击, 500 | 加购, 200 | 购买, 80'
    },
    pictorialBar: {
      title: '象形柱图',
      text: '需要包含「类目名称」和「数值」两列数据，用象形图标展示数据大小。',
      example: '一季度, 120 | 二季度, 200 | 三季度, 150'
    },
    area: {
      title: '面积图',
      text: '需要包含「类目名称」和「数值」两列数据，用于展示数据变化趋势和累积量。',
      example: '1月, 120 | 2月, 200 | 3月, 150 | 4月, 180'
    },
    candlestick: {
      title: 'K线图',
      text: '需要包含「开盘价」「收盘价」「最低价」「最高价」四列数据，用于金融行情分析。',
      example: '2024-01, 100, 120, 90, 130'
    },
    effectScatter: {
      title: '涟漪散点图',
      text: '需要包含「X轴数值」和「Y轴数值」两列数据，带涟漪动画效果的散点图。',
      example: '10, 25 | 20, 45 | 30, 65'
    },
    graph: {
      title: '关系图',
      text: '需要包含「节点名称」和「数值」两列数据，用于展示节点之间的关联关系。',
      example: '节点A, 100 | 节点B, 80 | 节点C, 60'
    }
  },

  parsedFileData: null,

  chartThemes: {
    vintage: {
      color: ['#d87c7c', '#919e8b', '#d7ab82', '#6e7074', '#61a0a8', '#efa18d', '#787464', '#cc7e63', '#724e58', '#4b565b'],
      backgroundColor: '#fef8ef',
      textStyle: {},
      title: { textStyle: { color: '#4b565b' }, subtextStyle: { color: '#9a9080' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#c2b29a' } },
        axisTick: { lineStyle: { color: '#c2b29a' } },
        axisLabel: { color: '#6e7074' },
        splitLine: { lineStyle: { color: ['#e8e4d4'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#c2b29a' } },
        axisTick: { lineStyle: { color: '#c2b29a' } },
        axisLabel: { color: '#6e7074' },
        splitLine: { lineStyle: { color: ['#e8e4d4'] } }
      }
    },
    dark: {
      color: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'],
      backgroundColor: '#100c2a',
      textStyle: {},
      title: { textStyle: { color: '#ffffff' }, subtextStyle: { color: '#aaaaaa' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#4b565b' } },
        axisTick: { lineStyle: { color: '#4b565b' } },
        axisLabel: { color: '#dddddd' },
        splitLine: { lineStyle: { color: ['#1e1e3f'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#4b565b' } },
        axisTick: { lineStyle: { color: '#4b565b' } },
        axisLabel: { color: '#dddddd' },
        splitLine: { lineStyle: { color: ['#1e1e3f'] } }
      },
      legend: { textStyle: { color: '#eeeeee' } },
      tooltip: { backgroundColor: 'rgba(50, 50, 50, 0.85)' }
    },
    chalk: {
      color: ['#fc97af', '#87f7cf', '#f7f494', '#72ccff', '#f7c5a0', '#d4a4eb', '#d2f5a6', '#76f2f2'],
      backgroundColor: '#293441',
      textStyle: { color: '#bdcdd8' },
      title: { textStyle: { color: '#ffffff' }, subtextStyle: { color: '#bdcdd8' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#759aa0' } },
        axisTick: { lineStyle: { color: '#759aa0' } },
        axisLabel: { color: '#bdcdd8' },
        splitLine: { lineStyle: { color: ['#3d4b58'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#759aa0' } },
        axisTick: { lineStyle: { color: '#759aa0' } },
        axisLabel: { color: '#bdcdd8' },
        splitLine: { lineStyle: { color: ['#3d4b58'] } }
      },
      legend: { textStyle: { color: '#bdcdd8' } }
    },
    essos: {
      color: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4', '#95d475', '#68be8d', '#52c4a7'],
      backgroundColor: 'rgba(252,248,239,0.5)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#e4d6bc' } },
        axisTick: { lineStyle: { color: '#e4d6bc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee8d5'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#e4d6bc' } },
        axisTick: { lineStyle: { color: '#e4d6bc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee8d5'] } }
      }
    },
    wonderland: {
      color: ['#4ea397', '#22c3aa', '#7bd9a5', '#d0648a', '#f58db2', '#f2b3c9', '#4ea397', '#22c3aa', '#7bd9a5'],
      backgroundColor: '#333',
      textStyle: {},
      title: { textStyle: { color: '#fff' }, subtextStyle: { color: '#ccc' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#444' } },
        axisTick: { lineStyle: { color: '#444' } },
        axisLabel: { color: '#ddd' },
        splitLine: { lineStyle: { color: ['#222'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#444' } },
        axisTick: { lineStyle: { color: '#444' } },
        axisLabel: { color: '#ddd' },
        splitLine: { lineStyle: { color: ['#222'] } }
      },
      legend: { textStyle: { color: '#eee' } }
    },
    walden: {
      color: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8', '#3fb1e3', '#6be6c1', '#626c91'],
      backgroundColor: 'rgba(252,250,252,0.5)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#666666' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#666666' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    westeros: {
      color: ['#516b91', '#59c4e6', '#edafda', '#93b7e3', '#a5e7f0', '#cbb0e3', '#516b91', '#59c4e6', '#edafda'],
      backgroundColor: 'rgba(255,255,255,0)',
      textStyle: {},
      title: { textStyle: { color: '#516b91' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#516b91' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#516b91' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    shine: {
      color: ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487'],
      backgroundColor: 'rgba(255,255,255,0)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    infographic: {
      color: ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B'],
      backgroundColor: 'rgba(252,248,239,0)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    macarons: {
      color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80', '#8d98b3', '#e5cf0d', '#97b552', '#95706d'],
      backgroundColor: 'rgba(255,255,255,0)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    roma: {
      color: ['#E01F54', '#001852', '#f5e8c8', '#b8d2c7', '#c6b38e', '#a4d8f0', '#234b78', '#fdb933', '#83795f'],
      backgroundColor: 'rgba(255,255,255,0)',
      textStyle: {},
      title: { textStyle: { color: '#333333' }, subtextStyle: { color: '#999999' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { lineStyle: { color: '#ccc' } },
        axisLabel: { color: '#333333' },
        splitLine: { lineStyle: { color: ['#eee'] } }
      }
    },
    light: {
      color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#00B2FF', '#15D6B3', '#FF9900', '#F56C6C'],
      backgroundColor: '#ffffff',
      textStyle: {},
      title: { textStyle: { color: '#303133' }, subtextStyle: { color: '#909399' } },
      line: { itemStyle: { borderWidth: 2 }, lineStyle: { width: 3 } },
      categoryAxis: {
        axisLine: { lineStyle: { color: '#DCDFE6' } },
        axisTick: { lineStyle: { color: '#DCDFE6' } },
        axisLabel: { color: '#606266' },
        splitLine: { lineStyle: { color: ['#EBEEF5'] } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: '#DCDFE6' } },
        axisTick: { lineStyle: { color: '#DCDFE6' } },
        axisLabel: { color: '#606266' },
        splitLine: { lineStyle: { color: ['#EBEEF5'] } }
      }
    }
  },
 
  init() {
    this.initChart();
    this.bindEvents();
    this.renderDataEditor();
    this.updateChart();
    this.updateSeriesVisibility();
    this.updateDataFormatHint();
    this.initDataSourceTabs();
    this.initFileUpload();
  },
 
  initChart() {
    if (typeof echarts === 'undefined') {
      this.showToast('ECharts 加载失败，请检查本地依赖');
      const chartDom = document.getElementById('chart');
      if (chartDom) {
        chartDom.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);font-size:14px;">ECharts 库加载失败</div>';
      }
      return;
    }
    const chartDom = document.getElementById('chart');
    if (!chartDom) return;
    this.chart = echarts.init(chartDom);
    
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
    });
  },
 
  getOption() {
    const { state, colorPalettes } = this;
    const palette = colorPalettes[state.series.colorPalette] || colorPalettes.default;
    const categories = state.data.map(d => d.name);
    const values = state.data.map(d => d.value);
 
    const option = {
      backgroundColor: state.background.color,
      animation: state.animation.show,
      animationDuration: state.animation.duration,
      color: palette,
      title: {
        show: state.title.show,
        text: state.title.text,
        subtext: state.title.subtext,
        left: state.title.left,
        textStyle: {
          color: this.isDarkTheme ? '#e5e7eb' : '#1f2937',
          fontSize: 18,
          fontWeight: 600
        },
        subtextStyle: {
          color: this.isDarkTheme ? '#6b7280' : '#9ca3af',
          fontSize: 12
        }
      },
      tooltip: {
        show: state.tooltip.show,
        trigger: state.tooltip.trigger,
        backgroundColor: this.isDarkTheme ? 'rgba(30, 33, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderColor: this.isDarkTheme ? '#454a57' : '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: this.isDarkTheme ? '#e5e7eb' : '#1f2937'
        }
      },
      legend: this.getLegendOption(),
      grid: state.chartType === 'pie' || state.chartType === 'gauge' || state.chartType === 'radar' || state.chartType === 'funnel' || state.chartType === 'graph' ? undefined : {
        left: '3%',
        right: '4%',
        bottom: state.legend.show && state.legend.position === 'bottom' ? '10%' : '3%',
        top: state.title.show ? (state.title.left === 'left' ? 50 : 60) : 20,
        containLabel: true
      },
      series: this.getSeriesOption()
    };
 
    if (['line', 'bar', 'scatter', 'area', 'effectScatter', 'candlestick', 'pictorialBar'].includes(this.chartType)) {
      option.xAxis = {
        show: state.xAxis.show,
        type: state.xAxis.type,
        name: state.xAxis.name,
        data: state.xAxis.type === 'category' ? categories : undefined,
        axisLine: {
          lineStyle: { color: state.xAxis.lineColor }
        },
        axisLabel: {
          color: this.isDarkTheme ? '#9ca3af' : '#6b7280'
        },
        splitLine: {
          show: state.xAxis.showGrid,
          lineStyle: {
            color: this.isDarkTheme ? '#353a45' : '#eef0f3',
            type: 'dashed'
          }
        },
        nameTextStyle: {
          color: this.isDarkTheme ? '#9ca3af' : '#6b7280'
        }
      };
 
      option.yAxis = {
        show: state.yAxis.show,
        type: state.yAxis.type,
        name: state.yAxis.name,
        scale: !state.yAxis.startZero,
        axisLine: {
          show: true,
          lineStyle: { color: state.yAxis.lineColor }
        },
        axisLabel: {
          color: this.isDarkTheme ? '#9ca3af' : '#6b7280'
        },
        splitLine: {
          show: state.yAxis.showGrid,
          lineStyle: {
            color: this.isDarkTheme ? '#353a45' : '#eef0f3',
            type: 'dashed'
          }
        },
        nameTextStyle: {
          color: this.isDarkTheme ? '#9ca3af' : '#6b7280'
        }
      };
    }
 
    if (this.chartType === 'radar') {
      option.radar = {
        indicator: state.data.map((d, i) => ({
          name: d.name,
          max: Math.max(...state.data.map(item => item.value)) * 1.2
        })),
        shape: 'polygon',
        axisName: {
          color: this.isDarkTheme ? '#9ca3af' : '#6b7280'
        },
        splitArea: {
          areaStyle: {
            color: this.isDarkTheme 
              ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)']
              : ['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.05)']
          }
        }
      };
    }
 
    return option;
  },
 
  getLegendOption() {
    const { state } = this;
    const positionMap = {
      top: { top: state.title.show ? 30 : 10, left: 'center', orient: 'horizontal' },
      bottom: { bottom: 10, left: 'center', orient: 'horizontal' },
      left: { left: 10, top: 'center', orient: 'vertical' },
      right: { right: 10, top: 'center', orient: 'vertical' }
    };
 
    const pos = positionMap[state.legend.position] || positionMap.bottom;
 
    return {
      show: state.legend.show,
      ...pos,
      orient: state.legend.orient || pos.orient || 'horizontal',
      textStyle: {
        color: this.isDarkTheme ? '#9ca3af' : '#6b7280',
        fontSize: 12
      },
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 16
    };
  },
 
  getSeriesOption() {
    const { state, colorPalettes } = this;
    const palette = colorPalettes[state.series.colorPalette] || colorPalettes.default;
    const values = state.data.map(d => d.value);
    const count = state.seriesCount;
 
    const series = [];
 
    for (let i = 0; i < count; i++) {
      const seriesName = count > 1 ? `${state.series.name} ${i + 1}` : state.series.name;
      const dataValues = this.getSeriesData(i, values);
      const seriesColor = palette[i % palette.length];
 
      let baseSeries = {
        name: seriesName,
        type: this.chartType === 'area' ? 'line' : this.chartType,
        label: {
          show: state.series.labelShow,
          position: state.series.labelPosition,
          fontSize: state.series.labelFontSize
        }
      };
 
      switch (this.chartType) {
        case 'line':
        case 'area':
          baseSeries = {
            ...baseSeries,
            data: dataValues,
            smooth: state.series.smooth,
            lineStyle: {
              color: seriesColor,
              width: state.series.lineWidth,
              type: state.series.lineType
            },
            itemStyle: {
              color: seriesColor
            },
            symbol: state.series.symbolShow ? state.series.symbolType : 'none',
            symbolSize: state.series.symbolSize
          };
          if (this.chartType === 'area' || state.series.areaShow) {
            baseSeries.areaStyle = {
              color: this.hexToRgba(seriesColor, state.series.areaOpacity / 100)
            };
          }
          break;
 
        case 'bar':
        case 'pictorialBar':
          baseSeries = {
            ...baseSeries,
            data: dataValues,
            itemStyle: {
              color: seriesColor,
              borderRadius: state.series.barRadius
            },
            barWidth: `${state.series.barWidth}%`
          };
          break;
 
        case 'pie':
          baseSeries = {
            ...baseSeries,
            type: 'pie',
            radius: [
              `${state.series.pieInnerRadius}%`,
              `${state.series.pieOuterRadius}%`
            ],
            center: ['50%', '50%'],
            roseType: state.series.pieRose === 'none' ? false : state.series.pieRose,
            label: {
              show: state.series.pieLabelShow,
              fontSize: state.series.labelFontSize
            },
            labelLine: {
              show: state.series.pieLabelShow
            },
            data: state.data.map(d => ({
              name: d.name,
              value: d.value * (i === 0 ? 1 : 1 + i * 0.3)
            }))
          };
          break;
 
        case 'scatter':
        case 'effectScatter':
          baseSeries = {
            ...baseSeries,
            data: state.data.map(d => [
              Math.random() * 200 - 100,
              d.value,
              d.name
            ]),
            symbolSize: state.series.symbolSize,
            itemStyle: {
              color: seriesColor,
              shadowBlur: this.chartType === 'effectScatter' ? 10 : 0,
              shadowColor: seriesColor
            }
          };
          if (this.chartType === 'effectScatter') {
            baseSeries.rippleEffect = {
              scale: 4,
              brushType: 'stroke'
            };
          }
          break;
 
        case 'radar':
          baseSeries = {
            ...baseSeries,
            type: 'radar',
            data: [{
              name: seriesName,
              value: dataValues,
              areaStyle: {
                color: this.hexToRgba(seriesColor, 0.3)
              },
              lineStyle: {
                color: seriesColor,
                width: state.series.lineWidth
              },
              itemStyle: {
                color: seriesColor
              }
            }]
          };
          break;
 
        case 'gauge':
          baseSeries = {
            ...baseSeries,
            type: 'gauge',
            progress: {
              show: true,
              width: 18
            },
            axisLine: {
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: this.isDarkTheme ? '#454a57' : '#e5e7eb'
              }
            },
            axisLabel: {
              distance: 25,
              color: this.isDarkTheme ? '#9ca3af' : '#6b7280',
              fontSize: 12
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10,
                borderColor: seriesColor
              }
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 32,
              fontWeight: 600,
              offsetCenter: [0, '70%'],
              color: this.isDarkTheme ? '#e5e7eb' : '#1f2937'
            },
            data: [{
              value: values[Math.floor(Math.random() * values.length)],
              name: seriesName
            }]
          };
          break;
 
        case 'funnel':
          baseSeries = {
            ...baseSeries,
            type: 'funnel',
            left: '10%',
            top: 60,
            bottom: 60,
            width: '80%',
            min: 0,
            max: Math.max(...values),
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              show: true,
              position: 'inside',
              fontSize: state.series.labelFontSize
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 1
            },
            emphasis: {
              label: {
                fontSize: 16
              }
            },
            data: state.data.map((d, idx) => ({
              name: d.name,
              value: d.value
            }))
          };
          break;
 
        case 'candlestick':
          const ohlcData = values.map((v, i) => [
            v - 20,
            v + 30,
            v - 40,
            v + 50
          ]);
          baseSeries = {
            ...baseSeries,
            type: 'candlestick',
            data: ohlcData,
            itemStyle: {
              color: '#ef5350',
              color0: '#26a69a',
              borderColor: '#ef5350',
              borderColor0: '#26a69a'
            }
          };
          break;
 
        case 'graph':
          const nodes = state.data.map((d, i) => ({
            name: d.name,
            symbolSize: Math.max(d.value / 5, 20),
            value: d.value,
            category: i % count
          }));
          const links = [];
          for (let i = 0; i < state.data.length - 1; i++) {
            links.push({
              source: state.data[i].name,
              target: state.data[i + 1].name,
              value: Math.random() * 50 + 20
            });
          }
          const categories = [];
          for (let i = 0; i < count; i++) {
            categories.push({ name: `类别${i + 1}` });
          }
          baseSeries = {
            ...baseSeries,
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            categories: categories,
            roam: true,
            label: {
              show: state.series.labelShow,
              position: 'right',
              fontSize: state.series.labelFontSize
            },
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            force: {
              repulsion: 200,
              edgeLength: 80
            }
          };
          break;
      }
 
      series.push(baseSeries);
    }
 
    return series;
  },
 
  getSeriesData(index, baseValues) {
    if (index === 0) return baseValues;
    return baseValues.map(v => {
      const variation = (Math.sin(Date.now() / 1000 + index + v) * 0.3 + 0.7);
      return Math.round(v * variation * (1 + index * 0.15));
    });
  },
 
  updateChart() {
    if (!this.chart) return;
    try {
      const option = this.getOption();
      this.chart.setOption(option, true);
      this.updateCodeView();
    } catch (err) {
      console.error('图表更新失败:', err);
      this.showToast('图表更新失败');
    }
  },
 
  updateCodeView() {
    const option = this.getOption();
    const codeContent = document.getElementById('codeContent');
    if (codeContent) {
      codeContent.textContent = JSON.stringify(option, null, 2);
    }
  },
 
  debounceUpdate() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.updateChart();
    }, 100);
  },
 
  bindEvents() {
    document.querySelectorAll('.chart-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        this.changeChartType(type);
        document.querySelectorAll('.chart-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
 
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const chartWrapper = document.getElementById('chartWrapper');
        const codeView = document.getElementById('codeView');
        
        if (tabType === 'preview') {
          chartWrapper.classList.remove('hidden');
          codeView.classList.add('hidden');
        } else {
          chartWrapper.classList.add('hidden');
          codeView.classList.remove('hidden');
          this.updateCodeView();
        }
      });
    });
 
    document.querySelectorAll('.prop-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const prop = tab.dataset.prop;
        document.querySelectorAll('.prop-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.prop-panel').forEach(p => p.classList.remove('active'));
        document.querySelector(`[data-panel="${prop}"]`).classList.add('active');
      });
    });
 
    this.bindCheckbox('titleShow', 'title', 'show');
    this.bindInput('titleText', 'title', 'text');
    this.bindInput('titleSubtext', 'title', 'subtext');
    this.bindSelect('titleLeft', 'title', 'left');
 
    this.bindCheckbox('legendShow', 'legend', 'show');
    this.bindSelect('legendPosition', 'legend', 'position');
    this.bindSelect('legendOrient', 'legend', 'orient');
 
    this.bindCheckbox('tooltipShow', 'tooltip', 'show');
    this.bindSelect('tooltipTrigger', 'tooltip', 'trigger');
 
    this.bindColor('bgColor', 'bgColorText', 'background', 'color');
 
    this.bindCheckbox('animationShow', 'animation', 'show');
    this.bindRange('animationDuration', 'animationDurationValue', 'animation', 'duration', 'ms');
 
    this.bindInput('seriesName', 'series', 'name');
 
    this.bindColor('lineColor', 'lineColorText', 'series', 'lineColor');
    this.bindRange('lineWidth', 'lineWidthValue', 'series', 'lineWidth', 'px');
    this.bindSelect('lineType', 'series', 'lineType');
    this.bindCheckbox('smoothLine', 'series', 'smooth');
 
    this.bindCheckbox('symbolShow', 'series', 'symbolShow');
    this.bindSelect('symbolType', 'series', 'symbolType');
    this.bindRange('symbolSize', 'symbolSizeValue', 'series', 'symbolSize', 'px');
 
    this.bindCheckbox('areaShow', 'series', 'areaShow');
    this.bindRange('areaOpacity', 'areaOpacityValue', 'series', 'areaOpacity', '%');
 
    this.bindColor('barColor', 'barColorText', 'series', 'barColor');
    this.bindRange('barWidth', 'barWidthValue', 'series', 'barWidth', '%');
    this.bindRange('barRadius', 'barRadiusValue', 'series', 'barRadius', 'px');
 
    this.bindRange('pieInnerRadius', 'pieInnerRadiusValue', 'series', 'pieInnerRadius', '%');
    this.bindRange('pieOuterRadius', 'pieOuterRadiusValue', 'series', 'pieOuterRadius', '%');
    this.bindSelect('pieRose', 'series', 'pieRose');
    this.bindCheckbox('pieLabelShow', 'series', 'pieLabelShow');
 
    this.bindCheckbox('labelShow', 'series', 'labelShow');
    this.bindSelect('labelPosition', 'series', 'labelPosition');
    this.bindRange('labelFontSize', 'labelFontSizeValue', 'series', 'labelFontSize', 'px');
 
    const chartThemeEl = document.getElementById('chartTheme');
    if (chartThemeEl) {
      chartThemeEl.addEventListener('change', () => {
        this.changeChartTheme(chartThemeEl.value);
      });
    }
 
    this.bindCheckbox('xAxisShow', 'xAxis', 'show');
    this.bindSelect('xAxisType', 'xAxis', 'type');
    this.bindInput('xAxisName', 'xAxis', 'name');
    this.bindColor('xAxisLineColor', 'xAxisLineColorText', 'xAxis', 'lineColor');
    this.bindCheckbox('xAxisGrid', 'xAxis', 'showGrid');
 
    this.bindCheckbox('yAxisShow', 'yAxis', 'show');
    this.bindSelect('yAxisType', 'yAxis', 'type');
    this.bindInput('yAxisName', 'yAxis', 'name');
    this.bindColor('yAxisLineColor', 'yAxisLineColorText', 'yAxis', 'lineColor');
    this.bindCheckbox('yAxisGrid', 'yAxis', 'showGrid');
    this.bindCheckbox('yAxisStartZero', 'yAxis', 'startZero');
 
    this.bindRange('seriesCount', 'seriesCountValue', null, 'seriesCount', '');
 
    document.getElementById('addDataBtn').addEventListener('click', () => {
      this.addDataItem();
    });
 
    document.getElementById('randomDataBtn').addEventListener('click', () => {
      this.randomizeData();
    });
 
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportConfig();
    });
 
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadImage();
    });
 
    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
 
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.importConfig(e);
    });
 
    document.getElementById('themeToggle').addEventListener('click', () => {
      this.toggleTheme();
    });
 
    document.getElementById('copyCodeBtn').addEventListener('click', () => {
      this.copyCode();
    });
 
    document.getElementById('refreshBtn').addEventListener('click', () => {
      this.updateChart();
      this.showToast('图表已刷新');
    });
 
    document.getElementById('zoomInBtn').addEventListener('click', () => {
      this.zoom = Math.min(this.zoom + 0.2, 2);
      this.applyZoom();
    });
 
    document.getElementById('zoomOutBtn').addEventListener('click', () => {
      this.zoom = Math.max(this.zoom - 0.2, 0.5);
      this.applyZoom();
    });
 
    document.getElementById('fullscreenBtn').addEventListener('click', () => {
      this.toggleFullscreen();
    });

    const fetchApiBtn = document.getElementById('fetchApiDataBtn');
    if (fetchApiBtn) {
      fetchApiBtn.addEventListener('click', () => {
        this.fetchApiData();
      });
    }
  },
 
  bindCheckbox(id, group, key) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (group) {
          this.state[group][key] = el.checked;
        } else {
          this.state[key] = el.checked;
        }
        this.debounceUpdate();
      });
    }
  },
 
  bindInput(id, group, key) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        if (group) {
          this.state[group][key] = el.value;
        } else {
          this.state[key] = el.value;
        }
        this.debounceUpdate();
      });
    }
  },
 
  bindSelect(id, group, key) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        if (group) {
          this.state[group][key] = el.value;
        } else {
          this.state[key] = el.value;
        }
        this.debounceUpdate();
      });
    }
  },
 
  bindRange(id, valueId, group, key, suffix = '') {
    const el = document.getElementById(id);
    const valueEl = document.getElementById(valueId);
    if (el && valueEl) {
      el.addEventListener('input', () => {
        const value = parseInt(el.value);
        valueEl.textContent = value + suffix;
        if (group) {
          this.state[group][key] = value;
        } else {
          this.state[key] = value;
        }
        this.debounceUpdate();
      });
    }
  },
 
  bindColor(colorId, textId, group, key) {
    const colorEl = document.getElementById(colorId);
    const textEl = document.getElementById(textId);
    
    if (colorEl && textEl) {
      colorEl.addEventListener('input', () => {
        textEl.value = colorEl.value;
        textEl.style.borderColor = '';
        if (group) {
          this.state[group][key] = colorEl.value;
        } else {
          this.state[key] = colorEl.value;
        }
        this.debounceUpdate();
      });

      textEl.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(textEl.value)) {
          colorEl.value = textEl.value;
          textEl.style.borderColor = '';
          if (group) {
            this.state[group][key] = textEl.value;
          } else {
            this.state[key] = textEl.value;
          }
          this.debounceUpdate();
        } else if (textEl.value.length > 0) {
          textEl.style.borderColor = 'var(--error-color)';
        } else {
          textEl.style.borderColor = '';
        }
      });

      textEl.addEventListener('blur', () => {
        if (!/^#[0-9A-Fa-f]{6}$/.test(textEl.value)) {
          textEl.style.borderColor = '';
          const currentColor = group ? this.state[group][key] : this.state[key];
          textEl.value = currentColor;
        }
      });
    }
  },
 
  changeChartType(type) {
    this.chartType = type;
    this.updateSeriesVisibility();
    this.updateDataFormatHint();
    this.updateChart();
  },
 
  updateSeriesVisibility() {
    const lineGroups = ['seriesLineGroup', 'seriesSymbolGroup', 'seriesAreaGroup'];
    const barGroup = 'seriesBarGroup';
    const pieGroup = 'seriesPieGroup';
 
    const showLine = ['line', 'area', 'radar'].includes(this.chartType);
    const showSymbol = ['line', 'area', 'scatter', 'effectScatter'].includes(this.chartType);
    const showArea = ['line', 'area'].includes(this.chartType);
    const showBar = ['bar', 'pictorialBar'].includes(this.chartType);
    const showPie = this.chartType === 'pie';
 
    lineGroups.forEach(groupId => {
      const el = document.getElementById(groupId);
      if (el) {
        if ((groupId === 'seriesLineGroup' && showLine) ||
            (groupId === 'seriesSymbolGroup' && showSymbol) ||
            (groupId === 'seriesAreaGroup' && showArea)) {
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      }
    });
 
    const barEl = document.getElementById(barGroup);
    if (barEl) {
      barEl.style.display = showBar ? '' : 'none';
    }
 
    const pieEl = document.getElementById(pieGroup);
    if (pieEl) {
      pieEl.style.display = showPie ? '' : 'none';
    }
 
    const axisPanel = document.querySelector('[data-panel="axis"]');
    const axisTab = document.querySelector('[data-prop="axis"]');
    const hasAxis = ['line', 'bar', 'scatter', 'area', 'effectScatter', 'candlestick', 'pictorialBar'].includes(this.chartType);
    if (axisPanel && axisTab) {
      axisTab.style.display = hasAxis ? '' : 'none';
      if (!hasAxis && axisTab.classList.contains('active')) {
        document.querySelector('[data-prop="chart"]').click();
      }
    }
  },
 
  renderDataEditor() {
    const editor = document.getElementById('dataEditor');
    editor.innerHTML = '';
 
    this.state.data.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'data-row';
      row.innerHTML = `
        <input type="text" value="${item.name}" data-index="${index}" data-field="name">
        <input type="number" value="${item.value}" data-index="${index}" data-field="value">
        <button class="delete-btn" data-index="${index}" title="删除">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      `;
      editor.appendChild(row);
    });
 
    editor.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.index);
        const field = e.target.dataset.field;
        if (field === 'value') {
          const raw = e.target.value;
          if (raw === '' || raw === '-') {
            this.state.data[index][field] = 0;
          } else {
            const num = Number(raw);
            this.state.data[index][field] = isNaN(num) ? 0 : num;
          }
        } else {
          this.state.data[index][field] = e.target.value;
        }
        this.debounceUpdate();
      });
    });
 
    editor.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        if (this.state.data.length > 2) {
          this.state.data.splice(index, 1);
          this.renderDataEditor();
          this.updateChart();
        } else {
          this.showToast('至少保留两条数据');
        }
      });
    });
  },
 
  addDataItem() {
    const names = ['数据A', '数据B', '数据C', '数据D', '数据E', '数据F', '数据G', '数据H', '数据I', '数据J'];
    const nextIndex = this.state.data.length + 1;
    this.state.data.push({
      name: names[nextIndex - 1] || `数据${nextIndex}`,
      value: Math.floor(Math.random() * 200) + 50
    });
    this.renderDataEditor();
    this.updateChart();
  },
 
  randomizeData() {
    this.state.data = this.state.data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 300) + 50
    }));
    this.renderDataEditor();
    this.updateChart();
    this.showToast('数据已随机生成');
  },
 
  exportConfig() {
    const exportData = {
      version: '1.0',
      type: 'chart-editor-state',
      chartType: this.chartType,
      isDarkTheme: this.isDarkTheme,
      state: JSON.parse(JSON.stringify(this.state))
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-config.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('配置已导出');
  },

  importConfig(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);
        
        if (config.type === 'chart-editor-state' && config.state) {
          this.applyState(config.state, config.chartType, config.isDarkTheme);
          this.showToast('配置已导入');
        } else {
          if (this.chart) {
            this.chart.setOption(config, true);
          }
          this.showToast('配置已导入（原生ECharts配置）');
        }
      } catch (err) {
        this.showToast('导入失败：无效的JSON文件');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  applyState(newState, chartType, isDarkTheme) {
    if (isDarkTheme !== undefined && isDarkTheme !== this.isDarkTheme) {
      this.isDarkTheme = isDarkTheme;
      document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    }

    this.state = { ...this.state, ...newState };

    if (chartType) {
      this.chartType = chartType;
      document.querySelectorAll('.chart-item').forEach(item => {
        item.classList.toggle('active', item.dataset.type === chartType);
      });
      this.updateSeriesVisibility();
    }

    this.syncUIFromState();
    this.renderDataEditor();
    
    if (this.chart) {
      this.updateChart();
    }
  },

  syncUIFromState() {
    const { state } = this;
    
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    const setCheck = (id, checked) => {
      const el = document.getElementById(id);
      if (el) el.checked = checked;
    };
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setCheck('titleShow', state.title.show);
    setVal('titleText', state.title.text);
    setVal('titleSubtext', state.title.subtext);
    setVal('titleLeft', state.title.left);

    setCheck('legendShow', state.legend.show);
    setVal('legendPosition', state.legend.position);
    setVal('legendOrient', state.legend.orient);

    setCheck('tooltipShow', state.tooltip.show);
    setVal('tooltipTrigger', state.tooltip.trigger);

    const bgColorEl = document.getElementById('bgColor');
    const bgColorTextEl = document.getElementById('bgColorText');
    if (bgColorEl) bgColorEl.value = state.background.color;
    if (bgColorTextEl) bgColorTextEl.value = state.background.color;

    setCheck('animationShow', state.animation.show);
    setVal('animationDuration', state.animation.duration);
    setText('animationDurationValue', state.animation.duration + 'ms');

    setVal('seriesName', state.series.name);
    
    const lineColorEl = document.getElementById('lineColor');
    const lineColorTextEl = document.getElementById('lineColorText');
    if (lineColorEl) lineColorEl.value = state.series.lineColor;
    if (lineColorTextEl) lineColorTextEl.value = state.series.lineColor;
    
    setVal('lineWidth', state.series.lineWidth);
    setText('lineWidthValue', state.series.lineWidth + 'px');
    setVal('lineType', state.series.lineType);
    setCheck('smoothLine', state.series.smooth);

    setCheck('symbolShow', state.series.symbolShow);
    setVal('symbolType', state.series.symbolType);
    setVal('symbolSize', state.series.symbolSize);
    setText('symbolSizeValue', state.series.symbolSize + 'px');

    setCheck('areaShow', state.series.areaShow);
    setVal('areaOpacity', state.series.areaOpacity);
    setText('areaOpacityValue', state.series.areaOpacity + '%');

    const barColorEl = document.getElementById('barColor');
    const barColorTextEl = document.getElementById('barColorText');
    if (barColorEl) barColorEl.value = state.series.barColor;
    if (barColorTextEl) barColorTextEl.value = state.series.barColor;
    
    setVal('barWidth', state.series.barWidth);
    setText('barWidthValue', state.series.barWidth + '%');
    setVal('barRadius', state.series.barRadius);
    setText('barRadiusValue', state.series.barRadius + 'px');

    setVal('pieInnerRadius', state.series.pieInnerRadius);
    setText('pieInnerRadiusValue', state.series.pieInnerRadius + '%');
    setVal('pieOuterRadius', state.series.pieOuterRadius);
    setText('pieOuterRadiusValue', state.series.pieOuterRadius + '%');
    setVal('pieRose', state.series.pieRose);
    setCheck('pieLabelShow', state.series.pieLabelShow);

    setCheck('labelShow', state.series.labelShow);
    setVal('labelPosition', state.series.labelPosition);
    setVal('labelFontSize', state.series.labelFontSize);
    setText('labelFontSizeValue', state.series.labelFontSize + 'px');

    setVal('chartTheme', state.series.colorPalette);

    setCheck('xAxisShow', state.xAxis.show);
    setVal('xAxisType', state.xAxis.type);
    setVal('xAxisName', state.xAxis.name);
    const xAxisLineColorEl = document.getElementById('xAxisLineColor');
    const xAxisLineColorTextEl = document.getElementById('xAxisLineColorText');
    if (xAxisLineColorEl) xAxisLineColorEl.value = state.xAxis.lineColor;
    if (xAxisLineColorTextEl) xAxisLineColorTextEl.value = state.xAxis.lineColor;
    setCheck('xAxisGrid', state.xAxis.showGrid);

    setCheck('yAxisShow', state.yAxis.show);
    setVal('yAxisType', state.yAxis.type);
    setVal('yAxisName', state.yAxis.name);
    const yAxisLineColorEl = document.getElementById('yAxisLineColor');
    const yAxisLineColorTextEl = document.getElementById('yAxisLineColorText');
    if (yAxisLineColorEl) yAxisLineColorEl.value = state.yAxis.lineColor;
    if (yAxisLineColorTextEl) yAxisLineColorTextEl.value = state.yAxis.lineColor;
    setCheck('yAxisGrid', state.yAxis.showGrid);
    setCheck('yAxisStartZero', state.yAxis.startZero);

    setVal('seriesCount', state.seriesCount);
    setText('seriesCountValue', state.seriesCount);
  },
 
  downloadImage() {
    const dataURL = this.chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: this.state.background.color
    });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'chart.png';
    a.click();
    this.showToast('图片已下载');
  },
 
  copyCode() {
    const option = this.getOption();
    const code = JSON.stringify(option, null, 2);
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          this.showToast('代码已复制到剪贴板');
        })
        .catch(() => {
          this.fallbackCopy(code);
        });
    } else {
      this.fallbackCopy(code);
    }
  },

  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      this.showToast('代码已复制到剪贴板');
    } catch (err) {
      this.showToast('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
  },
 
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    
    const bgColor = this.isDarkTheme ? '#1a1d24' : '#ffffff';
    this.state.background.color = bgColor;
    const bgColorEl = document.getElementById('bgColor');
    const bgColorTextEl = document.getElementById('bgColorText');
    if (bgColorEl) bgColorEl.value = bgColor;
    if (bgColorTextEl) bgColorTextEl.value = bgColor;
    
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    const chartDom = document.getElementById('chart');
    if (chartDom && typeof echarts !== 'undefined') {
      this.chart = echarts.init(chartDom);
    }
    this.updateChart();
    
    this.showToast(this.isDarkTheme ? '已切换到深色主题' : '已切换到浅色主题');
  },
 
  applyZoom() {
    const wrapper = document.getElementById('chartWrapper');
    wrapper.style.transform = `scale(${this.zoom})`;
    wrapper.style.transformOrigin = 'center center';
    this.showToast(`缩放: ${Math.round(this.zoom * 100)}%`);
  },
 
  toggleFullscreen() {
    const container = document.querySelector('.canvas-area');
    if (!this.isFullscreen()) {
      const request = container.requestFullscreen || 
                      container.webkitRequestFullscreen || 
                      container.mozRequestFullScreen || 
                      container.msRequestFullscreen;
      if (request) {
        const promise = request.call(container);
        if (promise && promise.catch) {
          promise.catch(() => {
            this.showToast('全屏模式不可用');
          });
        }
      } else {
        this.showToast('全屏模式不可用');
      }
    } else {
      const exit = document.exitFullscreen || 
                   document.webkitExitFullscreen || 
                   document.mozCancelFullScreen || 
                   document.msExitFullscreen;
      if (exit) {
        exit.call(document);
      }
    }
  },

  isFullscreen() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
  },
 
  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  },
 
  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  updateDataFormatHint() {
    const hint = this.dataFormatHints[this.chartType];
    const typeNameEl = document.getElementById('currentChartTypeHint');
    const hintTextEl = document.getElementById('chartTypeHint');
    const hintExampleEl = document.querySelector('.hint-example');
    
    if (hint && typeNameEl && hintTextEl && hintExampleEl) {
      typeNameEl.textContent = hint.title;
      hintTextEl.textContent = hint.text;
      hintExampleEl.textContent = '示例：' + hint.example;
    }
  },

  initDataSourceTabs() {
    const tabs = document.querySelectorAll('.data-source-tab');
    const panels = document.querySelectorAll('.data-source-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const source = tab.dataset.source;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panels.forEach(p => {
          p.classList.toggle('active', p.dataset.sourcePanel === source);
        });
      });
    });
  },

  initFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('dataFileInput');
    const selectBtn = document.getElementById('selectFileBtn');
    const applyBtn = document.getElementById('applyFileDataBtn');
    
    if (!uploadArea || !fileInput) return;

    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.parseFile(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        this.parseFile(files[0]);
      }
      e.target.value = '';
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyParsedData();
      });
    }
  },

  parseFile(file) {
    const reader = new FileReader();
    const fileName = file.name.toLowerCase();
    
    reader.onload = (e) => {
      try {
        let data = null;
        let fields = [];
        
        if (fileName.endsWith('.json')) {
          const json = JSON.parse(e.target.result);
          if (Array.isArray(json)) {
            data = json;
          } else if (json.data && Array.isArray(json.data)) {
            data = json.data;
          } else {
            data = [json];
          }
          if (data.length > 0 && typeof data[0] === 'object') {
            fields = Object.keys(data[0]);
          }
        } else if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
          const text = e.target.result;
          const result = this.parseCSV(text);
          data = result.data;
          fields = result.fields;
        } else {
          this.showToast('不支持的文件格式');
          return;
        }

        if (!data || data.length === 0) {
          this.showToast('文件中没有有效数据');
          return;
        }

        this.parsedFileData = { data, fields, fileName: file.name };
        this.showParseResult(data.length, fields);
        this.showToast(`成功解析 ${data.length} 条数据`);
      } catch (err) {
        console.error('文件解析失败:', err);
        this.showToast('文件解析失败：' + err.message);
      }
    };

    reader.onerror = () => {
      this.showToast('文件读取失败');
    };

    if (fileName.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  },

  parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) return { data: [], fields: [] };

    const delimiter = this.detectDelimiter(lines[0]);
    let fields = [];
    let data = [];
    let startIndex = 0;

    const firstLineValues = this.splitCSVLine(lines[0], delimiter);
    const allNumbers = firstLineValues.every(v => !isNaN(parseFloat(v)) && v.trim() !== '');
    
    if (!allNumbers && firstLineValues.length > 1) {
      fields = firstLineValues.map(f => f.trim());
      startIndex = 1;
    } else {
      fields = firstLineValues.map((_, i) => `字段${i + 1}`);
    }

    for (let i = startIndex; i < lines.length; i++) {
      const values = this.splitCSVLine(lines[i], delimiter);
      if (values.length === 0) continue;
      const row = {};
      values.forEach((val, idx) => {
        const key = fields[idx] || `字段${idx + 1}`;
        const num = parseFloat(val);
        row[key] = isNaN(num) ? val.trim() : num;
      });
      data.push(row);
    }

    return { data, fields };
  },

  detectDelimiter(line) {
    const delimiters = [',', '\t', ';', '|'];
    let bestDelimiter = ',';
    let maxCount = 0;
    
    delimiters.forEach(delim => {
      const count = line.split(delim).length;
      if (count > maxCount) {
        maxCount = count;
        bestDelimiter = delim;
      }
    });
    
    return bestDelimiter;
  },

  splitCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  },

  showParseResult(rowCount, fields) {
    const resultEl = document.getElementById('fileParseResult');
    const infoEl = document.getElementById('parseInfo');
    const categorySelect = document.getElementById('categoryField');
    const valueSelect = document.getElementById('valueField');
    
    if (!resultEl || !infoEl || !categorySelect || !valueSelect) return;

    const fileName = this.parsedFileData ? this.parsedFileData.fileName : '';
    infoEl.innerHTML = `文件：${fileName}<br>数据行数：${rowCount}<br>字段数量：${fields.length}`;

    categorySelect.innerHTML = '';
    valueSelect.innerHTML = '';
    
    fields.forEach((field, idx) => {
      const opt1 = document.createElement('option');
      opt1.value = field;
      opt1.textContent = field;
      categorySelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = field;
      opt2.textContent = field;
      valueSelect.appendChild(opt2);
    });

    if (fields.length >= 2) {
      valueSelect.selectedIndex = 1;
    }

    resultEl.style.display = 'block';
  },

  applyParsedData() {
    if (!this.parsedFileData) {
      this.showToast('请先选择文件');
      return;
    }

    const categoryField = document.getElementById('categoryField').value;
    const valueField = document.getElementById('valueField').value;

    if (!categoryField || !valueField) {
      this.showToast('请选择类目字段和数值字段');
      return;
    }

    const newData = this.parsedFileData.data
      .filter(item => item[categoryField] !== undefined && item[valueField] !== undefined)
      .map(item => ({
        name: String(item[categoryField]),
        value: Number(item[valueField]) || 0
      }));

    if (newData.length === 0) {
      this.showToast('没有有效的数据');
      return;
    }

    this.state.data = newData;
    this.renderDataEditor();
    this.updateChart();
    this.showToast(`已应用 ${newData.length} 条数据`);

    const tabs = document.querySelectorAll('.data-source-tab');
    const panels = document.querySelectorAll('.data-source-panel');
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    document.querySelector('.data-source-tab[data-source="manual"]').classList.add('active');
    document.querySelector('.data-source-panel[data-source-panel="manual"]').classList.add('active');
  },

  fetchApiData() {
    const urlEl = document.getElementById('apiUrl');
    const methodEl = document.getElementById('apiMethod');
    const dataPathEl = document.getElementById('apiDataPath');
    const categoryFieldEl = document.getElementById('apiCategoryField');
    const valueFieldEl = document.getElementById('apiValueField');

    const url = urlEl ? urlEl.value.trim() : '';
    const method = methodEl ? methodEl.value : 'GET';
    const dataPath = dataPathEl ? dataPathEl.value.trim() : '';
    const categoryField = categoryFieldEl ? categoryFieldEl.value.trim() : '';
    const valueField = valueFieldEl ? valueFieldEl.value.trim() : '';

    if (!url) {
      this.showToast('请输入API接口地址');
      return;
    }

    if (!categoryField || !valueField) {
      this.showToast('请输入类目字段和数值字段');
      return;
    }

    this.showToast('正在获取数据...');

    fetch(url, { method })
      .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(json => {
        let data = json;
        
        if (dataPath) {
          const paths = dataPath.split('.');
          for (const p of paths) {
            if (data && data[p] !== undefined) {
              data = data[p];
            } else {
              data = null;
              break;
            }
          }
        }

        if (!Array.isArray(data)) {
          if (data && data.data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            throw new Error('返回数据不是数组格式');
          }
        }

        const newData = data
          .filter(item => item[categoryField] !== undefined && item[valueField] !== undefined)
          .map(item => ({
            name: String(item[categoryField]),
            value: Number(item[valueField]) || 0
          }));

        if (newData.length === 0) {
          throw new Error('没有有效的数据');
        }

        this.state.data = newData;
        this.renderDataEditor();
        this.updateChart();
        this.showToast(`成功获取 ${newData.length} 条数据`);
      })
      .catch(err => {
        console.error('API请求失败:', err);
        this.showToast('获取数据失败：' + err.message);
      });
  },

  changeChartTheme(themeName) {
    if (!this.chart) return;

    const dom = document.getElementById('chart');
    if (!dom) return;

    this.chart.dispose();
    this.chart = null;

    if (themeName === 'default') {
      this.chart = echarts.init(dom);
    } else if (this.chartThemes[themeName]) {
      if (!echarts.themeRegister || !echarts.themeRegister._themes || !echarts.themeRegister._themes[themeName]) {
        echarts.registerTheme(themeName, this.chartThemes[themeName]);
      }
      this.chart = echarts.init(dom, themeName);
    } else {
      this.chart = echarts.init(dom, themeName);
    }

    this.applyThemeState(themeName);

    this.updateChart();
    this.showToast('主题已切换');
  },

  applyThemeState(themeName) {
    const themeState = this.themeStateMap[themeName];
    if (!themeState) return;

    if (themeState.background) {
      if (themeState.background.color !== undefined) {
        this.state.background.color = themeState.background.color;
      }
    }

    if (themeState.series) {
      if (themeState.series.lineColor !== undefined) {
        this.state.series.lineColor = themeState.series.lineColor;
      }
      if (themeState.series.barColor !== undefined) {
        this.state.series.barColor = themeState.series.barColor;
      }
    }

    if (themeState.xAxis) {
      if (themeState.xAxis.lineColor !== undefined) {
        this.state.xAxis.lineColor = themeState.xAxis.lineColor;
      }
    }

    if (themeState.yAxis) {
      if (themeState.yAxis.lineColor !== undefined) {
        this.state.yAxis.lineColor = themeState.yAxis.lineColor;
      }
    }

    this.state.series.colorPalette = themeName;

    this.syncThemeUI();
  },

  syncThemeUI() {
    const { state } = this;

    const setColor = (colorId, textId, value) => {
      const colorEl = document.getElementById(colorId);
      const textEl = document.getElementById(textId);
      if (colorEl) colorEl.value = value;
      if (textEl) textEl.value = value;
    };

    setColor('bgColor', 'bgColorText', state.background.color);
    setColor('lineColor', 'lineColorText', state.series.lineColor);
    setColor('barColor', 'barColorText', state.series.barColor);
    setColor('xAxisLineColor', 'xAxisLineColorText', state.xAxis.lineColor);
    setColor('yAxisLineColor', 'yAxisLineColorText', state.yAxis.lineColor);

    const themeSelect = document.getElementById('chartTheme');
    if (themeSelect) themeSelect.value = state.series.colorPalette;
  },
};
 
document.addEventListener('DOMContentLoaded', () => {
  ChartEditor.init();
});
