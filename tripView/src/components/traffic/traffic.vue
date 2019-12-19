<template>
  <div class="traffic">
    <div id="container"></div>
      <div class="search">
        <md-field>
          <md-input-item
            @focus="searchOnFocus('start')"
            @blur="searchOnBlur"
            v-model="searchStart"
            ref="name"
            title="出发地(●ˇ∀ˇ●)"
            placeholder="输出出发地"
            clearable
            is-title-latent>
          </md-input-item>
          <md-input-item
            @focus="searchOnFocus('objective')"
            @blur="searchOnBlur"
            v-model="searchObjective"
            ref="id"
            title="目的地(●'◡'●)"
            placeholder="输出目的地"
            clearable
            is-title-latent>
          </md-input-item>
        </md-field>
        <md-button
          class="search-btn1"
          type="primary"
          plain
          @click="trafficTypeOnClick"
          >{{trafficType.slice(0,2)}}</md-button>
          <md-button
          class="search-btn2"
          type="primary"
          @click="searchOnClick"
          >Go~</md-button>
      </div>
      <div class="search-list" :id="searchListShow?'searchList':''">
        <p class="up-btn" @click="searchResultDown">
          <svg-icon class="up-svg" icon-class="down"/>
        </p>
        <md-field>
          <md-cell-item
            v-for="(item,index) in searchResult"
            :key="index"
            @click="searchResultListOnClick(item)"
            :title="item.name"
            :brief="typeof item.address==='string'?item.address:item.district"
          />
        </md-field>
        <div class="no-result" v-if="searchResult.length === 0">
          <md-result-page></md-result-page>
        </div>        
      </div>
      <div v-if="isPanelShow" class="panel-list" :id="panelListShow?'panelList':''">
        <p @click="panelListAuto" class="panel-list-title">
          <span>请选择合适路线</span>
          <svg-icon v-if="!panelListShow" class="up-svg" icon-class="up"/>
          <svg-icon v-else class="up-svg" icon-class="down"/>
          <span class="sure-btn" @click.stop="panelSureOnClick">确定</span>
        </p>
        <div id="panel"></div>
      </div>
      <!-- 确认层 -->
      <md-dialog
        title="本次出行"
        :closable="true"
        v-model="sureDialog"
        :btns="btnDialog"
      >
        <md-field class="dialog-field">
          <md-detail-item title="交通公交" :content="trafficType" bold/>
          <md-detail-item title="出发地" :content="searchStart"/>
          <md-detail-item title="目的地" :content="searchObjective"/>
          <md-field-item title="花费">
            <md-stepper slot="right" v-model="spendValue" min="0"/>
          </md-field-item>
          <md-detail-item title="日期" :content="dateTime"/>
          <md-input-item
            id="markText"
            v-model="markText"
            title="备注"
            placeholder="点此输入备注，少于20字"
            :maxlength="20"
          ></md-input-item>
        </md-field>
      </md-dialog>
      <!-- 选择出行方式 -->
      <md-popup v-model="tripTypePopupShow" position="top">
        <div class="traffic-type">
          <md-field title="选择出行工具" class="radio-field">
            <md-radio-list
              @change="trafficTypeOnChange"
              :options="reasons"
              v-model="tripTypeMarriage"
              icon="right"
              icon-inverse
              icon-disabled
              icon-position="right"
            />
          </md-field>
        </div>
      </md-popup>
  </div>
</template>
<script>
import { Toast } from 'mand-mobile'
import { getTime } from '@/utils/validate.js'
import { mapActions } from 'vuex'
export default {
  name: 'traffic',
  data () {
    return {
      spendValue: 0,
      trafficMap: null,
      searchState: 'start',
      searchStart: '',
      searchStartData: {},
      searchObjective: '',
      searchObjectiveData: {},
      timer : null,
      searchResult: [],
      searchListShow: false,
      watchStop: false,
      panelListShow: false,
      isPanelShow: false,
      driving:  null,
      tripTypeMarriage: 'AMap.Transfer',
      tripTypePopupShow: false,
      trafficType: '公交/地铁',
      markText: '',
      sureDialog: false,
      dateTime:getTime().date3,
      distance: '0',
      btnDialog: [
        {
          text:'确认保存(。・∀・)ノ',
          handler: this.onIconConfirm
        }
      ],
      reasons: [
        {
          value: 'AMap.Transfer',
          text: '公交/地铁'
        },
        {
          value: 'AMap.Driving',
          text: '出租车'
        },
        {
          value: 'AMap.Riding',
          text: '单车/电车'
        },
        {
          value: 'AMap.Walking',
          text: '步行'
        }
      ]    
    }
  },
  watch: {
    searchStart(val) {
      this.searchKeyBefore(val)
    },
    searchObjective(val) {
      this.searchKeyBefore(val)
    },
    searchListShow (val) {
      if(val){
        this.panelListShow = false
      }
    },
    panelListShow (val) {
      if(val) {
        this.searchListShow = false
      }
    }
  },
  mounted () {
    this.init()
    this.loactionMap()
  },
  methods: {
    searchOnFocus(e){
       this.searchState = e
       this.searchResult = []
       this.searchListShow = true
       if (e === 'start') {
        this.searchKeyBefore(this.searchStart)
       } else {
        this.searchKeyBefore(this.searchObjective)
       }
    },
    searchOnBlur () {

    },
    searchResultDown () {
      this.searchListShow = false
    },
    searchResultListOnClick(item){
      console.log(item)
      if(this.searchState === 'start') {
        this.searchState = item
        this.searchStart = item.name
      } else {
        this.searchObjectiveData = item
        this.searchObjective = item.name
      }
      this.searchListShow = false
      this.watchStop = true
    },
    trafficTypeOnClick () {
      this.tripTypePopupShow = true
    },
    trafficTypeOnChange (e) {
      this.trafficType = e.text
      this.tripTypePopupShow = false
    },
    searchOnClick () {
      if(this.driving) {
        this.driving.clear()
      }
      let tmpArr = []
      if(!this.searchStartData.location || !this.searchObjectiveData.location){
        Toast.failed('先在列表中点击确认准确地点（〃｀ 3′〃）')
        return
      }
      tmpArr.push(this.searchStartData.location)
      tmpArr.push(this.searchObjectiveData.location)
      this.isPanelShow = true
      this.searchDriving(tmpArr)
    },
    panelSureOnClick () {
      this.panelListShow = false
      this.sureDialog = true
      this.dateTime = getTime().date3
    },
    panelListAuto () {
      this.panelListShow = !this.panelListShow
    },
    onIconConfirm () {
      this.saveTripDataAjax()
      this.sureDialog = false
      this.driving.clear()
      this.searchStart = ''
      this.searchStartData = {}
      this.searchObjective = ''
      this.searchObjectiveData = {}
      this.isPanelShow = false
    },
    init () {
      this.trafficMap = new window.AMap.Map('container',{
        resizeEnable : true,
        center:[116.397428,39.90923],
        zoom: 13
      })
    },
    searchKeyBefore(val){
      let that = this
      if(val === '') return
      if(this.watchStop){
        this.watchStop = false
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(function() {
        that.searchKey(val)
      },500)
    },
    searchKey(keyword){
      
    }
  }
}
</script>