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
    walden: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8', '#3fb1e3', '#6be6c1', '#626c91']
  },
 
  init() {
    this.initChart();
    this.bindEvents();
    this.renderDataEditor();
    this.updateChart();
    this.updateSeriesVisibility();
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
 
    this.bindSelect('colorPalette', 'series', 'colorPalette');
 
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

    setVal('colorPalette', state.series.colorPalette);

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
  }
};
 
document.addEventListener('DOMContentLoaded', () => {
  ChartEditor.init();
});
