import mitt from "mitt";
function scrollToBottom(ref) {
    requestAnimationFrame(()=>{
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    });
}
const emitter = mitt();
function delay(ms, signal) {
    return new Promise((resolve, reject)=>{
        const timeout = setTimeout(()=>{
            resolve();
        }, ms);
        if (signal) signal.addEventListener("abort", ()=>{
            clearTimeout(timeout);
            reject(new Error("stopped"));
        });
    });
}
export { delay, emitter, scrollToBottom };
