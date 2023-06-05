<template>
    <!-- 场景出图 -->
    <div class="baseImage">
        <img src="@/assets/sceneIcon/image.svg" title="场景出图"  @click="imgShow = !imgShow"/>
    </div>
    <div class="imageAction" v-show="imgShow">
        <div class="imageAction-detail"  v-for="(item,index) in sceneIcon" :key="index">
            <img 
                :src="item.src" 
                :title="item.name"
                @click="selectAction(item.id,index)"
                :class="sceneIndex===index ? 'active': 'default'"
            />
        </div>
    </div>
    <el-dialog v-model="dialogVisible" title="场景出图" width="50%" draggable>
        <img :src="dialogImage" style="width:100%;"/>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import imgSee from "@/assets/sceneIcon/imgSee.svg";
import imgDown from "@/assets/sceneIcon/imgDown.svg";
import thumb from "@/assets/sceneIcon/thumb.svg";
import {exportImage} from "./exportImg.ts";
export default defineComponent({
    setup(){
        const imgShow = ref(false);
        const sceneIcon = [
            {name: "查看场景图片", src: imgSee, id: 'see'},
            {name: "下载场景图片", src: imgDown, id: 'down'},
            {name: "下载场景缩略图", src: thumb, id: 'thumb'},
        ];
        const sceneIndex = ref(-1);
        const dialogVisible = ref(false);
        const dialogImage = ref("");
        const selectAction = (id:Object,index:number) => {
            imgShow.value = false;
            sceneIndex.value = index;
            switch (id){
                case 'see':
                    dialogVisible.value = true;
                    exportImage({
                        download: false,
                        callback: (base64:any) => {
                            dialogImage.value = base64;
                        }
                    });
                    break;
                case 'down':
                    exportImage({});
                    break;
                case 'thumb':
                    exportImage({
                        download: true,
                        height: 300,//指定宽度或者高度，对应自动缩放
                    });
                    break;
                default:
                    break;
            }
            sceneIndex.value = -1;
        }
        return {
            imgShow,
            sceneIcon,
            sceneIndex,
            selectAction,
            dialogVisible,
            dialogImage
        }
    }
})
</script>

<style lang="scss" scoped>
.baseImage{
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
.baseImage:hover{
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
.imageAction{
    position: absolute;
    width: 70px;
    height: 20px;
    right: 70px;
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
        }
    } 
}
</style>