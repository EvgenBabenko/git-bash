import mitt from "mitt";
function scrollToBottom(ref) {
    requestAnimationFrame(()=>{
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    });
}
const emitter = mitt();
function delay(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
export { delay, emitter, scrollToBottom };
