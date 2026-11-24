import { useEffect, useRef } from 'react';

export function usePerspective<T extends HTMLElement>(amplitude=6) {
  const ref=useRef<T>(null);
  useEffect(()=>{
    const node=ref.current;
    if(!node)return;
    const pointer=window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame=0;
    const reset=()=>{
      cancelAnimationFrame(frame);
      node.style.removeProperty('--tilt-x');
      node.style.removeProperty('--tilt-y');
      node.style.removeProperty('--shift-x');
      node.style.removeProperty('--shift-y');
    };
    const move=(event:PointerEvent)=>{
      if(!pointer.matches||event.pointerType==='touch')return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const box=node.getBoundingClientRect();
        const x=(event.clientX-box.left)/box.width-.5;
        const y=(event.clientY-box.top)/box.height-.5;
        node.style.setProperty('--tilt-x',(-y*amplitude).toFixed(2)+'deg');
        node.style.setProperty('--tilt-y',(x*amplitude).toFixed(2)+'deg');
        node.style.setProperty('--shift-x',(x*amplitude*2).toFixed(2)+'px');
        node.style.setProperty('--shift-y',(y*amplitude*2).toFixed(2)+'px');
      });
    };
    node.addEventListener('pointermove',move,{passive:true});
    node.addEventListener('pointerleave',reset);
    pointer.addEventListener('change',reset);
    return ()=>{
      reset();
      node.removeEventListener('pointermove',move);
      node.removeEventListener('pointerleave',reset);
      pointer.removeEventListener('change',reset);
    };
  },[amplitude]);
  return ref;
}
