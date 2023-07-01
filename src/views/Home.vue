<template>
    <div id="cesiumContainer" class="cesiumContainer"></div> 
    <CesiumTool />
    <TreeSide />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import {initCesium} from '../components/BaseCesium';
import CesiumTool from '../components/cesiumTool.vue';
import TreeSide from '../components/TreeSide.vue'

export default defineComponent({
    components:{
        CesiumTool,
        TreeSide
    },
    setup(){
        onMounted(async() => {
            initCesium("cesiumContainer");
        })
    }
})
</script>

<style lang="scss" scoped>
.cesiumContainer{
    width: 100%;
    height:100vh;
    // 自定义背景图--样式start
    // background-image: url(../assets/back.jpg);
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    // 自定义背景图--样式end
}
</style>
<style>
/* 去除版权信息 */
.cesium-viewer-bottom{
    display:none;
}
</style>