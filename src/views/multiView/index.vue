<template>
    <!-- 多视图 -->
    <div class="multiImage">
        <img src="@/assets/viewTool/multi.svg" title="多视图"  @click="viewShow = !viewShow"/>
    </div>
    <div class="multiBox" v-show="viewShow">
        <div class="multiBox-detail"  v-for="(item,index) in viewIcon" :key="index">
            <img 
                :src="item.src" 
                :title="item.name"
                @click="selectChange(item.name,index)"
                :class="viewIndex===index ? 'active': 'default'"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue';
import hawkEye from "@/assets/viewTool/hawkEye.svg"
import swipe from "@/assets/viewTool/swipe.svg"
import double from "@/assets/viewTool/double.svg"
import {useRouter} from 'vue-router'

export default defineComponent({
    setup(){
        const router = useRouter();
        const viewShow = ref(false);
        const viewIcon = [{
            name: 'cesium鹰眼',
            src: hawkEye,
        },
        {
            name: 'openlayers鹰眼',
            src: hawkEye
        },
        {
            name: 'leaflet鹰眼',
            src: hawkEye
        },
        {
            name: '卷帘',
            src: swipe
        },
        {
            name: '分屏',
            src: double
        }];
        const viewIndex = ref(-1);
        const selectChange = (name:string,index:number) => {
            console.log("xuanze",name);
            viewIndex.value = index;
            switch(name){
                case 'cesium鹰眼':
                    router.push('/hawkEyeC');
                    break;
                case 'openlayers鹰眼':
                    router.push('/hawkEyeO');
                    break;
                case "leaflet鹰眼":
                    router.push('/hawkEyeL');
                    break
                case '卷帘':
                    router.push('/swipe');
                    break;
                case "分屏":
                    router.push('/doubleView');
                    break
                default:   
                    viewIndex.value = -1;
                    break;
            }
        }
        return{
            viewShow,
            viewIcon,
            viewIndex,
            selectChange
        }
    }
})
</script>

<style scoped lang="scss">
.multiImage{
    width: 20px;
    height: 20px; 
    margin-right: 10px;
    border-radius:2px;
    img{
        width: 20px;
        height: 20px; 
        cursor: pointer;
    }
}
.multiImage:hover{
    border: 1px solid rgb(0, 255, 242);
    // background: rgba(0, 255, 242, 0.8);
}
.active{
    border: 1px solid rgb(0, 255, 242);
    background: rgba(0, 255, 242, 0.8);
}
.default{
    border: unset;
    background: unset;
}
.multiBox{
    position: absolute;
    width: 160px;
    height: 20px;
    right: 60px;
    top: 35px;
    background: rgba(60, 60, 60, 0.9);
    padding: 5px;
    display: flex;
    flex-wrap:wrap;
    &-detail{
        border-radius:5px;
        img{
            width: 20px;
            height: 20px;
            cursor: pointer;
            margin-right: 10px;
        }
    } 
}
</style>