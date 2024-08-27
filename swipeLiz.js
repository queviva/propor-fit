((D) => {
    document.addEventListener('DOMContentLoaded', () => {
        const O = Object,
              J = JSON.parse,
              P = O.assign({
                  selector: 'swipe',
                  minSwipe: 40,
                  maxTime: 200,
                  eventName: 'swipe',
              }, J(O.values(D)[0] || '{}')),
              X = P.selector,
              getDir = (dx, dy, tHold) => {
                  tHold = (tHold * window.devicePixelRatio || 1) ** 2;
                  return dx ** 2 > tHold && dx ** 2 > dy ** 2 ?
                      (dx > 0 ? 'right' : 'left') :
                      dy ** 2 > tHold && dy ** 2 > dx ** 2 ?
                      (dy > 0 ? 'down' : 'up') :
                      '';
              };
              
        class T { x; y; time; on }

        document.querySelectorAll(`[data-${X}]:not(script)`).forEach(o => {
            
            let tc = 0, allowMore = true;
                
            const
            F = O.assign({}, P, J(o.dataset[X] || '{}')),
            
            t1 = new T(),
            t2 = new T(),

            manageStart = e => {
                if (!allowMore) return;
                const t = tc ? t2 : t1;
                tc = tc ? 2 : 1;
                
                t.x = e.touches[0].clientX;
                t.y = e.touches[0].clientY;
                t.time = Date.now();
                t.on = true;
            
                o.addEventListener('touchend', v => manageEnd(v, t), { once: true });
                allowMore = tc !== 2;
            },

            manageEnd = (e, t) => {
                tc -= 1;
                t.on = false;
                
                const dir = (Date.now() - t.time < F.maxTime) ?
                    getDir(
                        e.changedTouches[0].clientX - t.x,
                        e.changedTouches[0].clientY - t.y,
                        F.minSwipe
                    ) : '';
            
                if (dir) {
                    o.dispatchEvent(new CustomEvent(F.eventName, {
                        detail: { dir: (t === t2 ? 'two' : '') + dir }
                    }));
                }
            
                allowMore = !(t1.on || t2.on);
            };

            o.addEventListener('touchstart', manageStart);
            
        });
    });
})(document.currentScript.dataset);
