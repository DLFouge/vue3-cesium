<template>
    <div id="cesiumContainer"></div> 
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import {initCesium} from '../components/BaseCesium';
export default defineComponent({
    setup(){
        onMounted(() => {
            initCesium("cesiumContainer");
        })
    }
})
</script>

<style lang="scss" scoped>
#cesiumContainer{
    width: 100%;
    height:100vh;
}
</style>
<style>
/* 去除版权信息 */
.cesium-viewer-bottom{
    display:none;
}
</style>