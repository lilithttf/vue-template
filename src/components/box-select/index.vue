<template>
  <div class="box-select__container" @mousedown.left="mouseDown" @mousemove.stop="mouseMove" :class="uuid">
    <div class="box-select__coordinate" :style="style" ref="selectContainer"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { debounce, isNumber } from "lodash";
import { withDefaults, ref, onUnmounted, nextTick, shallowRef, defineEmits, reactive } from "vue";
import type { CSSProperties } from 'vue'

interface Props {
  node: string;
  selectedClass?: string;
}

// interface CssType = Partial<Pick<CSSStyleDeclaration, cssTypeKey>>

const props = withDefaults(defineProps<Props>(), {
  selectedClass: "box-select__hypocritical"
})
// const props = defineProps({
//   node: {
//     required: true,
//     type: String,
//   },
//   selectedClass: {
//     type: String,
//     default: "box-select__hypocritical",
//   },
// })

const emit = defineEmits(["mouseUp", "mouseDown", "selectList"])

// mouseOn记录是框选还是点击
let top = 0, left = 0, width = 0, height = 0, startX = 0, startY = 0, timer: NodeJS.Timeout | null = null, mouseOn = false

let style = ref<CSSProperties>({}), selectContainer = ref<Element>(), uuid = shallowRef("uuid_" + new Date().valueOf())

const isWithinRange = (dom: Element, top: number, bottom: number, left: number, right: number) => {
  const eleRect = dom.getBoundingClientRect();
  return !(
    eleRect.top > bottom ||
    eleRect.bottom < top ||
    eleRect.right < left ||
    eleRect.left > right
  )
}

const query = (className = "") => {
  let domName = `.${uuid.value} ${props.node}`;
  className && (domName += `.${className}`);
  return Array.from(document.querySelectorAll(domName) || []);
}

interface DOMMethod {
  add?: string;
  contains?: string;
}

type cssTypeKey = 'top' | 'left' | 'width' | 'height' | 'display'

const classOperation = (ele: Element, method: keyof DOMMethod = "add", className = "") => {
  const classList: DOMTokenList = ele.classList
  if (classList[method] instanceof Function) {
    classList[method](className)
  }
}

const setStyle = (styles: CSSProperties = {}, newStyles: CSSProperties = {}) => {
  for (let key in styles) {
    let k = key as cssTypeKey
    let val = styles[k]
    if (isNumber(val)) {
      val = val + "px"
    }
    newStyles[k] = val
  }
  style.value = newStyles
}

const getAreaWithinElements = () => {
  if (!selectContainer.value) {
    return
  }
  const { bottom, left, right, top } = selectContainer.value.getBoundingClientRect();

  // 所有可框选元素
  const elements = query();
  // // 已选中元素
  // const selectedElements = elements.filter((item) =>
  //   classOperation(item, "contains", props.selectedClass)
  // );
  // // 未选中元素
  // const unselectedElements = elements.filter(
  //   (item) => !classOperation(item, "contains", props.selectedClass)
  // );
  // 本次框选元素
  let selctList = [];
  for (const i in elements) {
    if (Number(i) || i === "0") {
      let val = elements[i];
      const withinRange = isWithinRange(val, top, bottom, left, right);
      if (withinRange) {
        selctList.push(val);
      }
    }
  }

  emit("selectList", selctList);
  // selectedElements.map((item) => {
  //     const withinRange = isWithinRange(item, top, bottom, left, right);
  //     withinRange &&
  //       classOperation(item, "add", props.selectedClass)
  //   });
  //   unselectedElements.map(
  //     (item) =>
  //       isWithinRange(item, top, bottom, left, right) &&
  //       classOperation(item, "add", props.selectedClass)
  //   );

  // return query(props.selectedClass);
};

const mouseDown = debounce((event) => {
  timer = setTimeout(() => {
    mouseOn = true;
    startX = event.clientX;
    startY = event.clientY;
    emit("mouseDown");
  }, 300);
  // 重置本次框选的元素列表
  setStyle({
    left,
    top: startY,
    width: 0,
    height: 0,
    display: "block",
  });
});

const mouseMove = debounce((event) => {
  if (!mouseOn) return false;
  const _width = event.clientX - startX;
  const _height = event.clientY - startY;

  top = _height > 0 ? startY : event.clientY;
  left = _width > 0 ? startX : event.clientX;
  width = Math.abs(_width);
  height = Math.abs(_height);
  setStyle({ left, top, width, height });
});

const mouseUp = debounce((event) => {
  timer && clearTimeout(timer);
  // 判断是否鼠标左键
  if (event.which !== 1) return false;
  // 判断是框选还是点击
  if (!mouseOn) return false;
  mouseOn = false;
  setStyle({ display: "none" });
  // 获得已选中的元素
  const selectedEles = getAreaWithinElements();
  // 响应事件,并传递本次框选的元素列表
  emit("mouseUp", selectedEles);
});

nextTick(() => document.addEventListener("mouseup", mouseUp));
onUnmounted(() => document.removeEventListener("mouseup", mouseUp));

// classOperation 增加或删除class
defineExpose({
  classOperation
})

// export default {
//   name: "BoxSelect",
//   setup(props, { emit }) {
//     let top = 0,
//       left = 0,
//       width = 0,
//       height = 0,
//       startX = 0,
//       startY = 0,
//       timer = null,
//       // 记录是框选还是点击
//       mouseOn = false;

//     const style = ref({}),
//       selectContainer = ref(null),
//       // 给当前框容器加一个唯一识别符, 以保证所选择到的元素都是当前容器的. 否则会选择到容器外同名的元素
//       uuid = shallowRef("uuid_" + new Date().valueOf());

//     const query = (className = "") => {
//       let domName = `.${uuid.value} ${props.node}`;
//       className && (domName += `.${className}`);
//       return Array.from(document.querySelectorAll(domName) || []);
//     };

//     const classOperation = (ele, method = "add", className = "") =>
//       ele.classList[method](className);

//     const setStyle = (styles = {}, newStyles = {}) => {
//       Object.keys(styles).map((item) => {
//         newStyles[item] = styles[item] + (isNumber(styles[item]) ? "px" : "");
//       });
//       style.value = newStyles;
//     };

//     const getAreaWithinElements = () => {
//       const { bottom, left, right, top } =
//         selectContainer.value.getBoundingClientRect();

//       // 所有可框选元素
//       const elements = query();
//       // // 已选中元素
//       // const selectedElements = elements.filter((item) =>
//       //   classOperation(item, "contains", props.selectedClass)
//       // );
//       // // 未选中元素
//       // const unselectedElements = elements.filter(
//       //   (item) => !classOperation(item, "contains", props.selectedClass)
//       // );
//       // 本次框选元素
//       let selctList = [];
//       for (const i in elements) {
//         if (Number(i) || i === "0") {
//           let val = elements[i];
//           const withinRange = isWithinRange(val, top, bottom, left, right);
//           if (withinRange) {
//             selctList.push(val);
//           }
//         }
//       }

//       emit("selectList", selctList);
//       // selectedElements.map((item) => {
//       //     const withinRange = isWithinRange(item, top, bottom, left, right);
//       //     withinRange &&
//       //       classOperation(item, "add", props.selectedClass)
//       //   });
//       //   unselectedElements.map(
//       //     (item) =>
//       //       isWithinRange(item, top, bottom, left, right) &&
//       //       classOperation(item, "add", props.selectedClass)
//       //   );

//       // return query(props.selectedClass);
//     };

//     const mouseDown = debounce((event) => {
//       timer = setTimeout(() => {
//         mouseOn = true;
//         startX = event.clientX;
//         startY = event.clientY;
//         emit("mouseDown");
//       }, 300);
//       // 重置本次框选的元素列表
//       setStyle({
//         left,
//         startX,
//         top: startY,
//         width: 0,
//         height: 0,
//         display: "block",
//       });
//     });

//     const mouseMove = debounce((event) => {
//       if (!mouseOn) return false;
//       const _width = event.clientX - startX;
//       const _height = event.clientY - startY;

//       top = _height > 0 ? startY : event.clientY;
//       left = _width > 0 ? startX : event.clientX;
//       width = Math.abs(_width);
//       height = Math.abs(_height);
//       setStyle({ left, top, width, height });
//     });

//     const mouseUp = debounce((event) => {
//       timer && clearTimeout(timer);
//       // 判断是否鼠标左键
//       if (event.which !== 1) return false;
//       // 判断是框选还是点击
//       if (!mouseOn) return false;
//       mouseOn = false;
//       setStyle({ display: "none" });
//       // 获得已选中的元素
//       const selectedEles = getAreaWithinElements();
//       // 响应事件,并传递本次框选的元素列表
//       emit("mouseUp", selectedEles);
//     });

//     nextTick(() => document.addEventListener("mouseup", mouseUp));
//     onUnmounted(() => document.removeEventListener("mouseup", mouseUp));

//     return {
//       mouseUp,
//       mouseDown,
//       mouseMove,
//       timer,
//       style,
//       selectContainer,
//       uuid,
//     };
//   },
// };
</script>

<style lang="scss">
.box-select__coordinate {
  position: fixed;
  z-index: 11;
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  background: rgb(106, 90, 205, .5);
  border: 1px solid blue;
  opacity: 0.6;
  pointer-events: none;
}

.box-select__hypocritical {
  background-color: blue;
}
</style>